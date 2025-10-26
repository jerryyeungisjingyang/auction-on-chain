import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "链上物品拍卖",
  description: "简单的链上物品拍卖 dApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
}
