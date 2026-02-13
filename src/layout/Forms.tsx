export const Label = (props: { children: string }) => {
  return (
    <label class="text-sm text-black/25 dark:text-white/25">
      {props.children}
    </label>
  );
};

export const Input = ({
  type,
  name,
  placeholder,
}: {
  type: string;
  name: string;
  placeholder: string;
}) => {
  return (
    <input
      type={type}
      name={name}
      class="placeholder-black/25 dark:placeholder-white/50 bg-white dark:bg-white/25 text-black focus:text-black dark:text-white dark:focus:text-white rounded-md px-3 py-2 sm:py-3 outline outline-transparent border border-neutral-300 dark:border-white/10 focus:outline-black/50 dark:focus:outline-white/50 hover:outline-black/25 dark:hover:outline-white/25 def__animate text-base"
      placeholder={placeholder}
    />
  );
};
