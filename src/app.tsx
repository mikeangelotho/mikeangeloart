import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Show, Suspense } from "solid-js";
import { MetaProvider, Title, Link } from "@solidjs/meta";
import "./app.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import LenisProvider from "./components/LenisProvider";

export default function App() {
  return (
    <MetaProvider>
      <Title>Mike Angelo - Creative Technologist</Title>
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <Link rel="preload" href="https://cdn.mikeangelo.art/anim.json" as="fetch" crossorigin="" />
      <Link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Zalando+Sans+Expanded:ital,wght@0,200..900;1,200..900&display=swap"
        as="style"
      />
      <Link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Zalando+Sans+Expanded:ital,wght@0,200..900;1,200..900&display=swap"
        rel="stylesheet"
      />
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
