import { createSignal, createUniqueId, onCleanup } from "solid-js";
import { Input, Label } from "~/layout/Forms";

export const Web3Form = () => {
  const fieldId = createUniqueId();
  const [result, setResult] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [hasError, setHasError] = createSignal(false);
  let request: AbortController | undefined;
  let disposed = false;

  onCleanup(() => {
    disposed = true;
    request?.abort();
  });

  const onSubmit = async (event: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    event.preventDefault();
    if (isSubmitting()) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setIsSubmitting(true);
    setHasError(false);
    setResult("Sending your message…");
    request = new AbortController();
    const formData = new FormData(form);
    formData.append("access_key", "33167a9e-992e-4a3e-af3b-96ab4976a6b3");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        signal: request.signal,
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error("Submission failed");
      if (disposed) return;
      setResult("Thanks — your message has been sent.");
      form.reset();
    } catch {
      if (disposed) return;
      setHasError(true);
      setResult("Your message could not be sent. Please try again, or email m.angelo@177edgar.com.");
    } finally {
      if (!disposed) setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Contact Mike Angelo"
      aria-busy={isSubmitting()}
      class="w-full border border-neutral-300 dark:border-neutral-900 p-6 rounded-3xl bg-neutral-100 dark:bg-neutral-950"
    >
      <div class="flex flex-col gap-3 w-full">
        <div class="flex flex-col">
          <Label for={`${fieldId}-name`}>Name</Label>
          <Input id={`${fieldId}-name`} name="name" type="text" placeholder="Enter your name" autocomplete="name" required />
        </div>
        <div class="flex flex-col">
          <Label for={`${fieldId}-email`}>Email</Label>
          <Input id={`${fieldId}-email`} name="email" type="email" placeholder="Enter your email" autocomplete="email" required />
        </div>
        <div class="flex flex-col">
          <Label for={`${fieldId}-message`}>Message</Label>
          <textarea
            id={`${fieldId}-message`}
            class="min-h-24 sm:min-h-32 md:min-h-36 placeholder-neutral-500 dark:placeholder-neutral-400 resize-y bg-white dark:bg-neutral-900 text-black dark:text-white rounded-md px-3 py-3 border border-neutral-400 dark:border-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400 text-base"
            placeholder="Enter your message"
            name="message"
            required
            data-lenis-prevent
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting()}
          class="min-h-11 cursor-pointer disabled:cursor-wait disabled:opacity-70 flex w-full lg:w-fit justify-center items-center gap-2 text-sm font-bold px-5 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-200 group/link"
        >
          {isSubmitting() ? "Sending…" : "Send message"}
          <span aria-hidden="true" class="font-normal group-hover/link:rotate-90 transition-transform">↵</span>
        </button>
        <p
          role={hasError() ? "alert" : "status"}
          aria-live={hasError() ? "assertive" : "polite"}
          aria-atomic="true"
          class="text-sm text-neutral-700 dark:text-neutral-300"
        >
          {result()}
        </p>
      </div>
    </form>
  );
};

export default Web3Form;
