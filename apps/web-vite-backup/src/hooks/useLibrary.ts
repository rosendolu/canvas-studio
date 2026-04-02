import { useState, useEffect, useCallback } from 'react'
import { templateApi, assetApi, brandKitApi } from '../api/libraryApi'
import type { ApiTemplate, ApiAsset, ApiBrandKit, ListTemplatesParams, ListAssetsParams } from '../api/libraryApi'

// ─── useTemplates ───────────────────────────────────────────────

export function useTemplates(params?: ListTemplatesParams) {
  const [templates, setTemplates] = useState<ApiTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setTemplates(await templateApi.list(params))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { reload() }, [reload])

  const create = useCallback(async (body: Parameters<typeof templateApi.create>[0]) => {
    const created = await templateApi.create(body)
    setTemplates(prev => [created, ...prev])
    return created
  }, [])

  const update = useCallback(async (id: string, body: Parameters<typeof templateApi.update>[1]) => {
    const updated = await templateApi.update(id, body)
    setTemplates(prev => prev.map(t => t._id === id ? updated : t))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await templateApi.delete(id)
    setTemplates(prev => prev.filter(t => t._id !== id))
  }, [])

  const duplicate = useCallback(async (id: string) => {
    const copy = await templateApi.duplicate(id)
    setTemplates(prev => [copy, ...prev])
    return copy
  }, [])

  return { templates, loading, error, reload, create, update, remove, duplicate }
}

// ─── useAssets ──────────────────────────────────────────────────

export function useAssets(params?: ListAssetsParams) {
  const [assets, setAssets] = useState<ApiAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setAssets(await assetApi.list(params))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { reload() }, [reload])

  const upload = useCallback(async (
    file: File, assetType: string, name?: string, tags?: string[]
  ) => {
    const created = await assetApi.upload(file, assetType, name, tags)
    setAssets(prev => [created, ...prev])
    return created
  }, [])

  const update = useCallback(async (id: string, body: Parameters<typeof assetApi.update>[1]) => {
    const updated = await assetApi.update(id, body)
    setAssets(prev => prev.map(a => a._id === id ? updated : a))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await assetApi.delete(id)
    setAssets(prev => prev.filter(a => a._id !== id))
  }, [])

  return { assets, loading, error, reload, upload, update, remove }
}

// ─── useBrandKits ───────────────────────────────────────────────

export function useBrandKits() {
  const [brandKits, setBrandKits] = useState<ApiBrandKit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setBrandKits(await brandKitApi.list())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const create = useCallback(async (body: Parameters<typeof brandKitApi.create>[0]) => {
    const created = await brandKitApi.create(body)
    setBrandKits(prev => [created, ...prev])
    return created
  }, [])

  const update = useCallback(async (id: string, body: Parameters<typeof brandKitApi.update>[1]) => {
    const updated = await brandKitApi.update(id, body)
    setBrandKits(prev => prev.map(k => k._id === id ? updated : k))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await brandKitApi.delete(id)
    setBrandKits(prev => prev.filter(k => k._id !== id))
  }, [])

  const duplicate = useCallback(async (id: string) => {
    const copy = await brandKitApi.duplicate(id)
    setBrandKits(prev => [copy, ...prev])
    return copy
  }, [])

  return { brandKits, loading, error, reload, create, update, remove, duplicate }
}
