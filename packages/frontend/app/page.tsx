import { redirect } from 'next/navigation'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function HomePage() {
  // This will be handled by middleware, but adding as fallback
  redirect('/landing')
}