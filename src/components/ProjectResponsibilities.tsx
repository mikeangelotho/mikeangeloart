import type { CaseStudyProfile } from "~/types";

export default function ProjectResponsibilities(props: {
  profile: CaseStudyProfile;
}) {
  return (
    <section aria-labelledby="contribution-heading" class="w-full">
      <h2
        id="contribution-heading"
        class="type-heading font-bold text-black dark:text-white"
      >
        My role & contribution
      </h2>
      <p class="mt-2 text-sm font-normal text-black dark:text-white">
        {props.profile.role}
      </p>
      {/*
      <p class="type-body mt-3 max-w-prose text-black/80 dark:text-white/80">
        {props.profile.summary}
      </p>*/}
    </section>
  );
}
