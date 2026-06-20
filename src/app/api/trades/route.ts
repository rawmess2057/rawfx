import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse(null, { status: 401 })

  const trades = await prisma.trade.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json({ trades })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse(null, { status: 401 })

  const body = await request.json()

  const trade = await prisma.trade.create({
    data: {
      ...body,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ trade })
}
