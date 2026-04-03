import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { duplicateBrandKit } from '@/lib/services/brandkit'

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
    const brandKit = await duplicateBrandKit(id)
    return NextResponse.json(brandKit, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
