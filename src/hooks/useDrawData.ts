import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/ClerkAuthContext';
import { format, startOfMonth } from 'date-fns';

// Get current month as DATE (first day of month)
const getCurrentMonth = () => format(startOfMonth(new Date()), 'yyyy-MM-dd');

// Types matching database schema
export interface Prize {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  month: string;
  is_active: boolean;
  created_at: string;
}

export interface Code {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DrawEntry {
  id: string;
  user_id: string;
  code_id: string;
  month: string;
  created_at: string;
}

export interface Winner {
  id: string;
  user_id: string;
  prize_id: string | null;
  month: string;
  is_public: boolean;
  notified_at: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
  prizes?: Prize | null;
}

// Hook to get current month's prize
export const useCurrentPrize = () => {
  return useQuery({
    queryKey: ['current-prize'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prizes')
        .select('*')
        .eq('is_active', true)
        .gte('month', getCurrentMonth())
        .order('month', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Prize | null;
    },
  });
};

// Hook to get all prizes (admin)
export const usePrizes = () => {
  return useQuery({
    queryKey: ['prizes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prizes')
        .select('*')
        .order('month', { ascending: false });

      if (error) throw error;
      return data as Prize[];
    },
  });
};

// Hook to get user's entries
export const useUserEntries = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-entries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('draw_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DrawEntry[];
    },
    enabled: !!user,
  });
};

// Hook to check if user has entered current month
export const useHasEnteredThisMonth = () => {
  const { user } = useAuth();
  const currentMonth = getCurrentMonth();
  
  return useQuery({
    queryKey: ['has-entered-month', user?.id, currentMonth],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('draw_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user,
  });
};

// Hook to get public winners
export const usePublicWinners = () => {
  return useQuery({
    queryKey: ['public-winners'],
    queryFn: async () => {
      const { data: winnersData, error } = await supabase
        .from('winners')
        .select('*')
        .eq('is_public', true)
        .order('month', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (!winnersData) return [];

      // Fetch profiles and prizes separately
      const winners = await Promise.all(
        winnersData.map(async (winner) => {
          const [profileResult, prizeResult] = await Promise.all([
            supabase.from('profiles').select('full_name').eq('user_id', winner.user_id).maybeSingle(),
            winner.prize_id ? supabase.from('prizes').select('*').eq('id', winner.prize_id).maybeSingle() : null,
          ]);
          
          return {
            ...winner,
            profiles: profileResult.data,
            prizes: prizeResult?.data || null,
          } as Winner;
        })
      );

      return winners;
    },
  });
};

// Hook to submit a code entry
export const useSubmitCode = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (code: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const currentMonth = getCurrentMonth();
      
      // Check if user already entered this month
      const { data: existingEntry } = await supabase
        .from('draw_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .maybeSingle();
        
      if (existingEntry) {
        throw new Error('You have already entered this month\'s draw');
      }
      
      // Find the code
      const { data: codeData, error: codeError } = await supabase
        .from('codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();
        
      if (codeError) throw codeError;
      if (!codeData) throw new Error('Invalid code. Please check and try again.');
      if (codeData.is_used) throw new Error('This code has already been used.');
      
      // Mark code as used
      const { error: updateError } = await supabase
        .from('codes')
        .update({
          is_used: true,
          used_by: user.id,
          used_at: new Date().toISOString(),
        })
        .eq('id', codeData.id);
        
      if (updateError) throw updateError;
      
      // Create draw entry
      const { data: entry, error: entryError } = await supabase
        .from('draw_entries')
        .insert({
          user_id: user.id,
          code_id: codeData.id,
          month: currentMonth,
        })
        .select()
        .single();
        
      if (entryError) throw entryError;
      
      return entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-entries'] });
      queryClient.invalidateQueries({ queryKey: ['has-entered-month'] });
    },
  });
};

// Admin hooks
export const useAllEntries = () => {
  return useQuery({
    queryKey: ['all-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('draw_entries')
        .select(`
          *,
          profiles:user_id (full_name),
          codes:code_id (code)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useAllCodes = () => {
  return useQuery({
    queryKey: ['all-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Code[];
    },
  });
};

export const useAllWinners = () => {
  return useQuery({
    queryKey: ['all-winners'],
    queryFn: async () => {
      const { data: winnersData, error } = await supabase
        .from('winners')
        .select('*')
        .order('month', { ascending: false });

      if (error) throw error;
      if (!winnersData) return [];

      const winners = await Promise.all(
        winnersData.map(async (winner) => {
          const [profileResult, prizeResult] = await Promise.all([
            supabase.from('profiles').select('full_name').eq('user_id', winner.user_id).maybeSingle(),
            winner.prize_id ? supabase.from('prizes').select('*').eq('id', winner.prize_id).maybeSingle() : null,
          ]);
          
          return {
            ...winner,
            profiles: profileResult.data,
            prizes: prizeResult?.data || null,
          } as Winner;
        })
      );

      return winners;
    },
  });
};

// Admin statistics
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const currentMonth = getCurrentMonth();
      
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      // Get current month entries count
      const { count: currentMonthEntries } = await supabase
        .from('draw_entries')
        .select('*', { count: 'exact', head: true })
        .eq('month', currentMonth);
        
      // Get total codes
      const { count: totalCodes } = await supabase
        .from('codes')
        .select('*', { count: 'exact', head: true });
        
      // Get used codes
      const { count: usedCodes } = await supabase
        .from('codes')
        .select('*', { count: 'exact', head: true })
        .eq('is_used', true);
        
      return {
        totalUsers: totalUsers || 0,
        currentMonthEntries: currentMonthEntries || 0,
        totalCodes: totalCodes || 0,
        usedCodes: usedCodes || 0,
      };
    },
  });
};
