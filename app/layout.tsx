import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

export const metadata: Metadata = {
  title: "Project 8 Change | Thoughts & Observations",
  description: "Next.jsとWordPress REST APIを組み合わせたモダンなブログ体験",
  // サーチコンソールの確認コードを設定しました
  verification: {
    google: 'P7I_39CcBZuBkbYlDMIOIjN0MEo4Z_JuwVA8-7xccUY', 
  },
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
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  );
}
