/**
 * API client for Template, Asset, BrandKit endpoints.
 * Uses fetch; base URL from VITE_API_BASE_URL env or '/api'.
 */

const BASE = (import.meta.env.VITE_API_BASE_URL ?? '') + ''

async function req<T>(method: string, path: string, body?: unknown, query?: Record<string, string>): Promise<T> {
  let url = `${BASE}${path}`
  if (query) {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined && v !== ''))
    )
    const qs = params.toString()
    if (qs) url += `?${qs}`
  }
  const res = await fetch(url, {
    method,
    headers: body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`API ${method} ${path} failed: ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json()
}

// ─── Templates ─────────────────────────────────────────────────────

export interface ApiTemplate {
  _id: string
  name: string
  description?: string
  type: 'scene' | 'overlay'
  tags: string[]
  thumbnail?: string
  payload: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ListTemplatesParams {
  type?: 'scene' | 'overlay'
  q?: string
  tags?: string[]
}

export const templateApi = {
  list: (params?: ListTemplatesParams) =>
    req<ApiTemplate[]>('GET', '/api/templates', undefined, {
      type: params?.type,
      q: params?.q,
      tags: params?.tags?.join(','),
    } as any),
  get: (id: string) => req<ApiTemplate>('GET', `/api/templates/${id}`),
  create: (body: Omit<ApiTemplate, '_id' | 'createdAt' | 'updatedAt'>) =>
    req<ApiTemplate>('POST', '/api/templates', body),
  update: (id: string, body: Partial<ApiTemplate>) =>
    req<ApiTemplate>('PUT', `/api/templates/${id}`, body),
  duplicate: (id: string) => req<ApiTemplate>('POST', `/api/templates/${id}/duplicate`),
  delete: (id: string) => req<{ success: boolean }>('DELETE', `/api/templates/${id}`),
}

// ─── Assets ────────────────────────────────────────────────────────

export interface ApiAsset {
  _id: string
  name: string
  assetType: string
  mimeType: string
  size: number
  url: string
  width?: number
  height?: number
  tags: string[]
  checksum?: string
  createdAt: string
  updatedAt: string
}

export interface ListAssetsParams {
  assetType?: string
  q?: string
  tags?: string[]
}

export const assetApi = {
  list: (params?: ListAssetsParams) =>
    req<ApiAsset[]>('GET', '/api/assets', undefined, {
      assetType: params?.assetType,
      q: params?.q,
      tags: params?.tags?.join(','),
    } as any),
  get: (id: string) => req<ApiAsset>('GET', `/api/assets/${id}`),
  upload: (file: File, assetType: string, name?: string, tags?: string[]) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('assetType', assetType)
    if (name) fd.append('name', name)
    if (tags?.length) fd.append('tags', tags.join(','))
    return req<ApiAsset>('POST', '/api/assets/upload', fd)
  },
  update: (id: string, body: { name?: string; assetType?: string; tags?: string[] }) =>
    req<ApiAsset>('PUT', `/api/assets/${id}`, body),
  delete: (id: string) => req<{ success: boolean }>('DELETE', `/api/assets/${id}`),
}

// ─── Brand Kits ────────────────────────────────────────────────────

export interface ApiBrandColor { label: string; value: string }
export interface ApiBrandTypography { fontFamily: string; fontSize: number; color: string; lineHeight?: number }

export interface ApiBrandKit {
  _id: string
  name: string
  palette: ApiBrandColor[]
  typography: ApiBrandTypography[]
  logoAssetId?: string
  createdAt: string
  updatedAt: string
}

export const brandKitApi = {
  list: () => req<ApiBrandKit[]>('GET', '/api/brand-kits'),
  get: (id: string) => req<ApiBrandKit>('GET', `/api/brand-kits/${id}`),
  create: (body: Omit<ApiBrandKit, '_id' | 'createdAt' | 'updatedAt'>) =>
    req<ApiBrandKit>('POST', '/api/brand-kits', body),
  update: (id: string, body: Partial<ApiBrandKit>) =>
    req<ApiBrandKit>('PUT', `/api/brand-kits/${id}`, body),
  duplicate: (id: string) => req<ApiBrandKit>('POST', `/api/brand-kits/${id}/duplicate`),
  delete: (id: string) => req<{ success: boolean }>('DELETE', `/api/brand-kits/${id}`),
}
