import { getFooter, getHeader } from '@/lib/global';
import Navbar from '@/components/Navbar';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intelligent Systems Group",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = await getHeader();
  const footer = await getFooter();
 
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Navbar header={header} />
        {children}
        <Footer footer={footer} />
      </body>
    </html>
  );
}
