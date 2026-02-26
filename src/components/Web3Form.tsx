import { createSignal, Show } from "solid-js";
import { Button } from "~/layout/Cards";
import { Input, Label } from "~/layout/Forms";

export const Web3Form = () => {
  const [result, setResult] = createSignal("");

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "33167a9e-992e-4a3e-af3b-96ab4976a6b3");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data: any = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      setResult("Error");
    }
  };

  return (
    <form onSubmit={onSubmit} class="w-full border border-neutral-300 dark:border-neutral-900 p-6 rounded-3xl bg-neutral-100 dark:bg-neutral-950">
      <div class="flex flex-col gap-3 w-full">
        <div class="flex flex-col">
          <Label>Name</Label>
          <Input name="name" type="text" placeholder="Enter your name" />
        </div>
        <div class="flex flex-col">
          <Label>Email</Label>
          <Input name="email" type="email" placeholder="Enter your email" />
        </div>
        <div class="flex flex-col">
          <Label>Message</Label>
          <textarea
            class="min-h-24 sm:min-h-32 md:min-h-36 placeholder-black/25 resize-none dark:placeholder-white/50 bg-white dark:bg-neutral-900 text-black focus:text-black dark:text-white dark:focus:text-white rounded-md px-3 py-2 sm:py-3 outline outline-transparent border border-black/10 dark:border-white/10 focus:outline-black/50 dark:focus:outline-white/50 hover:outline-black/25 dark:hover:outline-white/25 def__animate text-base touch-resize"
            placeholder="Enter your message"
            name="message"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          class="cursor-pointer flex w-full lg:w-fit justify-center items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-200 group/link"
        >
          Submit
          <span class="font-normal group-hover/link:rotate-90 transition-transform">↵</span>
        </button>
        <Show when={result().length > 0}>
          <span class="text-black/10 dark:text-white/50">{result()}</span>
        </Show>
      </div>
    </form>
  );
};

export default Web3Form;