import { createContentLoader } from "./content-data.ts";
import { contentSource } from "./content-source.ts";

export const loadContentDatabase = createContentLoader(contentSource);
