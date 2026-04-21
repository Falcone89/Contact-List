import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Contacts',
  description: 'Contact Manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  )
}
