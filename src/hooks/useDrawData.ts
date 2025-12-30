import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/ClerkAuthContext';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
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
  is_grand_prize?: boolean;
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

// Hook to get current month's prize (prizes table is still public)
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

// Hook to get current month's grand prize
export const useCurrentGrandPrize = () => {
  return useQuery({
    queryKey: ['current-grand-prize'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prizes')
        .select('*')
        .eq('is_active', true)
        .eq('is_grand_prize', true)
        .gte('month', getCurrentMonth())
        .order('month', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Prize | null;
    },
  });
};

// Hook to get all prizes (prizes table is still public)
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

// Hook to get user's entries (now uses edge function for security)
export const useUserEntries = () => {
  const { user } = useAuth();
  const { getToken } = useClerkAuth();
  
  return useQuery({
    queryKey: ['user-entries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const token = await getToken();
      if (!token) return [];

      const { data, error } = await supabase.functions.invoke('get-user-data', {
        body: { action: 'get_entries' },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return (data?.data || []) as DrawEntry[];
    },
    enabled: !!user,
  });
};

// Hook to check if user has entered current month (now uses edge function)
export const useHasEnteredThisMonth = () => {
  const { user } = useAuth();
  const { getToken } = useClerkAuth();
  const currentMonth = getCurrentMonth();
  
  return useQuery({
    queryKey: ['has-entered-month', user?.id, currentMonth],
    queryFn: async () => {
      if (!user) return false;
      
      const token = await getToken();
      if (!token) return false;

      const { data, error } = await supabase.functions.invoke('get-user-data', {
        body: { action: 'has_entered_month', month: currentMonth },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data?.hasEntered || false;
    },
    enabled: !!user,
  });
};

// Hook to get public winners (now uses edge function that returns limited profile data)
export const usePublicWinners = () => {
  return useQuery({
    queryKey: ['public-winners'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-public-data', {
        body: { action: 'get_public_winners', limit: 10 },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.data) return [];

      // Transform to match expected Winner interface
      return data.data.map((winner: { id: string; month: string; is_public: boolean; created_at: string; full_name: string; prize_name: string }) => ({
        id: winner.id,
        month: winner.month,
        is_public: winner.is_public,
        created_at: winner.created_at,
        user_id: '', // Not exposed for privacy
        prize_id: null, // Not exposed
        notified_at: null,
        profiles: { full_name: winner.full_name },
        prizes: { name: winner.prize_name } as Prize,
      })) as Winner[];
    },
  });
};

// Hook to submit a code entry via edge function
export const useSubmitCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ code, token }: { code: string; token: string }) => {
      if (!token) throw new Error('Not authenticated');
      
      const { data, error } = await supabase.functions.invoke('submit-code', {
        body: { code },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-entries'] });
      queryClient.invalidateQueries({ queryKey: ['has-entered-month'] });
    },
  });
};

// Admin hooks - These fetch data through edge functions for security
// Admin status is verified server-side in edge functions

export const useAllEntries = () => {
  const { getToken } = useClerkAuth();
  
  return useQuery({
    queryKey: ['all-entries'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('manage-draw', {
        body: { action: 'get_entries' },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data?.data || [];
    },
  });
};

export const useAllCodes = () => {
  const { getToken } = useClerkAuth();
  
  return useQuery({
    queryKey: ['all-codes'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('manage-codes', {
        body: { action: 'list' },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return (data?.data || []) as Code[];
    },
  });
};

export const useAllWinners = () => {
  const { getToken } = useClerkAuth();
  
  return useQuery({
    queryKey: ['all-winners'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('manage-winners', {
        body: { action: 'list' },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      const winnersData = data?.data || [];
      // Transform to match expected Winner interface
      return winnersData.map((winner: Winner & { full_name?: string; prize_name?: string }) => ({
        ...winner,
        profiles: { full_name: winner.full_name || null },
        prizes: winner.prize_name ? { name: winner.prize_name } as Prize : null,
      })) as Winner[];
    },
  });
};

// Admin statistics - fetched through edge function
export const useAdminStats = () => {
  const { getToken } = useClerkAuth();
  
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('manage-draw', {
        body: { action: 'get_stats' },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      return data?.stats || {
        totalUsers: 0,
        currentMonthEntries: 0,
        totalCodes: 0,
        usedCodes: 0,
      };
    },
  });
};
