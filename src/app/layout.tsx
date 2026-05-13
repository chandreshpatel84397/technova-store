import type { Metadata } from "next";
import { AppChrome } from "@/components/layout/AppChrome";
import { Providers } from "@/components/layout/Providers";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: {
    default: "TechNova - Premium Tech Marketplace",
    template: "%s | TechNova"
  },
  description: "A production-style customer e-commerce frontend with Redux, auth guards, persisted orders, and modern shopping flows.",
  keywords: ["TechNova", "Next.js", "E-commerce", "Redux Toolkit", "TailwindCSS"],
  openGraph: {
    title: "TechNova",
    description: "Premium electronics marketplace built with Next.js 14.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
