import { useEffect, useState } from 'react';
import { ArrowRight, CornerDownRight } from 'lucide-react';
import { banners } from '@/data/courses';

const SLIDE_DURATION = 4000;

function scrollToCourse(courseId: string) {
  const target = document.getElementById(`course-${courseId}`) ?? document.getElementById('courses');
  target?.scrollIntoView({ behavior: 'smooth' });
}

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      setActive((current) => (current + 1) % banners.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [active, paused]);

  return (
    <section className="bg-cream pb-10 pt-6">
      <div className="mx-auto max-w-7xl px-4">
        {/* Wide landscape promo banner, full-bleed within the container */}
        <div
          className="relative aspect-[21/8] w-full overflow-hidden rounded-3xl shadow-lg sm:aspect-[21/6]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`banner-art ${banner.art} absolute inset-0 flex items-center justify-between px-6 py-5 transition-opacity duration-500 sm:px-10 ${
                index === active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div>
                <span className="mono-font w-fit rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-ink sm:text-xs">
                  {banner.badge}
                </span>

                <h2 className="display-font mt-3 text-2xl leading-[1.05] text-white sm:mt-4 sm:text-5xl">
                  {banner.title}
                </h2>

                <p className="mt-2 hidden max-w-md text-sm text-white/85 sm:block">
                  {banner.subtitle}
                </p>

                <button
                  onClick={() => scrollToCourse(banner.courseId)}
                  className="mt-3 hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-ink sm:mt-5 sm:flex"
                >
                  {banner.cta} <ArrowRight size={13} />
                </button>
              </div>

              {banner.price > 0 && (
                <div className="flex flex-col items-end gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 text-white sm:gap-2">
                    <CornerDownRight size={16} className="hidden text-white/70 sm:block" />
                    <div className="text-right">
                      <span className="block text-xs text-white/60 line-through sm:text-base">
                        ₹{banner.oldPrice.toLocaleString('en-IN')}/-
                      </span>
                      <span className="display-font block text-xl sm:text-3xl">
                        ₹{banner.price.toLocaleString('en-IN')}/-
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => scrollToCourse(banner.courseId)}
                    className="rounded-md bg-[#d92b2b] px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-white shadow sm:px-5 sm:py-2.5 sm:text-sm"
                  >
                    Enroll now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              onClick={() => setActive(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === active ? 'w-6 bg-brand' : 'w-2 bg-ink/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
