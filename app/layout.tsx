import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "react-hot-toast";
import PwaRegister from "@/components/PwaRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "S. K. General STORE — Quality Products, Delivered Fresh",
    template: "%s | S. K. General STORE",
  },
  description:
    "Shop groceries, household essentials, beverages & more at S. K. General STORE. Fast delivery, best prices, and fresh products in 854318 and nearby areas.",
  keywords: [
    "general store",
    "grocery",
    "online shopping",
    "household essentials",
    "SK General",
    "854318",
  ],
  authors: [{ name: "S. K. General STORE" }],
  creator: "S. K. General STORE",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://skgeneral.com",
    siteName: "S. K. General STORE",
    title: "S. K. General STORE — Quality Products, Delivered Fresh",
    description:
      "Shop groceries, household essentials, beverages & more. Fast delivery, best prices.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#0f172a",
                  color: "#f8fafc",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  padding: "0.75rem 1.25rem",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                },
                success: {
                  iconTheme: { primary: "#16a34a", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#fff" },
                },
              }}
            />
            <PwaRegister />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
