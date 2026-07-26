import { useState, type FormEvent } from 'react';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useProfile, upsertProfile } from '@/lib/profile';
import { INDIAN_STATES } from '@/lib/indian-states';
import { Button } from '@/components/ui/button';

export function ProfileFormModal({ onSaved }: { onSaved?: () => void }) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const shouldShow = !authLoading && !profileLoading && !!user && !profile;
  if (!shouldShow) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Enter your name');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    if (!state) {
      setError('Select your state');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await upsertProfile({ name: name.trim(), phone, state });
      onSaved?.();
    } catch {
      setError('Something went wrong, please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
          <GraduationCap size={20} />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-ink">Complete your profile</h2>
        <p className="mt-1.5 text-sm text-ink/60">
          A few details before you continue, {user?.email}.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <label className="text-sm">
            <span className="mb-1.5 block text-xs font-semibold text-ink/60">Full name</span>
            <input
              autoFocus
              className="admin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="text-sm">
            <span className="mb-1.5 block text-xs font-semibold text-ink/60">Mobile number</span>
            <div className="flex items-center rounded-xl border border-line px-4 focus-within:border-ink">
              <span className="text-sm text-ink/50">+91</span>
              <input
                inputMode="numeric"
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="h-12 w-full bg-transparent px-3 text-sm outline-none"
              />
            </div>
          </label>

          <label className="text-sm">
            <span className="mb-1.5 block text-xs font-semibold text-ink/60">State</span>
            <select className="admin-input" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={saving}>
            {saving ? 'Saving…' : 'Save & continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
