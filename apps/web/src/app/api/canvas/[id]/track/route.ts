import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { saveCanvasTrack } from '@/lib/services/canvas'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  const { id } = await params
  const body = await req.json()
  if (!Array.isArray(body.track)) {
    return NextResponse.json({ error: 'Validation failed: track must be an array' }, { status: 400 })
  }
  try {
    const canvas = await saveCanvasTrack(id, body.track)
    return NextResponse.json(canvas)
  } catch (err) {
    return handleError(err)
  }
}
