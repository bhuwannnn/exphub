import type { Course } from '@/lib/content';
import { CourseCard } from '@/components/course-card';

export function CoursesGrid({
  courses,
  eyebrow,
  heading,
  onViewDetails,
}: {
  courses: Course[];
  eyebrow: string;
  heading: string;
  onViewDetails: (course: Course) => void;
}) {
  return (
    <section id="courses" className="section-pad border-t border-line">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-3">{eyebrow}</p>
            <h2 className="section-heading display-font">{heading}</h2>
          </div>
          <span className="text-sm font-semibold text-ink/50">{courses.length} courses</span>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onViewDetails={() => onViewDetails(course)} />
          ))}
        </div>
      </div>
    </section>
  );
}
