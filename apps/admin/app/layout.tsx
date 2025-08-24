import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LSC Admin',
  description: 'Admin console for Life Story Capsule',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
