import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getProject, updateProject, deleteProject } from '@/lib/services/project'
import { UpdateProjectSchema } from '@/lib/schemas/project'

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
    const project = await getProject(id)
    return NextResponse.json(project)
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
  const parsed = UpdateProjectSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const project = await updateProject(id, parsed.data)
    return NextResponse.json(project)
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
    await deleteProject(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
