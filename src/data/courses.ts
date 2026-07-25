export type Course = {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: number;
  oldPrice?: number;
  rating: number;
  students: string;
  art: 'violet' | 'orange' | 'teal' | 'rose' | 'amber' | 'sky';
  description: string;
};

export const categories = [
  {
    id: 'exam-prep',
    label: 'Exam Prep',
    tagline: 'Crack JEE, NEET & government exams with structured plans',
  },
  {
    id: 'coding',
    label: 'Coding & Tech',
    tagline: 'From your first line of code to system design interviews',
  },
  {
    id: 'design',
    label: 'Design',
    tagline: 'UI, UX and brand design taught by working practitioners',
  },
  {
    id: 'business',
    label: 'Business & Finance',
    tagline: 'Build the commercial judgment to run and grow anything',
  },
] as const;

export const courses: Course[] = [
  {
    id: 'jee-mains-crash',
    title: 'JEE Main Crash Course',
    category: 'exam-prep',
    level: 'Advanced',
    duration: '12 weeks',
    price: 4999,
    oldPrice: 8999,
    rating: 4.8,
    students: '3.2k',
    art: 'violet',
    description: 'High-yield problem sets and daily mock tests for the final sprint.',
  },
  {
    id: 'full-stack-web',
    title: 'Full-Stack Web Development',
    category: 'coding',
    level: 'Beginner',
    duration: '20 weeks',
    price: 8999,
    oldPrice: 12999,
    rating: 4.9,
    students: '4.6k',
    art: 'sky',
    description: 'React, Node and databases, taught through five shipped projects.',
  },
  {
    id: 'ui-ux-foundations',
    title: 'UI/UX Design Foundations',
    category: 'design',
    level: 'Beginner',
    duration: '8 weeks',
    price: 4499,
    oldPrice: 5999,
    rating: 4.8,
    students: '1.9k',
    art: 'rose',
    description: 'Design systems, wireframes and prototyping in Figma.',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    category: 'business',
    level: 'Beginner',
    duration: '7 weeks',
    price: 3499,
    oldPrice: 4999,
    rating: 4.6,
    students: '2.4k',
    art: 'amber',
    description: 'Performance marketing, SEO and analytics for growth roles.',
  },
];

export type Banner = {
  id: string;
  badge: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  price: number;
  oldPrice: number;
  courseId: string;
  art: 'violet' | 'orange' | 'teal' | 'rose';
};

export const banners: Banner[] = [
  {
    id: 'banner-1',
    badge: 'Exam Prep',
    eyebrow: 'Limited time',
    title: 'AARAMBH 2.0',
    subtitle: 'Flat 40% off on JEE Main Crash Course — enroll before seats close.',
    cta: 'Explore course',
    price: 4999,
    oldPrice: 8999,
    courseId: 'jee-mains-crash',
    art: 'violet',
  },
  {
    id: 'banner-2',
    badge: 'Coding & Tech',
    eyebrow: 'New batch',
    title: 'LAUNCHPAD 3.0',
    subtitle: 'Full-Stack Web Dev cohort starts Monday — live classes, real projects.',
    cta: 'Explore course',
    price: 8999,
    oldPrice: 12999,
    courseId: 'full-stack-web',
    art: 'orange',
  },
  {
    id: 'banner-3',
    badge: 'Design',
    eyebrow: "Learner's choice",
    title: 'CRAFT BATCH',
    subtitle: 'UI/UX Design, rated 4.8 by 1,900+ learners.',
    cta: 'Explore course',
    price: 4499,
    oldPrice: 5999,
    courseId: 'ui-ux-foundations',
    art: 'teal',
  },
  {
    id: 'banner-4',
    badge: 'Business',
    eyebrow: "Learner's choice",
    title: 'GROWTH SPRINT',
    subtitle: 'Digital Marketing Mastery — go from basics to your first campaign.',
    cta: 'Explore course',
    price: 3499,
    oldPrice: 4999,
    courseId: 'digital-marketing',
    art: 'rose',
  },
];

export type Stat = {
  id: string;
  label: string;
  value: string;
  icon: 'users' | 'video' | 'star' | 'award';
};

export const stats: Stat[] = [
  { id: 'learners', label: 'Active learners', value: '12,000+', icon: 'users' },
  { id: 'hours', label: 'Hours of video content', value: '250+', icon: 'video' },
  { id: 'rating', label: 'Average course rating', value: '4.7 / 5', icon: 'star' },
  { id: 'placements', label: 'Learners placed or promoted', value: '600+', icon: 'award' },
];

export type Testimonial = {
  id: string;
  name: string;
  course: string;
  quote: string;
  rating: number;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Ananya Sharma',
    course: 'JEE Main Crash Course',
    quote:
      'The daily mock tests actually matched the real exam difficulty. My All India Rank jumped from a stagnant plateau to the top 5% in three months.',
    rating: 5,
    initials: 'AS',
  },
  {
    id: 'testimonial-2',
    name: 'Rohit Verma',
    course: 'Full-Stack Web Development',
    quote:
      'I shipped five real projects during the course and used them directly in interviews. Landed my first developer role two weeks after finishing.',
    rating: 5,
    initials: 'RV',
  },
  {
    id: 'testimonial-3',
    name: 'Meera Iyer',
    course: 'UI/UX Design Foundations',
    quote:
      'Clear structure, honest feedback on my portfolio, and mentors who actually work in the industry. Worth every rupee.',
    rating: 4,
    initials: 'MI',
  },
];
