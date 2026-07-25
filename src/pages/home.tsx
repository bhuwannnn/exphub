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
import { courses, type Course } from '@/data/courses';

export default function Home() {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  return (
    <div id="top" className="min-h-screen bg-white">
      <Header />
      <HeroCarousel />
      <CoursesGrid courses={courses} onViewDetails={setActiveCourse} />
      <AchievementsStats />
      <Testimonials />
      <Footer />

      {activeCourse && (
        <CourseDetailsModal course={activeCourse} onClose={() => setActiveCourse(null)} />
      )}
      <LoginModal />
      <CheckoutModal />
    </div>
  );
}
