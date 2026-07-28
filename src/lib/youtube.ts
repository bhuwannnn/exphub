export function getYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();

  const watchMatch = trimmed.match(/[?&]v=([\w-]+)/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = trimmed.match(/youtu\.be\/([\w-]+)/);
  if (shortMatch) return shortMatch[1];

  const embedMatch = trimmed.match(/youtube\.com\/embed\/([\w-]+)/);
  if (embedMatch) return embedMatch[1];

  return null;
}

export function getYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url.trim();
}

export function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

export async function fetchYouTubeTitle(url: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url.trim())}&format=json`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.title === 'string' ? data.title : null;
  } catch {
    return null;
  }
}
