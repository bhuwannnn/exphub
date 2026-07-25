import { GraduationCap } from 'lucide-react';
import { categories } from '@/data/courses';

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
                <GraduationCap size={16} />
              </span>
              <span className="text-[17px] font-extrabold text-ink">
                Exp<span className="text-brand">Hub</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink/60">
              Practical courses that turn learning into your next move — exam prep, tech, design,
              business and languages, all in one place.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Courses</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink/65">
              {categories.map((category) => (
                <li key={category.id}>{category.label}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Company</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink/65">
              <li>About us</li>
              <li>Careers</li>
              <li>Instructors</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Support</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink/65">
              <li>Help center</li>
              <li>Refund policy</li>
              <li>Terms of use</li>
              <li>Privacy policy</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ExpHub. All rights reserved.</span>
          <span>Made for learners who ship.</span>
        </div>
      </div>
    </footer>
  );
}
