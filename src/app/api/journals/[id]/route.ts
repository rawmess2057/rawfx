import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

async function getOwnedJournal(id: string, userId: string) {
  const journal = await prisma.journal.findUnique({ where: { id } })
  if (!journal || journal.userId !== userId) return null
  return journal
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse(null, { status: 401 })

  try {
    const { id } = await params
    const existing = await getOwnedJournal(id, session.user.id)
    if (!existing) return new NextResponse(null, { status: 404 })

    const body = await request.json()
    delete body.id
    delete body.userId

    const journal = await prisma.journal.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({ journal })
  } catch (error) {
    console.error('[PUT /api/journals/:id]', error)
    return NextResponse.json(
      { error: 'Failed to update journal' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse(null, { status: 401 })

  try {
    const { id } = await params
    const existing = await getOwnedJournal(id, session.user.id)
    if (!existing) return new NextResponse(null, { status: 404 })

    await prisma.journal.delete({ where: { id } })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE /api/journals/:id]', error)
    return NextResponse.json(
      { error: 'Failed to delete journal' },
      { status: 500 },
    )
  }
}
