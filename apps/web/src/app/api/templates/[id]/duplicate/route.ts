import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { duplicateTemplate } from '@/lib/services/template'

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
    const template = await duplicateTemplate(id)
    return NextResponse.json(template, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
