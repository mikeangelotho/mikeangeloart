import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseContentDatabase } from "../src/utils/content-data.ts";
import { summarizePortfolio, toPortfolio } from "../src/utils/portfolio-data.ts";
import { buildSitemap } from "../scripts/generate-sitemap.js";
import { portfolioMosaicMedia } from "../src/utils/portfolio-mosaic.ts";

const database = JSON.parse(await readFile(new URL("../content/db.json", import.meta.url), "utf8"));
const freshDatabase = () => structuredClone(database);

test("homepage mosaic includes enabled public images and videos, independently of card selections", () => {
  const source = freshDatabase();
  const [hidden, publicProject] = source.caseStudies;
  hidden.visibility = "hidden";
  source.caseStudies = [hidden, publicProject];
  publicProject.sections = [{
    id: "mosaic-example", title: "Mosaic example", paragraphs: ["Example project walkthrough."],
    media: [
      { id: "landscape", type: "image", src: "/landscape.jpg", alt: "Landscape artwork", width: 1200, height: 800, showOnHomepage: true },
      { id: "film", type: "video", src: "/film.mp4", alt: "Design animation", width: 1600, height: 900, poster: "/film-poster.jpg", showOnHomepage: true },
      { id: "portrait", type: "image", src: "/portrait.jpg", alt: "Portrait artwork", width: 800, height: 1200, showOnHomepage: true },
      { id: "event-photo", type: "image", src: "/event.jpg", alt: "Event photography", showOnHomepage: false },
      { id: "event-film", type: "video", src: "/event.mp4", alt: "Event footage", showOnHomepage: false },
    ],
  }];
  // An image outside the card's featured selection must still reach the homepage.
  publicProject.featuredMediaIds = ["landscape", "event-photo"];
  const before = structuredClone(source);
  const items = portfolioMosaicMedia(parseContentDatabase(source));
  assert.deepEqual(items, [
    { id: "landscape", type: "image", src: "/landscape.jpg", alt: "Landscape artwork", width: 1200, height: 800, poster: undefined,
      projectTitle: publicProject.title, projectSlug: publicProject.slug },
    { id: "film", type: "video", src: "/film.mp4", alt: "Design animation", width: 1600, height: 900, poster: "/film-poster.jpg",
      projectTitle: publicProject.title, projectSlug: publicProject.slug },
    { id: "portrait", type: "image", src: "/portrait.jpg", alt: "Portrait artwork", width: 800, height: 1200, poster: undefined,
      projectTitle: publicProject.title, projectSlug: publicProject.slug },
  ]);
  assert.deepEqual(source, before);
  const caseStudy = toPortfolio(parseContentDatabase(source))[0];
  assert.ok(caseStudy.projectKeypoints[0].media.some((media) => media.id === "event-photo"), "excluded homepage images remain in the case study");
  assert.ok(caseStudy.featuredMedia.some((media) => media.id === "event-photo"), "homepage flags do not change project tiles");
});

test("published portfolio preserves the authored database order, copy and existing URLs", () => {
  const original = freshDatabase();
  const portfolio = toPortfolio(parseContentDatabase(original));
  assert.deepEqual(portfolio.map((project) => project.slug), [
    "loopwell-the-space-for-well-being",
    "bahlsen-drone-drop-pop-up",
    "benzel-busch-mercedes-benz-marketing",
    "blauner-fitness-fuel-your-fitness-fire",
    "benzel-busch-seasonal-road-trip-series",
    "gym-source-your-home-your-gym",
    "bahlsen-secret-stash",
  ]);
  assert.deepEqual(portfolio.map((project) => project.slug), original.caseStudies.map((project) => project.slug));
  for (const [index, project] of portfolio.entries()) {
    const source = original.caseStudies[index];
    assert.equal(project.projectObjective, source.objective);
    assert.deepEqual(project.introParagraphs, source.intro);
    assert.deepEqual(project.caseStudy, source.contribution);
    assert.equal(project.cover, source.cover.src);
    assert.deepEqual(project.projectVideos.map((video) => video.url), source.videos.map((video) => video.src));
  }
  assert.match(portfolio[0].caseStudy.summary, /helped develop Loopwell's logo/);
  assert.ok(portfolio[1].projectKeypoints.some((section) => section.title === "Digital and promotional design"));
  assert.ok(portfolio[2].projectKeypoints.some((section) => section.title === "Commercial editing and motion"));
  assert.deepEqual(original, database, "validation and presentation leave the editable database untouched");
});

test("featured artwork stays selected when sections and media are reordered", () => {
  const original = freshDatabase();
  const before = toPortfolio(parseContentDatabase(original))[0].featuredMedia;
  original.caseStudies[0].sections.reverse();
  for (const section of original.caseStudies[0].sections) section.media.reverse();
  const after = toPortfolio(parseContentDatabase(original))[0].featuredMedia;
  assert.deepEqual(after, before);
  assert.deepEqual(after.map((media) => media.id), original.caseStudies[0].featuredMediaIds);
});

test("card summaries retain featured artwork without sending every project's walkthrough", () => {
  const full = toPortfolio(parseContentDatabase(freshDatabase()));
  const summaries = summarizePortfolio(full);
  assert.deepEqual(summaries.map((project) => project.slug), full.map((project) => project.slug));
  for (const [index, summary] of summaries.entries()) {
    assert.deepEqual(summary.featuredMedia, full[index].featuredMedia);
    assert.equal(summary.caseStudy.summary, full[index].caseStudy.summary);
    assert.deepEqual(summary.projectKeypoints, []);
    assert.deepEqual(summary.projectVideos, []);
    assert.equal(summary.mainKeypointMedia, undefined);
    assert.equal(summary.mainKeypointDescription, "");
  }
  assert.ok(full[0].projectKeypoints.length > 0, "summary projection preserves the full detail data");
});

test("hidden client projects are excluded from portfolio routes and sitemap entries", () => {
  const source = freshDatabase();
  source.caseStudies[0].visibility = "hidden";
  const projects = toPortfolio(parseContentDatabase(source));
  assert.equal(projects.length, source.caseStudies.length - 1);
  assert.ok(projects.every((project) => project.slug !== source.caseStudies[0].slug));
  const xml = buildSitemap(projects);
  assert.doesNotMatch(xml, /loopwell-the-space-for-well-being/);
  assert.equal((xml.match(/<url>/g) ?? []).length, 4 + projects.length);
});

test("case studies support multiple paragraphs and more than two contextual results", () => {
  const source = freshDatabase();
  const project = source.caseStudies[0];
  project.intro = ["First introductory paragraph.", "Second introductory paragraph."];
  project.sections[0].paragraphs = ["The design problem.", "The resulting work."];
  project.results = [
    { value: "28%", label: "Reported sales increase", context: "Campaign-wide result; individual causation was not measured." },
    { value: "12", label: "Deliverables" },
    { value: "3", label: "Channels", source: "Client campaign report" },
  ];
  const rendered = toPortfolio(parseContentDatabase(source))[0];
  assert.deepEqual(rendered.introParagraphs, project.intro);
  assert.equal(rendered.mainKeypointDescription, project.intro.join("\n\n"));
  assert.deepEqual(rendered.projectKeypoints[0].paragraphs, project.sections[0].paragraphs);
  assert.equal(rendered.projectKeypoints[0].description, project.sections[0].paragraphs.join("\n\n"));
  assert.deepEqual(rendered.results, project.results);
  assert.equal(rendered.results.length, 3);
});

test("a case study without a hero or standalone films still retains its artwork", () => {
  const source = freshDatabase();
  delete source.caseStudies[0].hero;
  source.caseStudies[0].videos = [];
  const rendered = toPortfolio(parseContentDatabase(source))[0];
  assert.equal(rendered.mainKeypointMedia, undefined);
  assert.deepEqual(rendered.projectVideos, []);
  assert.ok(rendered.featuredMedia.length > 0);
  assert.ok(rendered.projectKeypoints.length > 0);
});

test("sitemap uses actual content dates and includes the Projects page", () => {
  const projects = toPortfolio(parseContentDatabase(freshDatabase()));
  const xml = buildSitemap(projects);
  assert.match(xml, /https:\/\/mikeangelo\.art\/personal<\/loc>/);
  assert.doesNotMatch(xml, /\/development<\/loc>/);
  assert.equal((xml.match(/<lastmod>/g) ?? []).length, projects.length);
  for (const project of projects) {
    assert.ok(xml.includes(`${project.slug}</loc>\n    <lastmod>${project.lastModified}</lastmod>`));
  }
  const withoutDate = buildSitemap([{ slug: "undated-example", lastModified: undefined }]);
  assert.doesNotMatch(withoutDate, /<lastmod>/);
});
