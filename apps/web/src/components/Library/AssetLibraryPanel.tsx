import { useState, useCallback } from 'react'
import {
  Box, Text, TextInput, Select, Group, ActionIcon, Button, Tabs,
  Loader, SimpleGrid, Card, Image, Badge, Tooltip, Modal, Stack,
  FileButton, Progress, ThemeIcon,
} from '@mantine/core'
import {
  IconSearch, IconUpload, IconTrash, IconPlus,
  IconPhoto, IconPencil,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useAssets } from '../../hooks/useLibrary'
import type { ApiAsset } from '../../api/libraryApi'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import { initElementPos } from '@canvas-studio/canvas-core'
import { nanoid } from 'nanoid'

interface AssetLibraryPanelProps {
  drawWidth: number
  drawHeight: number
  onInsert: (element: CanvasElement) => void
}

const ASSET_TYPE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'background', label: 'Background' },
  { value: 'sticker', label: 'Sticker' },
  { value: 'apng', label: 'APNG' },
  { value: 'product', label: 'Product' },
  { value: 'other', label: 'Other' },
]

function assetToElement(asset: ApiAsset, drawWidth: number, drawHeight: number): CanvasElement {
  const base: CanvasElement = {
    uid: nanoid(),
    type: asset.assetType === 'background' ? 'background'
      : asset.assetType === 'apng' ? 'apng'
      : asset.assetType === 'product' ? 'product'
      : 'sticker',
    src: asset.url,
    left: 0, top: 0,
    width: asset.width || 200, height: asset.height || 200,
    originalWidth: asset.width || 200, originalHeight: asset.height || 200,
    scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
    visible: true, opacity: 1,
  }
  return initElementPos(base, drawWidth, drawHeight)
}

export function AssetLibraryPanel({ drawWidth, drawHeight, onInsert }: AssetLibraryPanelProps) {
  const { t } = useTranslation()
  const [q, setQ] = useState('')
  const [assetType, setAssetType] = useState('')
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [renameAsset, setRenameAsset] = useState<ApiAsset | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const { assets, loading, upload, update, remove } = useAssets(
    q || assetType ? { q: q || undefined, assetType: assetType || undefined } : undefined
  )

  const handleUpload = useCallback(async (file: File | null) => {
    if (!file) return
    setUploadProgress(10)
    try {
      await upload(file, assetType || 'sticker', file.name)
      setUploadProgress(null)
    } catch {
      setUploadProgress(null)
    }
  }, [upload, assetType])

  const handleRename = useCallback(async () => {
    if (!renameAsset || !renameValue.trim()) return
    await update(renameAsset._id, { name: renameValue.trim() })
    setRenameAsset(null)
  }, [renameAsset, renameValue, update])

  return (
    <Box p="xs" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search + filter */}
      <Group gap="xs" mb="xs">
        <TextInput
          size="xs"
          placeholder={t('library.search')}
          leftSection={<IconSearch size={12} />}
          value={q}
          onChange={e => setQ(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          size="xs"
          data={ASSET_TYPE_OPTIONS}
          value={assetType}
          onChange={v => setAssetType(v ?? '')}
          style={{ width: 100 }}
        />
      </Group>

      {/* Upload button */}
      <FileButton onChange={handleUpload} accept="image/*">
        {(props) => (
          <Button size="xs" leftSection={<IconUpload size={12} />} variant="light" mb="xs" {...props} fullWidth>
            {t('library.upload')}
          </Button>
        )}
      </FileButton>
      {uploadProgress !== null && <Progress value={uploadProgress} size="xs" mb="xs" animated />}

      {/* Grid */}
      {loading ? (
        <Box ta="center" mt="lg"><Loader size="sm" /></Box>
      ) : assets.length === 0 ? (
        <Text size="xs" c="dimmed" ta="center" mt="lg">{t('library.empty')}</Text>
      ) : (
        <SimpleGrid cols={2} spacing={6} style={{ overflowY: 'auto', flex: 1 }}>
          {assets.map(asset => (
            <Card key={asset._id} p={4} radius="sm" withBorder style={{ cursor: 'pointer', position: 'relative' }}>
              <Card.Section onClick={() => onInsert(assetToElement(asset, drawWidth, drawHeight))}>
                <Image
                  src={asset.url}
                  height={60}
                  fit="contain"
                  fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23eee'/%3E%3C/svg%3E"
                />
              </Card.Section>
              <Text size="xs" truncate mt={2}>{asset.name}</Text>
              <Group gap={2} mt={2}>
                <Tooltip label={t('library.rename')} withArrow>
                  <ActionIcon size="xs" variant="subtle" onClick={() => { setRenameAsset(asset); setRenameValue(asset.name) }}>
                    <IconPencil size={10} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={t('library.delete')} withArrow>
                  <ActionIcon size="xs" variant="subtle" color="red" onClick={() => remove(asset._id)}>
                    <IconTrash size={10} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Rename modal */}
      <Modal
        opened={!!renameAsset}
        onClose={() => setRenameAsset(null)}
        title={t('library.rename')}
        size="xs"
      >
        <Stack>
          <TextInput
            value={renameValue}
            onChange={e => setRenameValue(e.currentTarget.value)}
            label={t('library.assetName')}
          />
          <Button size="xs" onClick={handleRename}>{t('common.save')}</Button>
        </Stack>
      </Modal>
    </Box>
  )
}
