import { createRoot } from "react-dom/client";
import App from "./App.tsx";

/* Fonts are served from our own origin rather than fonts.googleapis.com.
   An embedded Google Fonts request hands the visitor's IP address to a US
   third party before they have done anything, which a German court (LG
   München I, 3 O 17493/20) held to be an actionable GDPR breach - and no
   consent banner fixes it, because the request fires on page load.
   Self-hosting removes the transfer entirely instead of asking about it.

   It is also faster: no third-party DNS lookup, TLS handshake and
   round-trip standing between first paint and readable text.

   Inter is the variable font, so weights 300-600 come from one file rather
   than four. Both packages ship every unicode subset, but each @font-face
   carries a unicode-range, so an English visitor downloads only latin. */
import "@fontsource-variable/inter/wght.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";

import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
