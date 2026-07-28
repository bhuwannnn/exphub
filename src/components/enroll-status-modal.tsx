import { Loader2, PartyPopper, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';
import { useEnrollStatus } from '@/lib/enroll-status-context';
import { Button } from '@/components/ui/button';

export function EnrollStatusModal() {
  const { status, close } = useEnrollStatus();

  if (!status) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4"
      onClick={status.phase !== 'loading' ? close : undefined}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {status.phase === 'loading' && (
          <>
            <Loader2 size={40} className="mx-auto animate-spin text-brand" />
            <p className="mt-5 text-base font-bold text-ink">Enrolling you in {status.courseTitle}…</p>
            <p className="mt-1.5 text-sm text-ink/50">Setting up your access, hang tight.</p>
          </>
        )}

        {status.phase === 'success' && (
          <>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
              <PartyPopper size={26} />
            </div>
            <h2 className="mt-5 text-xl font-bold text-ink">You&rsquo;re enrolled!</h2>
            <p className="mt-1.5 text-sm text-ink/60">
              {status.courseTitle} is now available under My Courses.
            </p>
            <Link href="/my-courses" onClick={close}>
              <Button size="lg" className="mt-6 w-full">
                Go to My Courses
              </Button>
            </Link>
          </>
        )}

        {status.phase === 'error' && (
          <>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={26} />
            </div>
            <h2 className="mt-5 text-xl font-bold text-ink">Enrollment failed</h2>
            <p className="mt-1.5 text-sm text-ink/60">
              Something went wrong enrolling you in {status.courseTitle}. Please try again.
            </p>
            <Button size="lg" className="mt-6 w-full" onClick={close}>
              Close
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
