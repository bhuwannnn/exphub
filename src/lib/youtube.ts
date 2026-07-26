export function getYouTubeEmbedUrl(url: string): string {
  const trimmed = url.trim();

  const watchMatch = trimmed.match(/[?&]v=([\w-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = trimmed.match(/youtu\.be\/([\w-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const embedMatch = trimmed.match(/youtube\.com\/embed\/([\w-]+)/);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;

  return trimmed;
}
