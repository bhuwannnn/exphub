import { Star, ArrowRight } from 'lucide-react';
import type { Course } from '@/lib/content';
import { useEnrollFlow } from '@/lib/use-enroll-flow';
import { Button } from '@/components/ui/button';

export function CourseCard({ course, onViewDetails }: { course: Course; onViewDetails: () => void }) {
  const handleEnroll = useEnrollFlow(course);

  return (
    <article id={`course-${course.id}`} className="course-card scroll-mt-24">
      <button
        className={`course-art ${course.art} bg-cover bg-center`}
        style={course.image ? { backgroundImage: `url(${course.image})` } : undefined}
        onClick={onViewDetails}
      >
        <span className="course-art-label display-font drop-shadow">{course.title}</span>
      </button>

      <div className="p-5">
        <button className="text-left" onClick={onViewDetails}>
          <h3 className="text-base font-bold text-ink">{course.title}</h3>
        </button>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/60">
          {course.description}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-ink/55">
          <span className="flex items-center gap-1 font-semibold text-ink">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {course.rating}
          </span>
          <span>{course.students} learners</span>
          <span>· {course.duration}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <div className="flex items-baseline gap-2">
            <strong className="text-lg text-ink">₹{course.price.toLocaleString('en-IN')}</strong>
            {course.oldPrice && (
              <span className="text-xs text-ink/40 line-through">
                ₹{course.oldPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <Button className="mt-4 w-full" onClick={handleEnroll}>
          Enroll now <ArrowRight size={13} />
        </Button>
      </div>
    </article>
  );
}
