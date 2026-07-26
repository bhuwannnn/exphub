import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/profile';
import { useCourses } from '@/lib/content';
import { useEnrollStatus } from '@/lib/enroll-status-context';
import { PENDING_ENROLL_KEY } from '@/lib/use-enroll-flow';

export function PendingEnrollResolver() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { items: courses, loading: coursesLoading } = useCourses();
  const { runEnroll } = useEnrollStatus();

  useEffect(() => {
    if (authLoading || profileLoading || coursesLoading || !user || !profile) return;
    const courseId = sessionStorage.getItem(PENDING_ENROLL_KEY);
    if (!courseId) return;

    sessionStorage.removeItem(PENDING_ENROLL_KEY);
    const course = courses.find((c) => c.id === courseId);
    runEnroll(courseId, course?.title ?? 'your course');
  }, [authLoading, profileLoading, coursesLoading, user, profile, courses, runEnroll]);

  return null;
}
