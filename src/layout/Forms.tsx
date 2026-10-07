import type { JSX } from "solid-js";

export const Label = (props: { children: string; for: string }) => {
  return (
    <label for={props.for} class="mb-2 text-sm text-neutral-700 dark:text-neutral-300">
      {props.children}
    </label>
  );
};

export const Input = ({
  type,
  name,
  placeholder,
  id,
  required,
  autocomplete,
}: {
  type: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
  name: string;
  placeholder: string;
  id: string;
  required?: boolean;
  autocomplete?: string;
}) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      required={required}
      autocomplete={autocomplete}
      class="placeholder-neutral-500 dark:placeholder-neutral-400 bg-white dark:bg-neutral-900 text-black dark:text-white rounded-md px-3 py-3 border border-neutral-400 dark:border-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400 text-base"
      placeholder={placeholder}
    />
  );
};
