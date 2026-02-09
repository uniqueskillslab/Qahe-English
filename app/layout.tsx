import type { Metadata } from "next";
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
  title: "IELTS Speaking Practice - AI-Powered Assessment Platform",
  description: "Master IELTS speaking with our advanced AI examiner. Get instant band scores, detailed feedback, and professional improvement guidance for all three parts of the IELTS speaking test.",
  keywords: "IELTS, speaking, practice, AI, assessment, band score, feedback, English, test preparation, examiner, professional, advanced",
  authors: [{ name: "IELTS Speaking Practice Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
  openGraph: {
    title: "IELTS Speaking Practice - AI Assessment Platform",
    description: "Professional IELTS speaking practice with AI examiner feedback",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "IELTS Speaking Practice - AI Assessment",
    description: "Practice IELTS speaking with professional AI feedback",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script src="https://js.puter.com/v2/"></script>
      </body>
    </html>
  );
}
