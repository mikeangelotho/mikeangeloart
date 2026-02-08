// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" class="dark">
        <head>
          {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-WH1W29P097"></script>
          <script>{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WH1W29P097');`}
          </script>
          {/* Google Tag Manager */}
          <script>{`function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NXLD3RCS');`}</script>
          {/* End Google Tag Manager */}
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
          {/* Google Tag Manager (noscript) */}
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NXLD3RCS"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
          {/* End Google Tag Manager (noscript) */}
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
