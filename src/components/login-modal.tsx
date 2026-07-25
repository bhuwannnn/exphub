import { useState, type FormEvent } from 'react';
import { X, GraduationCap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export function LoginModal() {
  const { isLoginOpen, closeLogin, login } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  if (!isLoginOpen) return null;

  function reset() {
    setStep('phone');
    setPhone('');
    setOtp('');
    setError('');
  }

  function handleClose() {
    reset();
    closeLogin();
  }

  function handlePhoneSubmit(event: FormEvent) {
    event.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setStep('otp');
  }

  function handleOtpSubmit(event: FormEvent) {
    event.preventDefault();
    if (!/^\d{4,6}$/.test(otp)) {
      setError('Enter the OTP sent to your phone');
      return;
    }
    login({ name: 'Learner', phone });
    reset();
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full border border-line text-ink/60 hover:text-ink"
          aria-label="Close login"
        >
          <X size={15} />
        </button>

        <div className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
          <GraduationCap size={20} />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-ink">
          {step === 'phone' ? 'Login to continue' : 'Verify your number'}
        </h2>
        <p className="mt-1.5 text-sm text-ink/60">
          {step === 'phone'
            ? 'Please log in or sign up to add courses to cart and checkout.'
            : `We’ve sent a 4-digit code to +91 ${phone}`}
        </p>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="mt-6 flex flex-col gap-3">
            <div className="flex items-center rounded-xl border border-line px-4 focus-within:border-ink">
              <span className="text-sm text-ink/50">+91</span>
              <input
                autoFocus
                inputMode="numeric"
                placeholder="Mobile number"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                className="h-12 w-full bg-transparent px-3 text-sm outline-none"
              />
            </div>
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
            <Button type="submit" size="lg" className="w-full">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="mt-6 flex flex-col gap-3">
            <input
              autoFocus
              inputMode="numeric"
              placeholder="Enter OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-12 w-full rounded-xl border border-line px-4 text-sm tracking-[0.3em] outline-none focus:border-ink"
            />
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
            <Button type="submit" size="lg" className="w-full">
              Verify &amp; continue
            </Button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-xs font-medium text-ink/50 hover:text-ink"
            >
              Change number
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-[11px] text-ink/40">
          By continuing, you agree to ExpHub&rsquo;s Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}
