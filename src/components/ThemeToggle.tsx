import { createSignal, onCleanup, onMount } from "solid-js";

export default function ThemeToggle(props: { onClick?: () => void }) {
  const [darkMode, setDarkMode] = createSignal(false);

  onMount(() => {
    const root = document.documentElement;
    const syncTheme = () => setDarkMode(root.classList.contains("dark"));
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "portfolio-theme" && (event.newValue === "light" || event.newValue === "dark")) {
        root.classList.toggle("dark", event.newValue === "dark");
      }
    };
    window.addEventListener("storage", handleStorage);
    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorage);
    });
  });

  const clickHandler = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    setDarkMode(nextDark);
    try {
      localStorage.setItem("portfolio-theme", nextDark ? "dark" : "light");
    } catch {
      // The selected theme still works when browser storage is unavailable.
    }
    props.onClick?.();
  };

  return (
    <button
      type="button"
      class="cursor-pointer select-none invert bg-transparent border-none min-h-11 min-w-11 inline-flex items-center justify-center"
      onClick={clickHandler}
      aria-label={`Switch to ${darkMode() ? "light" : "dark"} mode`}
      aria-pressed={darkMode()}
    >
      <span aria-hidden="true">{darkMode() ? "🌙" : "☀️"}</span>
    </button>
  );
}
