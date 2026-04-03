import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { listProjects, createProject } from '@/lib/services/project'
import { CreateProjectSchema } from '@/lib/schemas/project'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function GET() {
  await connectDB()
  const result = await listProjects()
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const parsed = CreateProjectSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const project = await createProject(parsed.data)
    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
