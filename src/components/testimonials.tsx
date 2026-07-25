import { Star } from 'lucide-react';
import { testimonials } from '@/data/courses';

const avatarColors = ['bg-violet-500', 'bg-teal-500', 'bg-rose-500'];

export function Testimonials() {
  return (
    <section id="reviews" className="section-pad border-t border-line bg-cream">
      <div className="mx-auto max-w-7xl px-4">
        <p className="eyebrow mb-3">Learner reviews</p>
        <h2 className="section-heading display-font max-w-xl">
          What our learners say after finishing a course.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="flex flex-col rounded-2xl border border-line bg-white p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={14}
                    className={
                      starIndex < testimonial.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-line text-line'
                    }
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white ${avatarColors[index % avatarColors.length]}`}
                >
                  {testimonial.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-xs text-ink/50">{testimonial.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
