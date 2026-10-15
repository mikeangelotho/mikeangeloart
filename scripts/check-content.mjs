import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseContentDatabase } from "../src/utils/content-data.ts";
import { contentDatabaseUrl } from "../src/utils/content-source.ts";

const argument = process.argv[2];
const remote = argument === "--cdn" ? contentDatabaseUrl : /^https?:\/\//.test(argument ?? "") ? argument : undefined;
const input = argument && !remote ? resolve(argument) : new URL("../content/db.json", import.meta.url);

try {
  let raw;
  if (remote) {
    const response = await fetch(remote, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`Content request failed (${response.status}).`);
    raw = await response.json();
  } else {
    raw = JSON.parse(await readFile(input, "utf8"));
  }
  const database = parseContentDatabase(raw);
  const counts = [
    `${database.caseStudies.length} case studies`,
    `${database.personalProjects.length} personal projects`,
    `${database.creativePieces.length} creative pieces`,
  ];
  console.log(`${remote ? "CDN" : "Local"} content database v${database.schemaVersion} is valid: ${counts.join(", ")}.`);
} catch (error) {
  console.error("Content validation failed:", error.message);
  process.exitCode = 1;
}
