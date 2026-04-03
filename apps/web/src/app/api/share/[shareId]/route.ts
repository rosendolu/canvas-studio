import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getShareById, deleteShare } from '@/lib/services/share'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (msg.startsWith('Error:gone:')) return NextResponse.json({ error: msg.replace('Error:gone:', '') }, { status: 410 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  await connectDB()
  const { shareId } = await params
  try {
    const share = await getShareById(shareId)
    return NextResponse.json(share)
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  await connectDB()
  const { shareId } = await params
  await deleteShare(shareId)
  return NextResponse.json({ success: true })
}
