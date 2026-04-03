import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { assetAbsolutePath } from '@/lib/services/asset'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'assets')

const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.apng': 'image/apng',
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ storageKey: string }> }
) {
  const { storageKey } = await params
  if (!storageKey || storageKey.includes('/') || storageKey.includes('..') || storageKey.includes('\\')) {
    return NextResponse.json({ error: 'Invalid storageKey' }, { status: 400 })
  }
  const absPath = path.join(UPLOAD_DIR, storageKey)
  const realPath = path.resolve(absPath)
  if (!realPath.startsWith(path.resolve(UPLOAD_DIR))) {
    return NextResponse.json({ error: 'Invalid storageKey' }, { status: 400 })
  }
  if (!fs.existsSync(realPath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const ext = path.extname(storageKey).toLowerCase()
  const contentType = mimeTypes[ext] ?? 'application/octet-stream'
  const fileBuffer = fs.readFileSync(realPath)
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}
