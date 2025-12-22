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
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        // Fetch or create profile in Supabase
        fetchOrCreateProfile(clerkUser.id);
        checkAdminRole(clerkUser.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const fetchOrCreateProfile = async (userId: string) => {
    // First try to find existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!fetchError && existingProfile) {
      setProfile(existingProfile as Profile);
      return;
    }

    // If no profile exists, create one
    if (!existingProfile && clerkUser) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: clerkUser.fullName || clerkUser.firstName || null,
          avatar_url: clerkUser.imageUrl || null,
        })
        .select()
        .single();

      if (!insertError && newProfile) {
        setProfile(newProfile as Profile);
        
        // Also create user role
        await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'user' });
      }
    }
  };

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (!error && data) {
      setIsAdmin(true);
    } else {
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
