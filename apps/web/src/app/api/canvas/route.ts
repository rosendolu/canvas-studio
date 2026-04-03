import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { listCanvases, createCanvas } from '@/lib/services/canvas'
import { CreateCanvasSchema } from '@/lib/schemas/canvas'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function GET(req: Request) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const result = await listCanvases({
    mode: searchParams.get('mode') ?? undefined,
    projectId: searchParams.get('projectId') ?? undefined,
    isPublic:
      searchParams.get('isPublic') === 'true'
        ? true
        : searchParams.get('isPublic') === 'false'
          ? false
          : undefined,
  })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const parsed = CreateCanvasSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const canvas = await createCanvas(parsed.data)
    return NextResponse.json(canvas, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
