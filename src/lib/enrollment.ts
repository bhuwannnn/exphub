import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export type Enrollment = {
  id: string;
  courseId: string;
  enrolledAt: string;
};

function enrollmentFromRow(row: any): Enrollment {
  return { id: row.id, courseId: row.course_id, enrolledAt: row.enrolled_at };
}

export function useEnrollments() {
  const { user } = useAuth();
  const [items, setItems] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function load() {
      const { data } = await supabase.from('enrollments').select('*').eq('user_id', user!.id);
      if (!cancelled && data) {
        setItems(data.map(enrollmentFromRow));
        setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel(`enrollments-${user.id}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enrollments', filter: `user_id=eq.${user.id}` },
        load,
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { items, loading };
}

export function useIsEnrolled(courseId: string) {
  const { items, loading } = useEnrollments();
  return { isEnrolled: items.some((e) => e.courseId === courseId), loading };
}

export async function enrollInCourse(courseId: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) throw new Error('Not logged in');

  const { error } = await supabase
    .from('enrollments')
    .upsert({ user_id: user.id, course_id: courseId }, { onConflict: 'user_id,course_id', ignoreDuplicates: true });
  if (error) throw error;
}
