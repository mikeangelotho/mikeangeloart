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
}

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
  sections: { id: string; title: string; paragraphs: string[]; media: ContentMedia[] }[];
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

export interface WritingEntry {
  id: string;
  slug: string;
  title: string;
  summary: string;
  visibility: Visibility;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  body: ({ type: "paragraph" | "quote"; text: string } | { type: "heading"; text: string; level: 2 | 3 | 4 })[];
  cover?: ContentMedia;
}

export interface PersonalPageCopy {
  title: string;
  description: string;
  intro: string;
  projectsHeading: string;
  mosaicHeading: string;
  mosaicDescription: string;
  emptyMosaic: string;
  supportingHeading?: string;
  supportingDescription?: string;
}

export interface HomePageCopy {
  intro: string;
  projectsIntro: string;
  contactIntro: string;
}

export interface AboutPageCopy {
  description: string;
  intro: string;
  sections: { id: string; title: string; paragraphs: string[] }[];
}

export interface ContentDatabase {
  $schema?: string;
  schemaVersion: 2;
  site: { name: string; role: string; url: string; description: string; ogImage: string; homePage: HomePageCopy; aboutPage: AboutPageCopy; personalPage?: PersonalPageCopy };
  caseStudies: CaseStudy[];
  personalProjects: PersonalProject[];
  creativePieces: CreativePiece[];
  writing: WritingEntry[];
}
