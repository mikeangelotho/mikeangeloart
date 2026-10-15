import { A, query, useLocation } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import { H1 } from "~/layout/Headings";
import SEO from "./SEO";
import { fetchPortfolio, fetchProject } from "~/utils/portfolio";
import { fetchPersonalContent } from "~/utils/content-database";
import { createEffect } from "solid-js";

export default function PageError(props: { reset: () => void }) {
  const location = useLocation();
  const initialPath = location.pathname;
  createEffect(() => {
    if (location.pathname !== initialPath) props.reset();
  });
  const retry = () => {
    query.delete(fetchPortfolio.keyFor());
    const slug = location.pathname.startsWith("/projects/") ? location.pathname.slice("/projects/".length) : undefined;
    if (slug) query.delete(fetchProject.keyFor(slug));
    query.delete(fetchPersonalContent.keyFor());
    props.reset();
  };
  return (
    <>
      <HttpStatusCode code={503} />
      <SEO title="Temporarily unavailable | Mike Angelo" noindex />
      <main class="min-h-[75vh] px-6 pt-36 pb-18 flex items-center justify-center text-black dark:text-white">
        <div class="max-w-2xl flex flex-col gap-6" role="alert">
          <H1>This page couldn’t load.</H1>
          <p>Please try again in a moment. You can also return to the homepage.</p>
          <div class="flex flex-wrap gap-4">
            <button type="button" onClick={retry} class="px-6 py-3 font-semibold bg-black text-white dark:bg-white dark:text-black">Try again</button>
            <A href="/" onClick={retry} class="px-6 py-3 font-semibold border border-black/20 dark:border-white/20">Go home</A>
          </div>
        </div>
      </main>
    </>
  );
}
