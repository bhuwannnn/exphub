import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
  image?: string;
  order: number;
};

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
  image?: string;
  order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  course: string;
  quote: string;
  rating: number;
  initials: string;
  order: number;
};

export type CourseVideo = {
  id: string;
  courseId: string;
  title: string;
  youtubeUrl: string;
  order: number;
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  icon: 'users' | 'video' | 'star' | 'award';
};

export type SiteSettings = {
  logoText: string;
  logoImage: string;
  saleBannerText: string;
  heroEyebrow: string;
  achievementsEyebrow: string;
  achievementsHeading: string;
  reviewsEyebrow: string;
  reviewsHeading: string;
  coursesEyebrow: string;
  coursesHeading: string;
  footerTagline: string;
  stats: Stat[];
};

export const DEFAULT_SETTINGS: SiteSettings = {
  logoText: 'ExpHub',
  logoImage: '',
  saleBannerText: 'Sale: Flat 40% off across ExpHub — ends soon.',
  heroEyebrow: 'A learning platform for every ambition',
  achievementsEyebrow: 'Why learners pick ExpHub',
  achievementsHeading: 'Small enough to care, proven enough to trust.',
  reviewsEyebrow: 'Learner reviews',
  reviewsHeading: 'What our learners say after finishing a course.',
  coursesEyebrow: 'Our courses',
  coursesHeading: 'A focused catalog, not an overwhelming one.',
  footerTagline: 'Made for learners who ship.',
  stats: [
    { id: 'learners', label: 'Active learners', value: '12,000+', icon: 'users' },
    { id: 'hours', label: 'Hours of video content', value: '250+', icon: 'video' },
    { id: 'rating', label: 'Average course rating', value: '4.7 / 5', icon: 'star' },
    { id: 'placements', label: 'Learners placed or promoted', value: '600+', icon: 'award' },
  ],
};

// -- Row <-> app type mapping (DB uses snake_case) -------------------------

function courseFromRow(row: any): Course {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    level: row.level,
    duration: row.duration,
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    rating: row.rating,
    students: row.students,
    art: row.art,
    description: row.description,
    image: row.image ?? '',
    order: row.sort_order,
  };
}

function courseToRow(patch: Partial<Course>) {
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.level !== undefined) row.level = patch.level;
  if (patch.duration !== undefined) row.duration = patch.duration;
  if (patch.price !== undefined) row.price = patch.price;
  if (patch.oldPrice !== undefined) row.old_price = patch.oldPrice || null;
  if (patch.rating !== undefined) row.rating = patch.rating;
  if (patch.students !== undefined) row.students = patch.students;
  if (patch.art !== undefined) row.art = patch.art;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.image !== undefined) row.image = patch.image;
  if (patch.order !== undefined) row.sort_order = patch.order;
  return row;
}

function bannerFromRow(row: any): Banner {
  return {
    id: row.id,
    badge: row.badge,
    eyebrow: row.eyebrow,
    title: row.title,
    subtitle: row.subtitle,
    cta: row.cta,
    price: row.price,
    oldPrice: row.old_price,
    courseId: row.course_id ?? '',
    art: row.art,
    image: row.image ?? '',
    order: row.sort_order,
  };
}

function bannerToRow(patch: Partial<Banner>) {
  const row: Record<string, unknown> = {};
  if (patch.badge !== undefined) row.badge = patch.badge;
  if (patch.eyebrow !== undefined) row.eyebrow = patch.eyebrow;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.subtitle !== undefined) row.subtitle = patch.subtitle;
  if (patch.cta !== undefined) row.cta = patch.cta;
  if (patch.price !== undefined) row.price = patch.price;
  if (patch.oldPrice !== undefined) row.old_price = patch.oldPrice;
  if (patch.courseId !== undefined) row.course_id = patch.courseId || null;
  if (patch.art !== undefined) row.art = patch.art;
  if (patch.image !== undefined) row.image = patch.image;
  if (patch.order !== undefined) row.sort_order = patch.order;
  return row;
}

function testimonialFromRow(row: any): Testimonial {
  return {
    id: row.id,
    name: row.name,
    course: row.course,
    quote: row.quote,
    rating: row.rating,
    initials: row.initials,
    order: row.sort_order,
  };
}

function testimonialToRow(patch: Partial<Testimonial>) {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.course !== undefined) row.course = patch.course;
  if (patch.quote !== undefined) row.quote = patch.quote;
  if (patch.rating !== undefined) row.rating = patch.rating;
  if (patch.initials !== undefined) row.initials = patch.initials;
  if (patch.order !== undefined) row.sort_order = patch.order;
  return row;
}

function videoFromRow(row: any): CourseVideo {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    youtubeUrl: row.youtube_url,
    order: row.sort_order,
  };
}

function videoToRow(patch: Partial<CourseVideo>) {
  const row: Record<string, unknown> = {};
  if (patch.courseId !== undefined) row.course_id = patch.courseId;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.youtubeUrl !== undefined) row.youtube_url = patch.youtubeUrl;
  if (patch.order !== undefined) row.sort_order = patch.order;
  return row;
}

function settingsFromRow(row: any): SiteSettings {
  return {
    logoText: row.logo_text,
    logoImage: row.logo_image ?? '',
    saleBannerText: row.sale_banner_text,
    heroEyebrow: row.hero_eyebrow,
    achievementsEyebrow: row.achievements_eyebrow,
    achievementsHeading: row.achievements_heading,
    reviewsEyebrow: row.reviews_eyebrow,
    reviewsHeading: row.reviews_heading,
    coursesEyebrow: row.courses_eyebrow,
    coursesHeading: row.courses_heading,
    footerTagline: row.footer_tagline,
    stats: row.stats ?? DEFAULT_SETTINGS.stats,
  };
}

function settingsToRow(patch: Partial<SiteSettings>) {
  const row: Record<string, unknown> = {};
  if (patch.logoText !== undefined) row.logo_text = patch.logoText;
  if (patch.logoImage !== undefined) row.logo_image = patch.logoImage;
  if (patch.saleBannerText !== undefined) row.sale_banner_text = patch.saleBannerText;
  if (patch.heroEyebrow !== undefined) row.hero_eyebrow = patch.heroEyebrow;
  if (patch.achievementsEyebrow !== undefined) row.achievements_eyebrow = patch.achievementsEyebrow;
  if (patch.achievementsHeading !== undefined) row.achievements_heading = patch.achievementsHeading;
  if (patch.reviewsEyebrow !== undefined) row.reviews_eyebrow = patch.reviewsEyebrow;
  if (patch.reviewsHeading !== undefined) row.reviews_heading = patch.reviewsHeading;
  if (patch.coursesEyebrow !== undefined) row.courses_eyebrow = patch.coursesEyebrow;
  if (patch.coursesHeading !== undefined) row.courses_heading = patch.coursesHeading;
  if (patch.footerTagline !== undefined) row.footer_tagline = patch.footerTagline;
  if (patch.stats !== undefined) row.stats = patch.stats;
  return row;
}

// -- Live hooks --------------------------------------------------------------

function useLiveTable<T>(table: string, mapRow: (row: any) => T) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
      if (!cancelled && data) {
        setItems(data.map(mapRow));
        setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel(`${table}-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, load)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return { items, loading };
}

export function useCourses() {
  return useLiveTable<Course>('courses', courseFromRow);
}

export function useBanners() {
  return useLiveTable<Banner>('banners', bannerFromRow);
}

export function useTestimonials() {
  return useLiveTable<Testimonial>('testimonials', testimonialFromRow);
}

export function useCourseVideos(courseId: string) {
  const [items, setItems] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      const { data } = await supabase
        .from('course_videos')
        .select('*')
        .eq('course_id', courseId)
        .order('sort_order', { ascending: true });
      if (!cancelled) {
        setItems(data ? data.map(videoFromRow) : []);
        setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel(`course_videos-${courseId}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'course_videos', filter: `course_id=eq.${courseId}` },
        load,
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [courseId]);

  return { items, loading };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (!cancelled) {
        if (data) setSettings(settingsFromRow(data));
        setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel(`site_settings-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, load)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
}

// -- Mutations (require an authenticated admin session; enforced by RLS) ----

export const addCourse = async (course: Omit<Course, 'id'>) => {
  const { data, error } = await supabase.from('courses').insert(courseToRow(course)).select().single();
  if (error) throw error;
  return courseFromRow(data);
};
export const updateCourse = async (id: string, patch: Partial<Course>) => {
  const { error } = await supabase.from('courses').update(courseToRow(patch)).eq('id', id);
  if (error) throw error;
};
export const deleteCourse = async (id: string) => {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
};

export const addBanner = async (banner: Omit<Banner, 'id'>) => {
  const { data, error } = await supabase.from('banners').insert(bannerToRow(banner)).select().single();
  if (error) throw error;
  return bannerFromRow(data);
};
export const updateBanner = async (id: string, patch: Partial<Banner>) => {
  const { error } = await supabase.from('banners').update(bannerToRow(patch)).eq('id', id);
  if (error) throw error;
};
export const deleteBanner = async (id: string) => {
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw error;
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonialToRow(testimonial))
    .select()
    .single();
  if (error) throw error;
  return testimonialFromRow(data);
};
export const updateTestimonial = async (id: string, patch: Partial<Testimonial>) => {
  const { error } = await supabase.from('testimonials').update(testimonialToRow(patch)).eq('id', id);
  if (error) throw error;
};
export const deleteTestimonial = async (id: string) => {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
};

export const addVideo = async (video: Omit<CourseVideo, 'id'>) => {
  const { data, error } = await supabase.from('course_videos').insert(videoToRow(video)).select().single();
  if (error) throw error;
  return videoFromRow(data);
};
export const updateVideo = async (id: string, patch: Partial<CourseVideo>) => {
  const { error } = await supabase.from('course_videos').update(videoToRow(patch)).eq('id', id);
  if (error) throw error;
};
export const deleteVideo = async (id: string) => {
  const { error } = await supabase.from('course_videos').delete().eq('id', id);
  if (error) throw error;
};

export const updateSiteSettings = async (patch: Partial<SiteSettings>) => {
  const { error } = await supabase.from('site_settings').update(settingsToRow(patch)).eq('id', 1);
  if (error) throw error;
};
