import Header from '@/components/Header'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import type React from 'react'; // Added import for React
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Uber Clone',
  description: 'A simple Uber clone with rider and driver functionality'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <Header />
          <main className='bg-black'>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
