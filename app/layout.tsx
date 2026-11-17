import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkyRoute | Weather & Travel Planner",
  description: "10-day weather, nearby attractions, and seasonal travel guidance without paid APIs."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
