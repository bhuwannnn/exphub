import { useEffect, useState } from 'react';
import type { Banner } from '@/lib/content';

const SLIDE_DURATION = 4000;

function scrollToCourse(courseId: string) {
  const target = document.getElementById(`course-${courseId}`) ?? document.getElementById('courses');
  target?.scrollIntoView({ behavior: 'smooth' });
}

export function HeroCarousel({ banners, eyebrow }: { banners: Banner[]; eyebrow: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (active >= banners.length) setActive(0);
  }, [banners.length, active]);

  useEffect(() => {
    if (paused || banners.length < 2) return;
    const timer = setTimeout(() => {
      setActive((current) => (current + 1) % banners.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [active, paused, banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="bg-cream pb-10 pt-6">
      <div className="mx-auto max-w-7xl px-4">
        <p className="eyebrow mb-5 text-center">{eyebrow}</p>

        {/* Wide landscape promo banner, full-bleed within the container */}
        <div
          className="relative aspect-[3/1] w-full overflow-hidden rounded-3xl shadow-lg"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              onClick={() => scrollToCourse(banner.courseId)}
              aria-label={banner.title || 'Banner'}
              className={`banner-art ${banner.art} absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-500 ${
                index === active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              style={banner.image ? { backgroundImage: `url(${banner.image})` } : undefined}
            />
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
