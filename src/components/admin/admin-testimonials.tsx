import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial,
} from '@/lib/content';
import { Button } from '@/components/ui/button';

function TestimonialEditor({ testimonial }: { testimonial: Testimonial }) {
  const [draft, setDraft] = useState(testimonial);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(testimonial);

  function field<K extends keyof Testimonial>(key: K) {
    return {
      value: draft[key] as string | number,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setDraft((d) => ({
          ...d,
          [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
        })),
    };
  }

  async function save() {
    setSaving(true);
    const { id, ...patch } = draft;
    await updateTestimonial(id, patch);
    setSaving(false);
  }

  return (
    <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-2">
      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Name</span>
        <input className="admin-input" {...field('name')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Initials (avatar)</span>
        <input className="admin-input" maxLength={2} {...field('initials')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Course taken</span>
        <input className="admin-input" {...field('course')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Rating (1-5)</span>
        <input type="number" min={1} max={5} className="admin-input" {...field('rating')} />
      </label>

      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Quote</span>
        <textarea className="admin-input min-h-24" {...field('quote')} />
      </label>

      <div className="flex items-center gap-2 sm:col-span-2">
        <Button size="sm" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <button
          onClick={() => deleteTestimonial(testimonial.id)}
          className="flex items-center gap-1.5 rounded-full border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          <Trash2 size={13} /> Delete review
        </button>
      </div>
    </div>
  );
}

export function AdminTestimonials() {
  const { items: testimonials } = useTestimonials();
  const [openId, setOpenId] = useState<string | null>(null);

  async function handleAdd() {
    const maxOrder = testimonials.reduce((max, t) => Math.max(max, t.order), 0);
    const ref = await addTestimonial({
      name: 'New Learner',
      course: 'Course name',
      quote: 'Write the review text here.',
      rating: 5,
      initials: 'NL',
      order: maxOrder + 1,
    });
    setOpenId(ref.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Reviews ({testimonials.length})</h2>
        <Button size="sm" onClick={handleAdd}>
          <Plus size={14} /> Add review
        </Button>
      </div>

      <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id}>
            <button
              className="flex w-full items-center justify-between p-4 text-left"
              onClick={() => setOpenId(openId === testimonial.id ? null : testimonial.id)}
            >
              <div>
                <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                <p className="text-xs text-ink/50">{testimonial.course}</p>
              </div>
              {openId === testimonial.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openId === testimonial.id && <TestimonialEditor testimonial={testimonial} />}
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="p-6 text-center text-sm text-ink/40">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
