import { Users, PlayCircle, Star, Award, type LucideIcon } from 'lucide-react';
import { stats, type Stat } from '@/data/courses';

const icons: Record<Stat['icon'], LucideIcon> = {
  users: Users,
  video: PlayCircle,
  star: Star,
  award: Award,
};

export function AchievementsStats() {
  return (
    <section id="achievements" className="section-pad bg-ink">
      <div className="mx-auto max-w-7xl px-4">
        <p className="eyebrow !text-white/50">Why learners pick ExpHub</p>
        <h2 className="section-heading display-font mt-3 max-w-xl text-white">
          Small enough to care, proven enough to trust.
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = icons[stat.icon];
            return (
              <div key={stat.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/20 text-brand">
                  <Icon size={18} />
                </span>
                <p className="display-font mt-5 text-3xl text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
