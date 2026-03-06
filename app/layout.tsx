import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern WordPress Blog | Headlines & Insights",
  description: "Next.jsとWordPress REST APIを組み合わせたモダンなブログ体験",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
