import type { ProjectResult } from "./content/content-model";

interface Collection {
  id: string;
  author: string;
  slug: string;
  title: string;
  cover: string;
  tags: string[];
  dateAdded: string;
  lastModified: string;
}

interface PortfolioCollection extends Collection {
  clientName: string;
  clientLogo: string;
  clientLogoAlt: string;
  coverAlt: string;
  coverWidth?: number;
  coverHeight?: number;
  projectObjective: string;
  mainKeypointMedia?: Media;
  featuredMedia: PortfolioKeypoint["media"];
  results: ProjectResult[];
  mainKeypointDescription: string;
  introParagraphs: string[];
  projectKeypoints: PortfolioKeypoint[];
  projectVideos: Media[];
  caseStudy?: CaseStudyProfile;
}

interface CaseStudyProfile {
  role: string;
  summary: string;
  responsibilities: string[];
  collaborators: string[];
  duration?: string;
  deliverables: string[];
  tools?: string[];
}

interface PortfolioKeypoint {
  id: string;
  title: string;
  description: string;
  paragraphs: string[];
  media: {
    id: string;
    url: string;
    altText: string;
    type: "image" | "video";
    width?: number;
    height?: number;
    caption?: string;
    poster?: string;
  }[];
}

interface Media {
  type?: "image" | "video";
  title: string;
  client: string;
  url: string;
  thumbnail: string;
  altText: string;
  description: string;
}

export type {
  Collection,
  PortfolioCollection,
  PortfolioKeypoint,
  CaseStudyProfile,
  Media,
};
