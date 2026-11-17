import { loadFont } from "@remotion/google-fonts/Montserrat";

// Montserrat para tudo (títulos e legendas)
export const { fontFamily: MONTSERRAT } = loadFont("normal", {
  weights: ["400", "500", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});
