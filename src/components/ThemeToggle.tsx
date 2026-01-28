import { createSignal, onMount } from "solid-js";

export default function ThemeToggle(props: { onClick: () => void }) {
    const [darkMode, setDarkMode] = createSignal(false);

    onMount(() => {
        if (document.documentElement.classList.contains("dark")) {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    })

    function clickHandler() {
        props.onClick();
        if (darkMode()) {
            document.documentElement.classList.remove("dark");
            setDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }

return (
        <button
            class="cursor-pointer select-none invert bg-transparent border-none p-0"
            onClick={clickHandler}
            aria-label={`Switch to ${darkMode() ? 'light' : 'dark'} mode`}
        >
            {darkMode() ? "🌙" : "☀️"}
        </button>
    )
}