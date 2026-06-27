import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: { default: "기억작전 625", template: "%s | 기억작전 625" },
  description: "퀴즈로 기억하고, 편지로 감사하는 6.25 참전용사 감사 캠페인",
  openGraph: {
    title: "기억작전 625",
    description: "퀴즈로 기억하고, 편지로 감사하는 6.25 참전용사 감사 캠페인",
    images: ["/assets/generated/hero-service-visual-v2.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
