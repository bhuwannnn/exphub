import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, Play, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useIsEnrolled } from '@/lib/enrollment';
import { useCourses, useCourseVideos, type CourseVideo } from '@/lib/content';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';

function VideoPlayerModal({ video, onClose }: { video: CourseVideo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between pb-3">
          <p className="truncate pr-4 text-sm font-semibold text-white">{video.title}</p>
          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close player"
          >
            <X size={16} />
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            src={`${getYouTubeEmbedUrl(video.youtubeUrl)}&autoplay=1`}
            title={video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default function Learn({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const { user, loading: authLoading } = useAuth();
  const { isEnrolled, loading: enrollmentLoading } = useIsEnrolled(courseId);
  const { items: courses, loading: coursesLoading } = useCourses();
  const { items: videos, loading: videosLoading } = useCourseVideos(courseId);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const course = courses.find((c) => c.id === courseId);
  const playingVideo = videos.find((v) => v.id === playingId) ?? null;

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
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setPlayingId(video.id)}
                className="group overflow-hidden rounded-2xl border border-line bg-white text-left"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {getYouTubeThumbnail(video.youtubeUrl) && (
                    <img
                      src={getYouTubeThumbnail(video.youtubeUrl)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/35">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-brand shadow-lg transition-transform group-hover:scale-105">
                      <Play size={20} className="ml-0.5" fill="currentColor" />
                    </span>
                  </span>
                </div>
                <p className="p-4 text-sm font-semibold text-ink">{video.title}</p>
              </button>
            ))}
          </div>
        )}
      </main>

      {playingVideo && <VideoPlayerModal video={playingVideo} onClose={() => setPlayingId(null)} />}
    </div>
  );
}
