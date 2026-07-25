import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="mono-font text-sm text-ink/40">404</p>
      <h1 className="display-font text-4xl text-ink">Page not found</h1>
      <Link href="/" className="text-sm font-semibold text-brand underline">
        Back to home
      </Link>
    </div>
  );
}
