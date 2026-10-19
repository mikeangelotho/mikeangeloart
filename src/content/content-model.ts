export type Visibility = "public" | "hidden";

export interface ContentMedia {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  width?: number;
  height?: number;
  poster?: string;
  title?: string;
  caption?: string;
  client?: string;
  showOnHomepage?: boolean;
}

/** Every keypoint image and video explicitly opts in or out of the homepage. */
export type KeypointMedia = ContentMedia & { showOnHomepage: boolean };

export interface Contribution {
  role: string;
  summary: string;
  responsibilities: string[];
  collaborators: string[];
  deliverables: string[];
  duration?: string;
  tools?: string[];
}

export interface ProjectResult {
  value: string;
  label?: string;
  context?: string;
  source?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  visibility: Visibility;
  client: { name: string; logo: ContentMedia };
  cover: ContentMedia;
  objective: string;
  intro: string[];
  contribution: Contribution;
  results: ProjectResult[];
  hero?: ContentMedia;
  featuredMediaIds: string[];
  sections: { id: string; title: string; paragraphs: string[]; media: KeypointMedia[] }[];
  videos: ContentMedia[];
}

export interface ProjectScreenshot {
  id: string;
  type: "image";
  title: string;
  caption?: string;
  src?: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface PersonalProject {
  id: string;
  title: string;
  category: string;
  summary: string;
  status?: string;
  visibility: Visibility;
  presentation?: "featured" | "compact";
  showScreenshotPlaceholders?: boolean;
  screenshots: ProjectScreenshot[];
  link?: { label: string; href: string };
}

export interface CreativePiece {
  id: string;
  title: string;
  medium: string;
  type: "image" | "video";
  src: string;
  alt: string;
  visibility: Visibility;
  width?: number;
  height?: number;
  size?: "small" | "wide" | "tall" | "large";
}

export interface ContentDatabase {
  $schema?: string;
  schemaVersion: 3;
  caseStudies: CaseStudy[];
  personalProjects: PersonalProject[];
  creativePieces: CreativePiece[];
}
