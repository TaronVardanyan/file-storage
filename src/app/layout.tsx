import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./providers/convex-client-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Drive",
  description: "File Storage for personal purposes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
