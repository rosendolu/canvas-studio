import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getTemplate, updateTemplate, deleteTemplate } from '@/lib/services/template'
import { UpdateTemplateSchema } from '@/lib/schemas/template'

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
    const template = await getTemplate(id)
    return NextResponse.json(template)
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
  const parsed = UpdateTemplateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const template = await updateTemplate(id, parsed.data)
    return NextResponse.json(template)
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
    await deleteTemplate(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
