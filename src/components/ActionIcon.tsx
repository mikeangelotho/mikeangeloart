export type ActionIconName =
  | "arrow-right"
  | "arrow-up-right"
  | "arrow-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "close"
  | "menu"
  | "sun"
  | "moon"
  | "send"
  | "play"
  | "pause";

const paths: Record<ActionIconName, string> = {
  "arrow-right": "M4 12h16m-6-6 6 6-6 6",
  "arrow-up-right": "M5 19 19 5M5 5h14v14",
  "arrow-down": "M12 4v16m-6-6 6 6 6-6",
  "chevron-left": "m15 5-7 7 7 7",
  "chevron-right": "m9 5 7 7-7 7",
  "chevron-down": "m5 9 7 7 7-7",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 6h16M4 12h16M4 18h16",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5",
  moon: "M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z",
  send: "m3 3 18 9-18 9 4-9-4-9Zm4 9h14",
  play: "m8 5 11 7-11 7V5Z",
  pause: "M8 5v14M16 5v14",
};

/** Decorative, font-independent symbols; the surrounding control supplies its label. */
export default function ActionIcon(props: {
  name: ActionIconName;
  class?: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      {...{ focusable: "false" }}
      width={props.size ?? 18}
      height={props.size ?? 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={`inline-block shrink-0 align-middle ${props.class || ""}`}
    >
      <path d={paths[props.name]} />
    </svg>
  );
}
