import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export type Profile = {
  id: string;
  email: string;
  name: string;
  phone: string;
  state: string;
};

function profileFromRow(row: any): Profile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    state: row.state,
  };
}

type ProfileContextValue = { profile: Profile | null; loading: boolean };

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function load() {
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).maybeSingle();
      if (!cancelled) {
        setProfile(data ? profileFromRow(data) : null);
        setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel(`profile-${user.id}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        load,
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return <ProfileContext.Provider value={{ profile, loading }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

export async function upsertProfile(patch: { name: string; phone: string; state: string }) {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) throw new Error('Not logged in');

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    name: patch.name,
    phone: patch.phone,
    state: patch.state,
  });
  if (error) throw error;
}
