import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useEnrollments } from '@/lib/enrollment';
import { useCourses } from '@/lib/content';

export default function MyCourses() {
  const { user, loading: authLoading } = useAuth();
  const { items: enrollments, loading: enrollmentsLoading } = useEnrollments();
  const { items: courses, loading: coursesLoading } = useCourses();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [authLoading, user, navigate]);

  if (authLoading || enrollmentsLoading || coursesLoading || !user) {
    return <div className="grid min-h-screen place-items-center text-sm text-ink/50">Loading…</div>;
  }

  const enrolledCourses = courses.filter((course) =>
    enrollments.some((e) => e.courseId === course.id),
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
              <GraduationCap size={16} />
            </span>
            <span className="text-[17px] font-extrabold text-ink">ExpHub</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-ink/60 hover:text-ink">
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-ink">My courses</h1>

        {enrolledCourses.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">
            You haven&rsquo;t enrolled in any course yet. Head back to the homepage to enroll.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Link
                key={course.id}
                href={`/learn/${course.id}`}
                className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 hover:border-ink"
              >
                <div>
                  <p className="text-sm font-bold text-ink">{course.title}</p>
                  <p className="mt-1 text-xs text-ink/50">{course.duration}</p>
                </div>
                <ArrowRight size={16} className="text-ink/40" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
