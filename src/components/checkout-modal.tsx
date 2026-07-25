import { X, ShieldCheck } from 'lucide-react';
import { useCheckout } from '@/lib/checkout-context';
import { useToast } from '@/lib/toast-context';
import { Button } from '@/components/ui/button';

export function CheckoutModal() {
  const { course, closeCheckout } = useCheckout();
  const showToast = useToast();

  if (!course) return null;

  function handlePay() {
    showToast(`You're enrolled in ${course!.title}. Check your email for details.`);
    closeCheckout();
  }

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 p-4" onClick={closeCheckout}>
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Complete your order</h2>
          <button
            onClick={closeCheckout}
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink/60 hover:text-ink"
            aria-label="Close checkout"
          >
            <X size={15} />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between border-y border-line py-4">
          <div>
            <p className="text-sm font-semibold text-ink">{course.title}</p>
            <p className="text-xs text-ink/50">{course.duration} · lifetime access</p>
          </div>
          <div className="text-right">
            <strong className="text-sm text-ink">₹{course.price.toLocaleString('en-IN')}</strong>
            {course.oldPrice && (
              <p className="text-xs text-ink/40 line-through">
                ₹{course.oldPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm font-semibold text-ink">
          <span>Total</span>
          <span>₹{course.price.toLocaleString('en-IN')}</span>
        </div>

        <Button size="lg" className="mt-5 w-full" onClick={handlePay}>
          Pay ₹{course.price.toLocaleString('en-IN')}
        </Button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink/40">
          <ShieldCheck size={13} /> Secure checkout
        </p>
      </div>
    </div>
  );
}
