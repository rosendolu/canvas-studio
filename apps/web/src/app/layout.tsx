import type { Metadata } from 'next'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Canvas Studio',
  description: 'Open-source canvas editor for building live streaming rooms and video editing experiences.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
