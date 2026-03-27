import * as path from 'path'
import * as fs from 'fs/promises'
import * as crypto from 'crypto'

export interface StoredFile {
  storageKey: string   // relative path under upload dir
  url: string          // public URL
  size: number
  mimeType: string
  checksum: string
}

export class AssetStorageService {
  private readonly uploadDir: string
  private readonly urlBase: string

  constructor(uploadDir: string, urlBase: string) {
    this.uploadDir = uploadDir
    this.urlBase = urlBase
  }

  async put(buffer: Buffer, originalName: string, mimeType: string): Promise<StoredFile> {
    const checksum = crypto.createHash('sha256').update(buffer).digest('hex')
    // Only keep alphanumeric + dash/underscore/dot from original extension; no path separators
    const ext = (path.extname(originalName) || '').replace(/[^a-zA-Z0-9.]/g, '').slice(0, 10)
    const storageKey = `${Date.now()}-${checksum.slice(0, 8)}${ext}`
    const fullPath = path.join(this.uploadDir, storageKey)
    await fs.mkdir(this.uploadDir, { recursive: true })
    await fs.writeFile(fullPath, buffer)
    return {
      storageKey,
      url: `${this.urlBase}/${storageKey}`,
      size: buffer.byteLength,
      mimeType,
      checksum,
    }
  }

  async delete(storageKey: string): Promise<void> {
    // Guard against path traversal
    const safe = path.basename(storageKey)
    const fullPath = path.join(this.uploadDir, safe)
    await fs.unlink(fullPath).catch(() => { /* ignore missing file */ })
  }

  absolutePath(storageKey: string): string {
    // Guard against path traversal: only allow the basename
    const safe = path.basename(storageKey)
    return path.join(this.uploadDir, safe)
  }
}
