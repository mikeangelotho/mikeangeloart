import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Show, Suspense } from "solid-js";
import { MetaProvider, Title } from "@solidjs/meta";
import "./app.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import LenisProvider from "./components/LenisProvider";
import PageError from "./components/PageError";

export default function App() {
  return (
    <MetaProvider>
      <Title>Mike Angelo | Art Director &amp; Multidisciplinary Designer</Title>
      <Router
        root={(props) => {
          const location = useLocation();

          return (
            <>
              <LenisProvider>
                <Navbar />
                <ErrorBoundary fallback={(_, reset) => <PageError reset={reset} />}>
                  <Suspense fallback={<main class="min-h-[70vh] px-6 pt-36 text-black dark:text-white" aria-busy="true"><p role="status">Loading…</p></main>}>
                    {props.children}
                  </Suspense>
                </ErrorBoundary>
                <Show when={location.pathname !== "/about"}>
                  <Footer />
                </Show>
              </LenisProvider>

            </>
          );
        }}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
