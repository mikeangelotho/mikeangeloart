const legacyDisciplines: Record<string, string> = {
  "Brand Development": "Brand Design", "Website Development": "Web Design", "E-commerce": "Web Design",
  "Digital Marketing": "Campaign Design", "Organic Social Media": "Campaign Design", "Paid Social Media": "Campaign Design",
  "Ad Campaign": "Campaign Design", "Digital Banners": "Campaign Design", "Experiential Marketing": "Event Content",
  "Event Production": "Event Content", "Rich Media": "Motion Design", "Print Advertising": "Print Design", Startup: "Brand Design",
};

/** Keep existing tag links useful as the discipline vocabulary becomes simpler. */
export function disciplineTags(tags: readonly string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean)
    .map((tag) => Object.hasOwn(legacyDisciplines, tag) ? legacyDisciplines[tag] : tag))];
}

export function filterPortfolio<T extends { tags: string[]; clientName: string }>(projects: readonly T[], tags: readonly string[], clients: readonly string[]): T[] {
  const selectedTags = disciplineTags(tags);
  return projects.filter((project) =>
    (!selectedTags.length || selectedTags.some((tag) => disciplineTags(project.tags).includes(tag))) &&
    (!clients.length || clients.includes(project.clientName)),
  );
}
