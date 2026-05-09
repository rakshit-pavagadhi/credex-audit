import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "AI Spend Audit | Credex — Stop Overpaying for AI Tools",
  description:
    "Free audit for startups: find out exactly where you're overspending on AI tools like Cursor, ChatGPT, Claude, and GitHub Copilot. Get personalized savings recommendations in 60 seconds.",
  keywords: [
    "AI spend audit",
    "AI tool savings",
    "Cursor pricing",
    "ChatGPT pricing",
    "Claude pricing",
    "GitHub Copilot pricing",
    "AI cost optimization",
    "Credex",
  ],
  openGraph: {
    title: "AI Spend Audit | Credex",
    description:
      "Your team is probably overspending on AI tools. Get a free, instant audit and save thousands per year.",
    type: "website",
    url: "https://credex-audit.vercel.app",
    siteName: "Credex AI Spend Audit",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit | Credex",
    description:
      "Your team is probably overspending on AI tools. Get a free, instant audit.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.variable} ${jetBrainsMono.variable} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
