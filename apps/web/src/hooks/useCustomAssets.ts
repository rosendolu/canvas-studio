import { useEffect, useState, useCallback } from 'react'
import localforage from 'localforage'
import { nanoid } from 'nanoid'

export type AssetType = 'background' | 'sticker' | 'mask'

export interface CustomAsset {
  id: string
  type: AssetType
  src: string         // URL or base64 data URL
  label: string
  originalWidth: number
  originalHeight: number
  createdAt: number
}

/** Resolve image natural dimensions from a URL or data URL */
function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = src
  })
}

/** Read a File as base64 data URL */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const storeKey = (type: AssetType) => `custom-assets:${type}`

export function useCustomAssets(type: AssetType) {
  const [items, setItems] = useState<CustomAsset[]>([])
  const [loading, setLoading] = useState(true)

  // Load from localforage on mount
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    localforage
      .getItem<CustomAsset[]>(storeKey(type))
      .then(stored => {
        if (!cancelled) setItems(stored ?? [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [type])

  /** Persist updated list */
  const persist = useCallback(async (next: CustomAsset[]) => {
    setItems(next)
    await localforage.setItem(storeKey(type), next)
  }, [type])

  /** Add asset from a URL */
  const addFromUrl = useCallback(async (url: string, label?: string) => {
    const { width, height } = await getImageDimensions(url)
    const asset: CustomAsset = {
      id: nanoid(),
      type,
      src: url,
      label: label || url.split('/').pop()?.split('?')[0] || 'image',
      originalWidth: width,
      originalHeight: height,
      createdAt: Date.now(),
    }
    await persist([asset, ...items])
    return asset
  }, [items, persist, type])

  /** Add asset from a File (converts to base64) */
  const addFromFile = useCallback(async (file: File) => {
    const dataUrl = await readFileAsDataURL(file)
    const { width, height } = await getImageDimensions(dataUrl)
    const asset: CustomAsset = {
      id: nanoid(),
      type,
      src: dataUrl,
      label: file.name,
      originalWidth: width,
      originalHeight: height,
      createdAt: Date.now(),
    }
    await persist([asset, ...items])
    return asset
  }, [items, persist, type])

  /** Remove asset by id */
  const remove = useCallback(async (id: string) => {
    await persist(items.filter(a => a.id !== id))
  }, [items, persist])

  return { items, loading, addFromUrl, addFromFile, remove }
}
