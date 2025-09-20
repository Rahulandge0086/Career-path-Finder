import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/hooks/use-auth"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "CareerPath - Personalized Career Guidance",
  description: "Discover your ideal career path with personalized assessments and skill-based recommendations",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <Navigation />
            {children}
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
