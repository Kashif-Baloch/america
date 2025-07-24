// app/font.ts
import { Inter, Roboto } from "next/font/google";
import localFont from "next/font/local";

// Roboto font
export const roboto = Roboto({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

// Inter font
export const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// SF Pro Display (local)
export const sfProDisplay = localFont({
  src: [
    {
      path: "./SF-Pro-Display-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Ultralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro-display",
  display: "swap",
});
