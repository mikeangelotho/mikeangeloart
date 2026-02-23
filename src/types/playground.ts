export type PlaygroundContentType = "codepen" | "image" | "video" | "external" | "github";
export type PlaygroundCategory = 
  | "all"
  | "spec-work"
  | "motion"
  | "code"
  | "photography"
  | "github";

export interface PlaygroundItem {
  id: string;
  title: string;
  contentType: PlaygroundContentType;
  category: PlaygroundCategory;
  techStack?: string[];
  description: string;
  details: string;
  gridSize: "1x1" | "2x1" | "1x2" | "2x2";
  
  codepenUrl?: string;
  codepenId?: string;
  
  imageUrl?: string;
  imageAlt?: string;
  
  videoUrl?: string;
  videoThumbnail?: string;
  
  externalUrl?: string;
  externalPlatform?: "behance" | "dribbble" | "vimeo" | "youtube" | "instagram";
  
  githubOwner?: string;
  githubRepo?: string;
}

export interface PlaygroundDB {
  playgroundItems: PlaygroundItem[];
  categories: { id: PlaygroundCategory | "all"; label: string }[];
}
