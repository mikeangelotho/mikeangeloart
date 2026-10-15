import { query } from "@solidjs/router";
import { loadContentDatabase } from "./content-loader";

/** Keep the home preview small, and prefer featured projects with real images. */
export const fetchPersonalProjectTeasers = query(async () => {
  "use server";
  const db = await loadContentDatabase();
  const projects = db.personalProjects.filter((project) => project.visibility === "public");
  const ordered = [
    ...projects.filter((project) => project.presentation !== "compact"),
    ...projects.filter((project) => project.presentation === "compact"),
  ];

  return ordered.flatMap((project) => {
    const screenshot = project.screenshots.find((image) => !!image.src);
    return screenshot ? [{
      id: project.id,
      title: project.title,
      screenshot,
    }] : [];
  }).slice(0, 3);
}, "personal-project-teasers");

/** Send this page only its content, without sending the case-study walkthroughs. */
export const fetchPersonalContent = query(async () => {
  "use server";
  const db = await loadContentDatabase();
  return {
    personalProjects: db.personalProjects.filter((project) => project.visibility === "public"),
    creativePieces: db.creativePieces.filter((piece) => piece.visibility === "public"),
  };
}, "personal-content");
