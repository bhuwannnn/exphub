import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Course } from '@/lib/content';

type CheckoutContextValue = {
  course: Course | null;
  openCheckout: (course: Course) => void;
  closeCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [course, setCourse] = useState<Course | null>(null);

  return (
    <CheckoutContext.Provider
      value={{
        course,
        openCheckout: setCourse,
        closeCheckout: () => setCourse(null),
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
