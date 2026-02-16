import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cheap Flights From - Flight Deals From Your City | CheapFlightsFrom.us",
    template: "%s | CheapFlightsFrom.us",
  },
  description:
    "Find cheap flights from your city. We track prices on thousands of routes daily and alert you when fares drop. Save more, search less.",
  metadataBase: new URL("https://cheapflightsfrom.us"),
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CheapFlightsFrom.us",
    title: "Pay Less. Travel More.",
    description:
      "Flight deals from your city. We track thousands of routes daily and alert you when fares drop.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CheapFlightsFrom.us - Pay Less. Travel More.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pay Less. Travel More.",
    description:
      "Flight deals from your city. We track thousands of routes daily and alert you when fares drop.",
    images: ["/og-image.jpg"],
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
