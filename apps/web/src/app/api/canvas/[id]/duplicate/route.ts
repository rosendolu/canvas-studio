import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { duplicateCanvas } from '@/lib/services/canvas'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  const { id } = await params
  try {
    const canvas = await duplicateCanvas(id)
    return NextResponse.json(canvas, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
