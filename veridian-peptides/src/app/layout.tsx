import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart/cart-context";
import { CurrencyProvider } from "@/components/i18n/currency-provider";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { getCurrency, getLocale } from "@/lib/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif for headlines — gives the storefront an elegant, premium voice
// while body copy stays on the clean Geist sans.
const fraunces = Fraunces({
  variable: "--font-display-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://veridian-peptides.test";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Veridian Peptides — Independently Tested Research Peptides",
    template: "%s · Veridian Peptides",
  },
  description:
    "European supplier of independently HPLC-tested research peptides. Public certificate-of-analysis vault, batch verification and fast EU shipping. For research use only.",
  openGraph: {
    type: "website",
    siteName: "Veridian Peptides",
  },
  alternates: { canonical: "/" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Veridian Peptides",
  url: SITE_URL,
  description:
    "Independently HPLC-tested research peptides with a public certificate-of-analysis vault.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@veridian-peptides.test",
    contactType: "customer support",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currency, locale] = await Promise.all([getCurrency(), getLocale()]);
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <LocaleProvider initial={locale}>
          <CurrencyProvider initial={currency}>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CookieConsent />
            </CartProvider>
          </CurrencyProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
