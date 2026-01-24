import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vedic Astro - Free Kundli, Horoscope & Astrology Predictions",
  description: "Get your free Vedic astrology Kundli, daily horoscope, Kundli matching, Panchang, Dasha predictions, and personalized remedies. Discover your cosmic blueprint today!",
  keywords: ["kundli", "vedic astrology", "horoscope", "birth chart", "kundli matching", "panchang", "dasha", "astrology predictions"],
  authors: [{ name: "Vedic Astro" }],
  openGraph: {
    title: "Vedic Astro - Free Kundli & Astrology",
    description: "Generate your free Vedic astrology Kundli and get personalized predictions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
