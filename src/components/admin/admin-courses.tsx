import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  type Course,
} from '@/lib/content';
import { ImageField } from '@/components/admin/image-field';
import { Button } from '@/components/ui/button';

const artOptions: Course['art'][] = ['violet', 'orange', 'teal', 'rose', 'amber', 'sky'];
const levelOptions: Course['level'][] = ['Beginner', 'Intermediate', 'Advanced'];

function CourseEditor({ course }: { course: Course }) {
  const [draft, setDraft] = useState(course);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(course);

  function field<K extends keyof Course>(key: K) {
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
    await updateCourse(id, patch);
    setSaving(false);
  }

  return (
    <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-2">
      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Title</span>
        <input className="admin-input" {...field('title')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Category (tag)</span>
        <input className="admin-input" {...field('category')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Level</span>
        <select className="admin-input" {...field('level')}>
          {levelOptions.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Duration</span>
        <input className="admin-input" {...field('duration')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Price (₹)</span>
        <input type="number" className="admin-input" {...field('price')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Old price (₹, optional)</span>
        <input type="number" className="admin-input" {...field('oldPrice')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Rating (0-5)</span>
        <input type="number" step="0.1" className="admin-input" {...field('rating')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Students label</span>
        <input className="admin-input" {...field('students')} placeholder="e.g. 3.2k" />
      </label>

      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">Description</span>
        <textarea className="admin-input min-h-20" {...field('description')} />
      </label>

      <label className="text-sm">
        <span className="mb-1.5 block text-xs font-semibold text-ink/60">
          Card color (used if no image)
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
          label="Course image (optional, overrides card color)"
          value={draft.image ?? ''}
          onChange={(image) => setDraft((d) => ({ ...d, image }))}
        />
      </div>

      <div className="flex items-center gap-2 sm:col-span-2">
        <Button size="sm" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <button
          onClick={() => deleteCourse(course.id)}
          className="flex items-center gap-1.5 rounded-full border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          <Trash2 size={13} /> Delete course
        </button>
      </div>
    </div>
  );
}

export function AdminCourses() {
  const { items: courses } = useCourses();
  const [openId, setOpenId] = useState<string | null>(null);

  async function handleAdd() {
    const maxOrder = courses.reduce((max, c) => Math.max(max, c.order), 0);
    const ref = await addCourse({
      title: 'New Course',
      category: 'general',
      level: 'Beginner',
      duration: '4 weeks',
      price: 999,
      rating: 5,
      students: '0',
      art: 'violet',
      description: 'Add a description for this course.',
      image: '',
      order: maxOrder + 1,
    });
    setOpenId(ref.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Courses ({courses.length})</h2>
        <Button size="sm" onClick={handleAdd}>
          <Plus size={14} /> Add course
        </Button>
      </div>

      <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
        {courses.map((course) => (
          <div key={course.id}>
            <button
              className="flex w-full items-center justify-between p-4 text-left"
              onClick={() => setOpenId(openId === course.id ? null : course.id)}
            >
              <div>
                <p className="text-sm font-semibold text-ink">{course.title}</p>
                <p className="text-xs text-ink/50">
                  ₹{course.price.toLocaleString('en-IN')} · {course.category}
                </p>
              </div>
              {openId === course.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openId === course.id && <CourseEditor course={course} />}
          </div>
        ))}
        {courses.length === 0 && (
          <p className="p-6 text-center text-sm text-ink/40">No courses yet.</p>
        )}
      </div>
    </div>
  );
}
