import { GraduationCap, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

const navLinks = [
  { id: 'courses', label: 'Courses' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'reviews', label: 'Reviews' },
];

export function Header() {
  const { user, requireAuth, logout } = useAuth();

  return (
    <>
      <div className="bg-ink text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-center text-xs">
          <span>
            <strong>Sale:</strong> Flat 40% off across ExpHub — ends soon.
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4">
          <button onClick={() => scrollTo('top')} className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
              <GraduationCap size={16} />
            </span>
            <span className="text-[17px] font-extrabold text-ink">
              Exp<span className="text-brand">Hub</span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-sm font-medium text-ink/70 md:flex">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)} className="hover:text-ink">
                {link.label}
              </button>
            ))}
          </nav>

          {user ? (
            <button
              onClick={logout}
              className="flex h-10 items-center gap-2 rounded-full border border-line px-3.5 text-sm font-semibold text-ink hover:border-ink"
            >
              <User size={15} />
              <span className="hidden sm:inline">{user.name}</span>
            </button>
          ) : (
            <button
              onClick={() => requireAuth(() => {})}
              className="h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-black"
            >
              Login
            </button>
          )}
        </div>
      </header>
    </>
  );
}
