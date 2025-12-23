import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: {
    id: string;
    email: string | null;
    created_at: string;
  } | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ClerkAuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { getToken } = useClerkAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Transform Clerk user to our user format
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || null,
    created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
  } : null;

  useEffect(() => {
    const initAuth = async () => {
      if (isLoaded) {
        if (isSignedIn && clerkUser) {
          console.log('[Auth] Clerk user signed in:', clerkUser.id);
          // Fetch or create profile in Supabase
          await fetchOrCreateProfile(clerkUser.id);
          // Check admin role using Clerk user ID directly (stored as text in DB)
          await checkAdminRole(clerkUser.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    };
    initAuth();
  }, [isLoaded, isSignedIn, clerkUser]);

  const fetchOrCreateProfile = async (clerkUserId: string): Promise<Profile | null> => {
    console.log('[Auth] Fetching/creating profile for:', clerkUserId);
    
    // First try to find existing profile by Clerk user ID
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', clerkUserId)
      .maybeSingle();

    if (!fetchError && existingProfile) {
      console.log('[Auth] Found existing profile:', existingProfile);
      setProfile(existingProfile as Profile);
      return existingProfile as Profile;
    }

    // No existing profile found, create a new one
    if (clerkUser) {
      console.log('[Auth] Creating new profile for Clerk user');
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: clerkUserId,
          full_name: clerkUser.fullName || clerkUser.firstName || null,
          avatar_url: clerkUser.imageUrl || null,
        })
        .select()
        .single();

      if (!insertError && newProfile) {
        console.log('[Auth] Created new profile:', newProfile);
        setProfile(newProfile as Profile);
        
        // Also create user role (default to 'user')
        await supabase
          .from('user_roles')
          .insert({ user_id: clerkUserId, role: 'user' });
        
        return newProfile as Profile;
      } else {
        console.error('[Auth] Error creating profile:', insertError);
      }
    }
    return null;
  };

  const checkAdminRole = async (clerkUserId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('get-user-roles', {
        body: { token },
      });

      if (error) {
        console.error('[Auth] Failed to fetch roles:', error);
        setIsAdmin(false);
        return;
      }

      const roles = (data?.roles ?? []) as string[];
      setIsAdmin(roles.includes('admin'));
    } catch (e) {
      console.error('[Auth] Failed to check admin role:', e);
      setIsAdmin(false);
    }
  };

  const signOut = async () => {
    await clerkSignOut();
    setProfile(null);
    setIsAdmin(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      await fetchOrCreateProfile(user.id);
    }

    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAdmin,
      isLoading,
      isSignedIn: !!isSignedIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a ClerkAuthProvider');
  }
  return context;
};
