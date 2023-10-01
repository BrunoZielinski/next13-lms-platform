import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ToastProvider } from '@/components/providers/toaster-provider'
import { ConfettiProvider } from '@/components/providers/confetti-provider'
import { NProgressBarProvider } from '@/components/providers/nprogress-bar-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LMS Platform',
  description: 'LMS Platform built with Next.js and Clerk',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider />
          <ConfettiProvider />
          <NProgressBarProvider />

          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
