import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Cheap Flights From - Flight Deals From Your City | CheapFlightsFrom.us",
    template: "%s | CheapFlightsFrom.us",
  },
  description:
    "Find cheap flights from your city. We track prices on thousands of routes daily and alert you when fares drop. Save more, search less.",
  metadataBase: new URL("https://cheapflightsfrom.us"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CheapFlightsFrom.us",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
