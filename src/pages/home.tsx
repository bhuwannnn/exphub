import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroCarousel } from '@/components/hero-carousel';
import { CoursesGrid } from '@/components/courses-grid';
import { AchievementsStats } from '@/components/achievements-stats';
import { Testimonials } from '@/components/testimonials';
import { CourseDetailsModal } from '@/components/course-details-modal';
import { LoginModal } from '@/components/login-modal';
import { CheckoutModal } from '@/components/checkout-modal';
import { useCourses, useBanners, useTestimonials, useSiteSettings, type Course } from '@/lib/content';

export default function Home() {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const { items: courses, loading: coursesLoading } = useCourses();
  const { items: banners } = useBanners();
  const { items: testimonials } = useTestimonials();
  const { settings, loading: settingsLoading } = useSiteSettings();

  if (coursesLoading || settingsLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-ink/50">Loading…</div>
    );
  }

  return (
    <div id="top" className="min-h-screen bg-white">
      <Header logoText={settings.logoText} logoImage={settings.logoImage} saleBannerText={settings.saleBannerText} />
      <HeroCarousel banners={banners} eyebrow={settings.heroEyebrow} />
      <CoursesGrid
        courses={courses}
        eyebrow={settings.coursesEyebrow}
        heading={settings.coursesHeading}
        onViewDetails={setActiveCourse}
      />
      <AchievementsStats
        stats={settings.stats}
        eyebrow={settings.achievementsEyebrow}
        heading={settings.achievementsHeading}
      />
      <Testimonials
        testimonials={testimonials}
        eyebrow={settings.reviewsEyebrow}
        heading={settings.reviewsHeading}
      />
      <Footer
        logoText={settings.logoText}
        logoImage={settings.logoImage}
        footerTagline={settings.footerTagline}
        courses={courses}
      />

      {activeCourse && (
        <CourseDetailsModal course={activeCourse} onClose={() => setActiveCourse(null)} />
      )}
      <LoginModal />
      <CheckoutModal />
    </div>
  );
}
