import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Show, Suspense } from "solid-js";
import "./app.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

export default function App() {
  return (
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
  );
}
