import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getBrandKit, updateBrandKit, deleteBrandKit } from '@/lib/services/brandkit'
import { UpdateBrandKitSchema } from '@/lib/schemas/brandkit'

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
    const brandKit = await getBrandKit(id)
    return NextResponse.json(brandKit)
  } catch (err) {
    return handleError(err)
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  const { id } = await params
  const body = await req.json()
  const parsed = UpdateBrandKitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const brandKit = await updateBrandKit(id, parsed.data)
    return NextResponse.json(brandKit)
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
    await deleteBrandKit(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
