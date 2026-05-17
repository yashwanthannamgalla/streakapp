import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreakApp",
  description: "A calm consistency journal for ambitious builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full bg-neutral-950 antialiased" lang="en">
      <body className="min-h-full bg-neutral-950 text-stone-50">
        <div className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#070707_0%,#111111_45%,#0d1410_100%)]">
          <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-white/20" />
          {children}
        </div>
      </body>
    </html>
  );
}
