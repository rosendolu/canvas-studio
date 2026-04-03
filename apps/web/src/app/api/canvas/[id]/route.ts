import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getCanvas, updateCanvas, deleteCanvas } from '@/lib/services/canvas'
import { UpdateCanvasSchema } from '@/lib/schemas/canvas'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  const { id } = await params
  try {
    const canvas = await getCanvas(id)
    return NextResponse.json(canvas)
  } catch (err) {
    return handleError(err)
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  const { id } = await params
  const body = await req.json()
  const parsed = UpdateCanvasSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const canvas = await updateCanvas(id, parsed.data)
    return NextResponse.json(canvas)
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  const { id } = await params
  try {
    await deleteCanvas(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
