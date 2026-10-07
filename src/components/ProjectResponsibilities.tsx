import { For, Show } from "solid-js";
import type { CaseStudyProfile } from "~/types";

export default function ProjectResponsibilities(props: {
  profile: CaseStudyProfile;
}) {
  return (
    <section aria-labelledby="contribution-heading" class="w-full">
      <h2
        id="contribution-heading"
        class="text-2xl md:text-3xl font-semibold text-black dark:text-white"
      >
        My role & contribution
      </h2>
      <p class="mt-4 max-w-3xl text-lg leading-relaxed text-black/80 dark:text-white/80">
        {props.profile.summary}
      </p>
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7 mt-8 border-t border-black/10 dark:border-white/10 pt-8">
        <div>
          <dt class="text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60">
            Role
          </dt>
          <dd class="mt-2 font-medium text-black dark:text-white">
            {props.profile.role}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60">
            My contribution
          </dt>
          <dd class="mt-2 text-black dark:text-white">
            <ul class="space-y-1">
              <For each={props.profile.responsibilities}>
                {(responsibility) => <li>{responsibility}</li>}
              </For>
            </ul>
          </dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60">
            Collaborators
          </dt>
          <dd class="mt-2 text-black dark:text-white">
            <ul class="space-y-1">
              <For each={props.profile.collaborators}>
                {(collaborator) => <li>{collaborator}</li>}
              </For>
            </ul>
          </dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60">
            Deliverables
          </dt>
          <dd class="mt-2 text-black dark:text-white">
            <ul class="space-y-1">
              <For each={props.profile.deliverables}>
                {(deliverable) => <li>{deliverable}</li>}
              </For>
            </ul>
          </dd>
        </div>
        <Show when={props.profile.duration}>
          <div>
            <dt class="text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60">
              Duration
            </dt>
            <dd class="mt-2 text-black dark:text-white">
              {props.profile.duration}
            </dd>
          </div>
        </Show>
        <Show when={props.profile.tools?.length}>
          <div>
            <dt class="text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60">
              Tools / platform
            </dt>
            <dd class="mt-2 text-black dark:text-white">
              {props.profile.tools?.join(", ")}
            </dd>
          </div>
        </Show>
      </dl>
    </section>
  );
}
