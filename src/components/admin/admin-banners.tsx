import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useBanners,
  useCourses,
  addBanner,
  updateBanner,
  deleteBanner,
  type Banner,
} from '@/lib/content';
import { ImageField } from '@/components/admin/image-field';
import { Button } from '@/components/ui/button';

const artOptions: Banner['art'][] = ['violet', 'orange', 'teal', 'rose'];

function BannerEditor({ banner, courses }: { banner: Banner; courses: { id: string; title: string }[] }) {
  const [draft, setDraft] = useState(banner);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(banner);

  function field<K extends keyof Banner>(key: K) {
    return {
      value: draft[key] as string | number,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setDraft((d) => ({
          ...d,
          [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
        })),
    };
  }

  async function save() {
    setSaving(true);
    const { id, ...patch } = draft;
    await updateBanner(id, patch);
    setSaving(false);
  }

  return (
    <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-2">
      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Badge text</span>
        <input className="admin-input" {...field('badge')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Eyebrow</span>
        <input className="admin-input" {...field('eyebrow')} />
      </label>

      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Title</span>
        <input className="admin-input" {...field('title')} />
      </label>

      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Subtitle</span>
        <input className="admin-input" {...field('subtitle')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Button text</span>
        <input className="admin-input" {...field('cta')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Links to course</span>
        <select className="admin-input" {...field('courseId')}>
          <option value="">— none —</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Price (₹, 0 to hide)</span>
        <input type="number" className="admin-input" {...field('price')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Old price (₹)</span>
        <input type="number" className="admin-input" {...field('oldPrice')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">
          Background color (used if no image)
        </span>
        <select className="admin-input" {...field('art')}>
          {artOptions.map((art) => (
            <option key={art} value={art}>
              {art}
            </option>
          ))}
        </select>
      </label>

      <div className="sm:col-span-2">
        <ImageField
          label="Banner image (optional, overrides color)"
          value={draft.image ?? ''}
          onChange={(image) => setDraft((d) => ({ ...d, image }))}
          maxWidth={1200}
        />
      </div>

      <div className="flex items-center gap-2 sm:col-span-2">
        <Button size="sm" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <button
          onClick={() => deleteBanner(banner.id)}
          className="flex items-center gap-1.5 rounded-full border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          <Trash2 size={13} /> Delete banner
        </button>
      </div>
    </div>
  );
}

export function AdminBanners() {
  const { items: banners } = useBanners();
  const { items: courses } = useCourses();
  const [openId, setOpenId] = useState<string | null>(null);

  async function handleAdd() {
    const maxOrder = banners.reduce((max, b) => Math.max(max, b.order), 0);
    const ref = await addBanner({
      badge: 'New',
      eyebrow: 'Announcement',
      title: 'NEW BANNER',
      subtitle: 'Describe the offer here.',
      cta: 'Explore course',
      price: 0,
      oldPrice: 0,
      courseId: courses[0]?.id ?? '',
      art: 'violet',
      image: '',
      order: maxOrder + 1,
    });
    setOpenId(ref.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Homepage banners ({banners.length})</h2>
        <Button size="sm" onClick={handleAdd}>
          <Plus size={14} /> Add banner
        </Button>
      </div>

      <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
        {banners.map((banner) => (
          <div key={banner.id}>
            <button
              className="flex w-full items-center justify-between p-4 text-left"
              onClick={() => setOpenId(openId === banner.id ? null : banner.id)}
            >
              <div>
                <p className="text-sm font-semibold text-ink">{banner.title}</p>
                <p className="text-xs text-ink/50">{banner.badge}</p>
              </div>
              {openId === banner.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openId === banner.id && <BannerEditor banner={banner} courses={courses} />}
          </div>
        ))}
        {banners.length === 0 && (
          <p className="p-6 text-center text-sm text-ink/40">No banners yet.</p>
        )}
      </div>
    </div>
  );
}
