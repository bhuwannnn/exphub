import { useEffect, useState, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate('/admin'), 1500);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-lg">
        <h1 className="text-xl font-bold text-ink">Set a new password</h1>

        {!ready ? (
          <p className="mt-3 text-sm text-ink/60">
            Verifying your recovery link… if this doesn&rsquo;t update in a few seconds, the link may
            have expired.
          </p>
        ) : done ? (
          <p className="mt-3 text-sm text-ink/60">Password updated. Redirecting to admin login…</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5">
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-semibold text-ink/60">New password</span>
              <input
                type="password"
                autoFocus
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

            <Button type="submit" size="lg" className="mt-5 w-full" disabled={saving}>
              {saving ? 'Saving…' : 'Update password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
