import { X, Star, ArrowRight } from 'lucide-react';
import type { Course } from '@/data/courses';
import { useAuth } from '@/lib/auth-context';
import { useCheckout } from '@/lib/checkout-context';
import { Button } from '@/components/ui/button';

export function CourseDetailsModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const { requireAuth } = useAuth();
  const { openCheckout } = useCheckout();

  function handleBuyNow() {
    requireAuth(() => {
      openCheckout(course);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`course-art ${course.art} !aspect-[16/9] rounded-t-3xl sm:rounded-t-3xl`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink"
            aria-label="Close"
          >
            <X size={15} />
          </button>
          <span className="mono-font text-[10px] uppercase text-white/80">{course.level}</span>
          <span className="course-art-label display-font">{course.title}</span>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-ink/55">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {course.rating}
            </span>
            <span>{course.students} learners</span>
            <span>· {course.duration}</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink/70">{course.description}</p>

          <div className="mt-5 flex items-baseline gap-2">
            <strong className="text-2xl text-ink">₹{course.price.toLocaleString('en-IN')}</strong>
            {course.oldPrice && (
              <span className="text-sm text-ink/40 line-through">
                ₹{course.oldPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <Button size="lg" className="mt-6 w-full" onClick={handleBuyNow}>
            Buy now <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
