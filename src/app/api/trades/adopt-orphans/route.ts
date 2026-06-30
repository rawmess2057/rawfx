import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse(null, { status: 401 })

  const mainJournal = await prisma.journal.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  })

  if (!mainJournal) {
    return NextResponse.json({ error: 'No journal found' }, { status: 400 })
  }

  const result = await prisma.trade.updateMany({
    where: {
      userId: session.user.id,
      journalId: null,
    },
    data: { journalId: mainJournal.id },
  })

  return NextResponse.json({ success: true, adoptedCount: result.count })
}
