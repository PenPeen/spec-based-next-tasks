import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "タスク管理アプリ",
  description: "シンプルなタスク管理アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {children}
        </main>
      </body>
    </html>
  );
}
