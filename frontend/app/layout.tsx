import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Krishi Mitra - AI Plant Disease Detection</title>
        <meta name="description" content="AI-powered plant disease diagnosis for healthier crops" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          {children}
        </div>
      </body>
    </html>
  )
}