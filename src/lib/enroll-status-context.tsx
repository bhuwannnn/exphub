import { createContext, useContext, useState, type ReactNode } from 'react';
import { enrollInCourse } from '@/lib/enrollment';

type Status = { phase: 'loading' | 'success'; courseTitle: string } | null;

type EnrollStatusValue = {
  status: Status;
  runEnroll: (courseId: string, courseTitle: string) => Promise<void>;
  close: () => void;
};

const EnrollStatusContext = createContext<EnrollStatusValue | null>(null);

export function EnrollStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>(null);

  async function runEnroll(courseId: string, courseTitle: string) {
    setStatus({ phase: 'loading', courseTitle });
    await Promise.all([enrollInCourse(courseId), new Promise((resolve) => setTimeout(resolve, 1500))]);
    setStatus({ phase: 'success', courseTitle });
  }

  return (
    <EnrollStatusContext.Provider value={{ status, runEnroll, close: () => setStatus(null) }}>
      {children}
    </EnrollStatusContext.Provider>
  );
}

export function useEnrollStatus() {
  const ctx = useContext(EnrollStatusContext);
  if (!ctx) throw new Error('useEnrollStatus must be used within EnrollStatusProvider');
  return ctx;
}
