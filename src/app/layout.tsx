import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Chat - Intelligent Conversations Made Simple",
  description: "Experience the future of AI communication with our advanced chat platform. Get intelligent responses, use curated templates, and streamline your workflow.",
  keywords: ["AI chat", "artificial intelligence", "chat assistant", "conversation", "AI-powered"],
  authors: [{ name: "AI Chat Team" }],
  creator: "AI Chat",
  metadataBase: new URL("https://ai-chat.example.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-chat.example.com",
    title: "AI Chat - Intelligent Conversations Made Simple",
    description: "Experience the future of AI communication with our advanced chat platform.",
    siteName: "AI Chat",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chat - Intelligent Conversations Made Simple",
    description: "Experience the future of AI communication with our advanced chat platform.",
    creator: "@aichat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
