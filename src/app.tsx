import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Show, Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import "./app.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import LenisProvider from "./components/LenisProvider";

export default function App() {
  return (
    <MetaProvider>
      <Router
        root={(props) => {
          const location = useLocation();

          return (
            <>
              <LenisProvider>
                <Navbar />
                <Suspense>{props.children}</Suspense>
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
