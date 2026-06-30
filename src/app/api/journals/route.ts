import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const defaultConfig = {
  accountBalance: 1_000_000,
  riskPercent: 0.5,
  contextTimeframe: '1h',
  validationTimeframe: '15m',
  entryTimeframe: '5m',
  costsPerTrade: 0.1,
  maxLossPercent: 100,
  criteriaLabels: ['Criteria 1', 'Criteria 2', 'Criteria 3', 'Criteria 4', 'Criteria 5'],
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse(null, { status: 401 })

  const journals = await prisma.journal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ journals })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse(null, { status: 401 })

  try {
    const body = await request.json()
    const { name, type, strategy } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const journal = await prisma.journal.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        type: type || 'LIVE',
        strategy: strategy || '',
        config: defaultConfig,
      },
    })

    return NextResponse.json({ journal })
  } catch (error) {
    console.error('[POST /api/journals]', error)
    return NextResponse.json(
      { error: 'Failed to create journal' },
      { status: 500 },
    )
  }
}
