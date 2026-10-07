import assert from "node:assert/strict";
import test from "node:test";
import { disciplineTags, filterPortfolio } from "../src/utils/portfolio-filters.ts";

const projects = [
  { id: "identity", clientName: "A", tags: ["Brand Design", "Web Design"] },
  { id: "campaign", clientName: "B", tags: ["Campaign Design", "Video Editing"] },
  { id: "web", clientName: "B", tags: ["Web Design"] },
];

test("filters use any selected discipline and client, combined across both groups", () => {
  assert.deepEqual(filterPortfolio(projects, [], []), projects);
  assert.deepEqual(filterPortfolio(projects, ["Brand Design", "Web Design"], ["B"]).map((p) => p.id), ["web"]);
  assert.deepEqual(filterPortfolio(projects, ["Web Design"], ["A", "B"]).map((p) => p.id), ["identity", "web"]);
  assert.deepEqual(filterPortfolio(projects, ["Video Editing"], ["A"]), []);
});

test("existing discipline URLs stay usable and overlapping labels collapse", () => {
  assert.deepEqual(disciplineTags(["Paid Social Media", "Organic Social Media", "Digital Marketing", " Campaign Design ", ""]), ["Campaign Design"]);
  assert.deepEqual(filterPortfolio(projects, ["Website Development"], []).map((p) => p.id), ["identity", "web"]);
  assert.deepEqual(filterPortfolio([{ id: "legacy", clientName: "A", tags: ["Rich Media"] }], ["Motion Design"], []).map((p) => p.id), ["legacy"]);
  assert.deepEqual(disciplineTags(["New discipline", "constructor", "toString"]), ["New discipline", "constructor", "toString"]);
});
