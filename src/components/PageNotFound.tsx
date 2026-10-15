import { A } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import SEO from "~/components/SEO";
import { H1 } from "~/layout/Headings";

export default function PageNotFound() {
  return (
    <>
      <HttpStatusCode code={404} />
      <SEO title="Page not found | Mike Angelo" description="Find Mike Angelo's selected work and portfolio." noindex />
      <main class="min-h-[80vh] px-6 pt-36 pb-18 flex items-center justify-center text-black dark:text-white">
        <div class="max-w-2xl flex flex-col gap-6">
          <p class="text-sm uppercase tracking-widest">404</p>
          <H1>Page not found.</H1>
          <p>This address may have changed. Explore the project library or return to the homepage.</p>
          <div class="flex flex-wrap gap-4">
            <A href="/projects" class="px-6 py-3 font-semibold bg-black text-white dark:bg-white dark:text-black">View projects</A>
            <A href="/" class="px-6 py-3 font-semibold border border-black/20 dark:border-white/20">Go home</A>
          </div>
        </div>
      </main>
    </>
  );
}
