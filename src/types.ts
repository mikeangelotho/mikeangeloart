interface Collection {
  uuid: string;
  id: number;
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
  projectObjective: string;
  mainKeypointMedia: Media;
  mainKeypointFeatured: number[][];
  mainKeypointMetricOne: string;
  mainKeypointMetricTwo: string;
  mainKeypointDescription: string;
  projectKeypoints: PortfolioKeypoint[];
  projectVideos: Media[];
}

interface PortfolioKeypoint {
  title: string;
  description: string;
  media: {
    url: string;
    altText: string;
  }[];
}

interface Media {
  title: string;
  client: string;
  url: string;
  thumbnail: string;
  altText: string;
  description: string;
}

export type { Collection, PortfolioCollection, PortfolioKeypoint, Media };
