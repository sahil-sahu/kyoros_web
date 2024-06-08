import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import ReactQueryProvider from "@/lib/queryClient";
import ForegroundMessage from "@/lib/foregroundMessage";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Kyoros",
  description: "Kyoros Patient Tracker",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster />
        <ForegroundMessage></ForegroundMessage>
      </body>
    </html>
  );
}
