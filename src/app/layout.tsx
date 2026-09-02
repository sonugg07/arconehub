import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  metadataBase: new URL("https://arcone.hub"),
  title: "ArcOne Hub — One Hub. Everything Onchain.",
  description: "A unified onchain super-app for payments, DEX swaps, token launches, and Web3 jobs — powered by Arc & native USDC.",
  icons: {
    icon: "/brand/arcone-logo.png",
  },
  openGraph: {
    title: "ArcOne Hub — One Hub. Everything Onchain.",
    description: "Pay. Swap. Launch. Work. Sub-second EVM finality and predictable native USDC gas on Arc.",
    images: ["/brand/arcone-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050713] text-[#F8FAFC] antialiased selection:bg-arc-blue/30 selection:text-white">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
