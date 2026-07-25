import { useEffect, useState } from 'react';
import { useSiteSettings, updateSiteSettings, type SiteSettings, type Stat } from '@/lib/content';
import { ImageField } from '@/components/admin/image-field';
import { Button } from '@/components/ui/button';

const iconOptions: Stat['icon'][] = ['users', 'video', 'star', 'award'];

export function AdminSettings() {
  const { settings } = useSiteSettings();
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(settings), [settings]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  function field<K extends keyof SiteSettings>(key: K) {
    return {
      value: draft[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft((d) => ({ ...d, [key]: e.target.value })),
    };
  }

  function updateStat(index: number, patch: Partial<Stat>) {
    setDraft((d) => ({
      ...d,
      stats: d.stats.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)),
    }));
  }

  async function save() {
    setSaving(true);
    await updateSiteSettings(draft);
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Site text &amp; branding</h2>
        <Button size="sm" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>

      <div className="mt-4 grid gap-5 rounded-2xl border border-line p-5 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Site name (logo text)</span>
          <input className="admin-input" {...field('logoText')} />
        </label>

        <div>
          <ImageField
            label="Logo image (optional, replaces icon)"
            value={draft.logoImage}
            onChange={(logoImage) => setDraft((d) => ({ ...d, logoImage }))}
            maxWidth={200}
          />
        </div>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Top sale banner text</span>
          <input className="admin-input" {...field('saleBannerText')} />
        </label>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">
            Hero eyebrow (above banner carousel)
          </span>
          <input className="admin-input" {...field('heroEyebrow')} />
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Courses section eyebrow</span>
          <input className="admin-input" {...field('coursesEyebrow')} />
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Courses section heading</span>
          <input className="admin-input" {...field('coursesHeading')} />
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Achievements eyebrow</span>
          <input className="admin-input" {...field('achievementsEyebrow')} />
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Achievements heading</span>
          <input className="admin-input" {...field('achievementsHeading')} />
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Reviews eyebrow</span>
          <input className="admin-input" {...field('reviewsEyebrow')} />
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Reviews heading</span>
          <input className="admin-input" {...field('reviewsHeading')} />
        </label>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink/60">Footer tagline</span>
          <input className="admin-input" {...field('footerTagline')} />
        </label>
      </div>

      <h3 className="mt-8 text-sm font-bold text-ink">Achievement stats</h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {draft.stats.map((stat, index) => (
          <div key={stat.id} className="rounded-2xl border border-line p-4">
            <label className="text-sm">
              <span className="mb-1.5 block text-xs font-semibold text-ink/60">Value</span>
              <input
                className="admin-input"
                value={stat.value}
                onChange={(e) => updateStat(index, { value: e.target.value })}
              />
            </label>
            <label className="mt-3 block text-sm">
              <span className="mb-1.5 block text-xs font-semibold text-ink/60">Label</span>
              <input
                className="admin-input"
                value={stat.label}
                onChange={(e) => updateStat(index, { label: e.target.value })}
              />
            </label>
            <label className="mt-3 block text-sm">
              <span className="mb-1.5 block text-xs font-semibold text-ink/60">Icon</span>
              <select
                className="admin-input"
                value={stat.icon}
                onChange={(e) => updateStat(index, { icon: e.target.value as Stat['icon'] })}
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
