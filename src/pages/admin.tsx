import { useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Link } from 'wouter';
import { LogOut, ShieldAlert } from 'lucide-react';
import { supabase, ADMIN_EMAIL } from '@/lib/supabase';
import { AdminCourses } from '@/components/admin/admin-courses';
import { AdminBanners } from '@/components/admin/admin-banners';
import { AdminTestimonials } from '@/components/admin/admin-testimonials';
import { AdminSettings } from '@/components/admin/admin-settings';
import { AdminVideos } from '@/components/admin/admin-videos';
import { Button } from '@/components/ui/button';

const tabs = ['Courses', 'Videos', 'Banners', 'Reviews', 'Site text'] as const;
type Tab = (typeof tabs)[number];

function AdminLogin() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError('Wrong email or password.');
    setLoading(false);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-lg">
        <h1 className="text-xl font-bold text-ink">Admin login</h1>
        <p className="mt-1 text-sm text-ink/60">Sign in to edit ExpHub.</p>

        <label className="mt-5 block text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Email</span>
          <input
            type="email"
            className="admin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="mt-3 block text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Password</span>
          <input
            type="password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </label>

        {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>

        <Link href="/" className="mt-4 block text-center text-xs text-ink/40 hover:text-ink">
          Back to site
        </Link>
      </form>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>('Courses');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="grid min-h-screen place-items-center text-sm text-ink/50">Loading…</div>;
  }

  if (!session) {
    return <AdminLogin />;
  }

  if (session.user.email !== ADMIN_EMAIL) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <ShieldAlert className="mx-auto mb-3 text-red-500" />
        <p className="text-sm text-ink/60">This account isn&apos;t authorized to edit ExpHub.</p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-4 text-xs font-semibold text-brand underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-10 border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-bold text-ink">ExpHub Admin</p>
            <p className="text-xs text-ink/50">{session.user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-semibold text-ink/60 hover:text-ink">
              View site
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-5xl gap-1 px-4 pb-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t ? 'bg-ink text-white' : 'text-ink/60 hover:bg-black/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === 'Courses' && <AdminCourses />}
        {tab === 'Videos' && <AdminVideos />}
        {tab === 'Banners' && <AdminBanners />}
        {tab === 'Reviews' && <AdminTestimonials />}
        {tab === 'Site text' && <AdminSettings />}
      </main>
    </div>
  );
}
