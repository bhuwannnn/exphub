import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useCourses,
  useCourseVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  type CourseVideo,
} from '@/lib/content';
import { Button } from '@/components/ui/button';

function VideoEditor({ video }: { video: CourseVideo }) {
  const [draft, setDraft] = useState(video);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(video);

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

  async function save() {
    setSaving(true);
    const { id, ...patch } = draft;
    await updateVideo(id, patch);
    setSaving(false);
  }

  return (
    <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Title</span>
        <input className="admin-input" {...field('title')} />
      </label>

      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">YouTube URL (unlisted)</span>
        <input className="admin-input" {...field('youtubeUrl')} placeholder="https://youtu.be/..." />
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

  async function handleAdd() {
    const maxOrder = videos.reduce((max, v) => Math.max(max, v.order), 0);
    const ref = await addVideo({
      courseId: activeCourseId,
      title: 'New video',
      youtubeUrl: '',
      order: maxOrder + 1,
    });
    setOpenId(ref.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Course</span>
          <select
            className="admin-input"
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
        <Button size="sm" onClick={handleAdd} disabled={!activeCourseId}>
          <Plus size={14} /> Add video
        </Button>
      </div>

      <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
        {videos.map((video) => (
          <div key={video.id}>
            <button
              className="flex w-full items-center justify-between p-4 text-left"
              onClick={() => setOpenId(openId === video.id ? null : video.id)}
            >
              <p className="text-sm font-semibold text-ink">{video.title}</p>
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
