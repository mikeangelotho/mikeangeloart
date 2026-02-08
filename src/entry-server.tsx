// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" class="dark">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="https://cdn.mikeangelo.art/favicon.svg" />
          {assets}
          <title>
            Art Director & Web Developer in New Jersey and the greater New York
            area - Mike Angelo | Graphic Design, Advertising Campaigns, Web
            Design & Development.
          </title>
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
