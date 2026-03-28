import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Text, Center, Loader, Title, Badge, Stack, Button } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import CanvasPlayer from '../../components/CanvasPlayer/CanvasPlayer'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import { useMantineColorScheme } from '@mantine/core'

const BASE_API = import.meta.env.VITE_API_BASE_URL ?? ''

interface ShareData {
  shareId: string
  snapshot: { elements: CanvasElement[] }
  aspectRatio: string
  bgColor: string
  expiry: string
  allowFork: boolean
  viewCount: number
}

async function fetchShare(shareId: string): Promise<ShareData> {
  const res = await fetch(`${BASE_API}/api/share/${shareId}`)
  if (res.status === 410) throw new Error('expired')
  if (!res.ok) throw new Error('not_found')
  return res.json()
}

export function PreviewPage() {
  const { shareId } = useParams<{ shareId: string }>()
  const { t } = useTranslation()
  const { colorScheme } = useMantineColorScheme()
  const stageBg = colorScheme === 'light' ? '#e9ecef' : '#2c2c2c'

  const [data, setData] = useState<ShareData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [drawWidth, setDrawWidth] = useState(0)
  const [drawHeight, setDrawHeight] = useState(0)

  useEffect(() => {
    if (!shareId) return
    fetchShare(shareId)
      .then(setData)
      .catch(e => setError(e.message))
  }, [shareId])

  if (error) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Title order={3}>{error === 'expired' ? t('share.previewExpired') : t('share.previewNotFound')}</Title>
          <Button component="a" href="/">{t('share.goHome')}</Button>
        </Stack>
      </Center>
    )
  }

  if (!data) {
    return <Center h="100vh"><Loader /></Center>
  }

  const elements: CanvasElement[] = data.snapshot?.elements ?? []

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: stageBg }}>
      {/* Minimal header */}
      <Box px="md" py="xs" style={{ background: 'var(--mantine-color-body)', borderBottom: '1px solid var(--mantine-color-default-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text size="sm" fw={600}>🖼️ Canvas Studio</Text>
        <Badge variant="light" size="sm">{t('share.readOnly')}</Badge>
        {data.allowFork && (
          <Button
            size="xs"
            variant="light"
            ml="auto"
            component="a"
            href={`/image-editor?fork=${data.shareId}`}
          >
            {t('share.forkButton')}
          </Button>
        )}
      </Box>

      {/* Canvas */}
      <Box style={{ flex: 1, minHeight: 0 }}>
        <CanvasPlayer
          elements={elements}
          activeUid=""
          bgColor={data.bgColor}
          aspectRatio={data.aspectRatio}
          drawWidth={drawWidth}
          drawHeight={drawHeight}
          onSyncPos={() => {}}
          onSetActive={() => {}}
          onSetCanvasSize={(w, h) => { setDrawWidth(w); setDrawHeight(h) }}
          onUpdateElements={() => {}}
          onDeleteElement={() => {}}
          readOnly
        />
      </Box>
    </Box>
  )
}
