import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'sonner';
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Graphit",
  description: "Interactive Data Visualization Platform",
    generator: 'keshav.dev',
      icons: {
    icon: "/favicon.png",
  
  },
    openGraph: {
    title: "Graphit - Interactive Data Visualization Platform",
    description: "Explore, visualize, and analyze your data with Graphit, built on Next.js and React.",
    url: "https://graphit-eta.vercel.app/", 
    siteName: "Graphit",
    locale: "en_US",
    type: "website",
  },
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={inter.className}>
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

          {children}
          
        </ThemeProvider>
         <Toaster />
      </body>
    </html>
  )
}
