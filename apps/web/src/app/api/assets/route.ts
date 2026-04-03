import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { listAssets, uploadAsset } from '@/lib/services/asset'
import { ListAssetsSchema } from '@/lib/schemas/asset'
import { formidable } from 'formidable'
import * as fs from 'fs/promises'

function handleError(err: unknown) {
  const msg = String(err)
  if (msg === 'Error:not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (msg.startsWith('Error:bad_request:')) return NextResponse.json({ error: msg.replace('Error:bad_request:', '') }, { status: 400 })
  return NextResponse.json({ error: msg }, { status: 500 })
}

export async function GET(req: Request) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const parsed = ListAssetsSchema.safeParse({
    assetType: searchParams.get('assetType') ?? undefined,
    q: searchParams.get('q') ?? undefined,
    tags: searchParams.get('tags') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }
  const result = await listAssets(parsed.data)
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  await connectDB()
  try {
    const [fields, files] = await (formidable() as any).parse(req)
    const fileList: any[] = files.file
    if (!fileList || !fileList.length) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }
    const f = fileList[0]
    const assetType = Array.isArray(fields.assetType) ? fields.assetType[0] : fields.assetType
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name
    const rawTags = Array.isArray(fields.tags) ? fields.tags[0] : fields.tags
    const tags = rawTags ? rawTags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
    if (!assetType) {
      return NextResponse.json({ error: 'assetType is required' }, { status: 400 })
    }
    const buffer = await fs.readFile(f.filepath)
    const asset = await uploadAsset({
      buffer,
      originalName: f.originalFilename ?? f.newFilename,
      mimeType: f.mimetype ?? 'application/octet-stream',
      assetType,
      name,
      tags,
    })
    return NextResponse.json(asset, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
