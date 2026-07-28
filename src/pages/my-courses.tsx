import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useEnrollments } from '@/lib/enrollment';
import { useCourses } from '@/lib/content';
import { Button } from '@/components/ui/button';

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
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <article key={course.id} className="course-card">
                <div
                  className={`course-art ${course.art} bg-cover bg-center`}
                  style={course.image ? { backgroundImage: `url(${course.image})` } : undefined}
                >
                  {!course.image && (
                    <span className="course-art-label display-font drop-shadow">{course.title}</span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-sm font-bold text-ink">{course.title}</p>
                  <p className="mt-1 text-xs text-ink/50">{course.duration}</p>

                  <Link href={`/learn/${course.id}`} className="mt-4 block">
                    <Button className="w-full">
                      Open course <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
