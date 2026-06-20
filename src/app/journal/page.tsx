import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import JournalView from './journal-view'

export default async function JournalPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <JournalView />
}
