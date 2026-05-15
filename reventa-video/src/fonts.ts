import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";

export const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const { fontFamily: bebasFamily } = loadBebas("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const COLORS = {
  bg: "#050505",
  bgSoft: "#0d0d0d",
  green: "#00ff7f",
  greenSoft: "#1f8a4c",
  greenGlow: "rgba(0, 255, 127, 0.45)",
  white: "#ffffff",
  gray: "#8a8a8a",
  border: "rgba(255,255,255,0.08)",
};
