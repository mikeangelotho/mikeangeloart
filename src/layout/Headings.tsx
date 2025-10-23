export const H1 = (props: { children: string }) => {
  return (
    <h1 class="text-4xl md:text-5xl text-black font-bold tracking-tighter">
      {props.children}
    </h1>
  );
};
