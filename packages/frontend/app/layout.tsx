// --- file: packages/frontend/app/layout.tsx ---
import './globals.css'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Krishi Mitra - AI Plant Disease Detection And Yield Prediction</title>
        <meta name="description" content="AI-powered plant disease diagnosis and yield prediction" />
        {/* FIX: The line break in the content attribute has been removed. */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <LanguageProvider>
            <AuthProvider>
              <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
                {children}
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}