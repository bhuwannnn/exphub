import type { Course } from '@/lib/content';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/profile';
import { useEnrollStatus } from '@/lib/enroll-status-context';

export const PENDING_ENROLL_KEY = 'exphub.pendingEnroll';

export function useEnrollFlow(course: Course) {
  const { user, loginWithGoogle } = useAuth();
  const { profile } = useProfile();
  const { runEnroll } = useEnrollStatus();

  return function handleEnroll() {
    if (!user) {
      sessionStorage.setItem(PENDING_ENROLL_KEY, course.id);
      loginWithGoogle();
      return;
    }
    if (!profile) {
      sessionStorage.setItem(PENDING_ENROLL_KEY, course.id);
      return;
    }
    runEnroll(course.id, course.title);
  };
}
