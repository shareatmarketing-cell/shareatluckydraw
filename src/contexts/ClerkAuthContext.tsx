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
    const initAuth = async () => {
      if (isLoaded) {
        if (isSignedIn && clerkUser) {
          // Fetch or create profile in Supabase
          const profileData = await fetchOrCreateProfile(clerkUser.id);
          // Check admin role using the profile's user_id (which might differ from Clerk ID)
          if (profileData?.user_id) {
            await checkAdminRole(profileData.user_id);
          }
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
    // First try to find existing profile by Clerk user ID
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', clerkUserId)
      .maybeSingle();

    if (!fetchError && existingProfile) {
      setProfile(existingProfile as Profile);
      return existingProfile as Profile;
    }

    // Check if there's an existing profile with matching name that needs migration
    if (!existingProfile && clerkUser) {
      const userName = clerkUser.fullName || clerkUser.firstName;
      if (userName) {
        const { data: matchingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('full_name', userName)
          .maybeSingle();
        
        if (matchingProfile) {
          // Found existing profile - update it to use Clerk ID and return it
          // Also migrate the user role
          const oldUserId = matchingProfile.user_id;
          
          await supabase
            .from('profiles')
            .update({ user_id: clerkUserId })
            .eq('id', matchingProfile.id);
          
          await supabase
            .from('user_roles')
            .update({ user_id: clerkUserId })
            .eq('user_id', oldUserId);
          
          const updatedProfile = { ...matchingProfile, user_id: clerkUserId };
          setProfile(updatedProfile as Profile);
          return updatedProfile as Profile;
        }
      }

      // No existing profile found, create a new one
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
        setProfile(newProfile as Profile);
        
        // Also create user role
        await supabase
          .from('user_roles')
          .insert({ user_id: clerkUserId, role: 'user' });
        
        return newProfile as Profile;
      }
    }
    return null;
  };

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    setIsAdmin(!error && !!data);
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
