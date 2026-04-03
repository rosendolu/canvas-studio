import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { listBrandKits, createBrandKit } from '@/lib/services/brandkit'
import { CreateBrandKitSchema } from '@/lib/schemas/brandkit'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function GET() {
  await connectDB()
  const result = await listBrandKits()
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const parsed = CreateBrandKitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const brandKit = await createBrandKit(parsed.data)
    return NextResponse.json(brandKit, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
