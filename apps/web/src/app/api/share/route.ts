import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { createShare } from '@/lib/services/share'
import { CreateShareSchema } from '@/lib/schemas/share'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const parsed = CreateShareSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const share = await createShare(parsed.data)
    return NextResponse.json(share, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
