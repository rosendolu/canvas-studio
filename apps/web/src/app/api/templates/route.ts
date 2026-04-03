import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { listTemplates, createTemplate } from '@/lib/services/template'
import { ListTemplatesSchema, CreateTemplateSchema } from '@/lib/schemas/template'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function GET(req: Request) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const parsed = ListTemplatesSchema.safeParse({
    type: searchParams.get('type') ?? undefined,
    q: searchParams.get('q') ?? undefined,
    tags: searchParams.get('tags') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  const result = await listTemplates(parsed.data)
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const parsed = CreateTemplateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const template = await createTemplate(parsed.data)
    return NextResponse.json(template, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
