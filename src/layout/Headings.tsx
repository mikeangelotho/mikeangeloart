export const H1 = ({ children }: { children: string }) => {
  return (
    <h1 class="leading-tight text-4xl md:text-5xl text-black dark:text-white font-semibold tracking-tighter">
      {children}
    </h1>
  );
};

export const H2 = ({ children }: { children: string }) => {
  return <h2 class="font-semibold text-2xl text-black dark:text-white">{children}</h2>;
};
