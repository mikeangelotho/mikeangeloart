import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Show, Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import "./app.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { NoHydration } from "solid-js/web";

export default function App() {
  return (
    <MetaProvider>
      <NoHydration>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WH1W29P097"></script>
        <script innerHTML={`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)}
  gtag('js', new Date());

  gtag('config', 'G-WH1W29P097');`}>
        </script>
      </NoHydration>
      <Router
        root={(props) => {
          const location = useLocation();

          return (
            <>
              <Navbar />
              <Suspense>{props.children}</Suspense>
              <Show when={location.pathname !== "/about"}>
                <Footer />
              </Show>
            </>
          );
        }}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
