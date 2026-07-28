import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, Play, PlayCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useIsEnrolled } from '@/lib/enrollment';
import { useCourses, useCourseVideos } from '@/lib/content';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';

export default function Learn({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const { user, loading: authLoading } = useAuth();
  const { isEnrolled, loading: enrollmentLoading } = useIsEnrolled(courseId);
  const { items: courses, loading: coursesLoading } = useCourses();
  const { items: videos, loading: videosLoading } = useCourseVideos(courseId);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [, navigate] = useLocation();

  const course = courses.find((c) => c.id === courseId);
  const activeVideo = videos.find((v) => v.id === activeId) ?? videos[0];

  function selectVideo(id: string) {
    setActiveId(id);
    setPlaying(false);
  }

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [authLoading, user, navigate]);

  const loading = authLoading || enrollmentLoading || coursesLoading || videosLoading;

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center text-sm text-ink/50">Loading…</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <p className="text-sm text-ink/60">You&rsquo;re not enrolled in this course.</p>
        <Link href="/my-courses" className="mt-4 text-xs font-semibold text-brand underline">
          Go to My Courses
        </Link>
      </div>
    );
  }

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
          <Link href="/my-courses" className="text-xs font-semibold text-ink/60 hover:text-ink">
            My courses
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-xl font-bold text-ink">{course?.title ?? 'Course'}</h1>

        {videos.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">No videos have been added to this course yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              {activeVideo && playing && (
                <iframe
                  key={activeVideo.id}
                  src={`${getYouTubeEmbedUrl(activeVideo.youtubeUrl)}&autoplay=1`}
                  title={activeVideo.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {activeVideo && !playing && (
                <button
                  onClick={() => setPlaying(true)}
                  className="group absolute inset-0"
                  aria-label={`Play ${activeVideo.title}`}
                >
                  {getYouTubeThumbnail(activeVideo.youtubeUrl) && (
                    <img
                      src={getYouTubeThumbnail(activeVideo.youtubeUrl)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-black/25 transition-colors group-hover:bg-black/40">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-brand shadow-lg transition-transform group-hover:scale-105">
                      <Play size={26} className="ml-1" fill="currentColor" />
                    </span>
                  </span>
                </button>
              )}
            </div>

            <div className="divide-y divide-line rounded-2xl border border-line bg-white">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => selectVideo(video.id)}
                  className={`flex w-full items-center gap-3 p-4 text-left text-sm font-medium ${
                    video.id === (activeVideo?.id ?? '')
                      ? 'bg-brand/5 text-brand'
                      : 'text-ink hover:bg-black/5'
                  }`}
                >
                  {getYouTubeThumbnail(video.youtubeUrl) ? (
                    <img
                      src={getYouTubeThumbnail(video.youtubeUrl)}
                      alt=""
                      className="h-10 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <PlayCircle size={16} className="shrink-0" />
                  )}
                  {video.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
