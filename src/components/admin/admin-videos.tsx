import { useState, type FormEvent } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import {
  useCourses,
  useCourseVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  type CourseVideo,
} from '@/lib/content';
import { getYouTubeThumbnail, fetchYouTubeTitle, getYouTubeVideoId } from '@/lib/youtube';
import { Button } from '@/components/ui/button';

function VideoEditor({ video }: { video: CourseVideo }) {
  const [draft, setDraft] = useState(video);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(video);
  const thumbnail = getYouTubeThumbnail(draft.youtubeUrl);

  function field<K extends keyof CourseVideo>(key: K) {
    return {
      value: draft[key] as string | number,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDraft((d) => ({
          ...d,
          [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
        })),
    };
  }

  async function resync() {
    setSyncing(true);
    const title = await fetchYouTubeTitle(draft.youtubeUrl);
    if (title) setDraft((d) => ({ ...d, title }));
    setSyncing(false);
  }

  async function save() {
    setSaving(true);
    const { id, ...patch } = draft;
    await updateVideo(id, patch);
    setSaving(false);
  }

  return (
    <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-2">
      {thumbnail && (
        <img
          src={thumbnail}
          alt=""
          className="aspect-video w-full rounded-xl object-cover sm:col-span-2"
        />
      )}

      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">YouTube URL (unlisted)</span>
        <input className="admin-input" {...field('youtubeUrl')} placeholder="https://youtu.be/..." />
      </label>

      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Title</span>
        <div className="flex gap-2">
          <input className="admin-input" {...field('title')} />
          <button
            type="button"
            onClick={resync}
            disabled={syncing || !getYouTubeVideoId(draft.youtubeUrl)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-line px-3 text-xs font-semibold text-ink hover:border-ink disabled:opacity-50"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
            Re-sync
          </button>
        </div>
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Order</span>
        <input type="number" className="admin-input" {...field('order')} />
      </label>

      <div className="flex items-center gap-2 sm:col-span-2">
        <Button size="sm" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <button
          onClick={() => deleteVideo(video.id)}
          className="flex items-center gap-1.5 rounded-full border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          <Trash2 size={13} /> Delete video
        </button>
      </div>
    </div>
  );
}

export function AdminVideos() {
  const { items: courses } = useCourses();
  const [courseId, setCourseId] = useState('');
  const activeCourseId = courseId || courses[0]?.id || '';
  const { items: videos } = useCourseVideos(activeCourseId);
  const [openId, setOpenId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  async function handleAddFromUrl(event: FormEvent) {
    event.preventDefault();
    if (!getYouTubeVideoId(newUrl)) {
      setAddError('Paste a valid YouTube video link');
      return;
    }
    setAddError('');
    setAdding(true);
    const title = (await fetchYouTubeTitle(newUrl)) ?? 'Untitled video';
    const maxOrder = videos.reduce((max, v) => Math.max(max, v.order), 0);
    const ref = await addVideo({ courseId: activeCourseId, title, youtubeUrl: newUrl, order: maxOrder + 1 });
    setNewUrl('');
    setAdding(false);
    setOpenId(ref.id);
  }

  return (
    <div>
      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Course</span>
        <select
          className="admin-input max-w-sm"
          value={activeCourseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </label>

      <form onSubmit={handleAddFromUrl} className="mt-4 flex items-start gap-2">
        <div className="flex-1">
          <input
            className="admin-input"
            placeholder="Paste a YouTube video link…"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          {addError && <p className="mt-1.5 text-xs font-medium text-red-500">{addError}</p>}
        </div>
        <Button size="sm" type="submit" disabled={adding || !activeCourseId}>
          <Plus size={14} /> {adding ? 'Fetching…' : 'Add video'}
        </Button>
      </form>
      <p className="mt-1.5 text-xs text-ink/40">
        Title and thumbnail are fetched automatically from YouTube.
      </p>

      <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
        {videos.map((video) => (
          <div key={video.id}>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => setOpenId(openId === video.id ? null : video.id)}
            >
              {getYouTubeThumbnail(video.youtubeUrl) && (
                <img
                  src={getYouTubeThumbnail(video.youtubeUrl)}
                  alt=""
                  className="h-10 w-16 shrink-0 rounded-lg object-cover"
                />
              )}
              <p className="flex-1 text-sm font-semibold text-ink">{video.title}</p>
              {openId === video.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openId === video.id && <VideoEditor video={video} />}
          </div>
        ))}
        {videos.length === 0 && (
          <p className="p-6 text-center text-sm text-ink/40">No videos yet for this course.</p>
        )}
      </div>
    </div>
  );
}
