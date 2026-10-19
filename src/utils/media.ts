import type { Media, PortfolioCollection } from "~/types";

export type MediaKind = "image" | "video" | "hls" | "vimeo";

function mediaUrl(url: string): URL | undefined {
  try {
    return new URL(url, "https://mikeangelo.art");
  } catch {
    return undefined;
  }
}

export function getMediaKind(url?: string, declaredType?: "image" | "video"): MediaKind {
  if (!url) return "image";
  const parsed = mediaUrl(url);
  if (parsed && /(^|\.)vimeo\.com$/i.test(parsed.hostname)) return "vimeo";
  const path = parsed?.pathname || url.split(/[?#]/)[0];
  if (/\.m3u8$/i.test(path)) return "hls";
  if (/\.(mp4|webm|ogv|mov|m4v)$/i.test(path)) return "video";
  return declaredType === "video" ? "video" : "image";
}

export function isVideoUrl(url?: string): boolean {
  return getMediaKind(url) !== "image";
}

export function getVideoMimeType(url: string): string | undefined {
  if (getMediaKind(url) === "hls") return "application/x-mpegURL";
  const path = mediaUrl(url)?.pathname || url.split(/[?#]/)[0];
  if (/\.webm$/i.test(path)) return "video/webm";
  if (/\.ogv$/i.test(path)) return "video/ogg";
  if (/\.(mp4|m4v)$/i.test(path)) return "video/mp4";
  return undefined;
}

export function getVideoPoster(
  video: Pick<Media, "url" | "thumbnail">,
): string | undefined {
  if (video.thumbnail) return video.thumbnail;
  const parsed = mediaUrl(video.url);
  if (parsed && /(^|\.)gumlet\.io$/i.test(parsed.hostname)) {
    return new URL("thumbnail-1-0.png", parsed).href;
  }
  return undefined;
}

export function getVimeoEmbedUrl(url: string): string {
  const parsed = mediaUrl(url);
  if (!parsed || parsed.hostname === "player.vimeo.com") return url;
  const segments = parsed.pathname.split("/").filter(Boolean);
  const idIndex = segments.findIndex((segment) => /^\d+$/.test(segment));
  if (idIndex < 0) return url;
  const embed = new URL(`https://player.vimeo.com/video/${segments[idIndex]}`);
  embed.search = parsed.search;
  const privateHash = segments[idIndex + 1];
  if (privateHash && !embed.searchParams.has("h")) {
    embed.searchParams.set("h", privateHash);
  }
  return embed.href;
}

/** Includes primary films that are absent from projectVideos, without duplicates. */
export function getProjectVideos(project: PortfolioCollection): Media[] {
  const candidates = [
    project.mainKeypointMedia,
    ...(Array.isArray(project.projectVideos) ? project.projectVideos : []),
  ];
  const seen = new Set<string>();
  return candidates.filter((video): video is Media => {
    if (!video?.url || (video.type !== "video" && !isVideoUrl(video.url)) || seen.has(video.url)) return false;
    seen.add(video.url);
    return true;
  });
}
