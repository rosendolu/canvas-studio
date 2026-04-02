import { useState, useCallback } from 'react'
import {
  Modal, Button, Group, Text, CopyButton, SegmentedControl,
  Stack, Switch, Anchor, Loader, TextInput,
} from '@mantine/core'
import { IconShare, IconCopy, IconCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface ShareModalProps {
  elements: CanvasElement[]
  aspectRatio: string
  bgColor: string
}

const BASE_API = import.meta.env.VITE_API_BASE_URL ?? ''
const APP_ORIGIN = typeof window !== 'undefined' ? window.location.origin : ''

async function createShare(body: object): Promise<{ shareId: string }> {
  const res = await fetch(`${BASE_API}/api/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to create share')
  return res.json()
}

export function ShareButton({ elements, aspectRatio, bgColor }: ShareModalProps) {
  const { t } = useTranslation()
  const [opened, setOpened] = useState(false)
  const [expiry, setExpiry] = useState<'never' | '24h' | '7d'>('never')
  const [allowFork, setAllowFork] = useState(true)
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleShare = useCallback(async () => {
    setLoading(true)
    setError(null)
    setShareUrl(null)
    try {
      const { shareId } = await createShare({
        snapshot: { elements },
        aspectRatio,
        bgColor,
        expiry,
        allowFork,
      })
      setShareUrl(`${APP_ORIGIN}/preview/${shareId}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [elements, aspectRatio, bgColor, expiry, allowFork])

  const handleOpen = () => {
    setShareUrl(null)
    setError(null)
    setOpened(true)
  }

  return (
    <>
      <Button
        size="xs"
        variant="light"
        leftSection={<IconShare size={13} />}
        onClick={handleOpen}
      >
        {t('share.button')}
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t('share.title')}
        size="sm"
      >
        <Stack gap="sm">
          {!shareUrl ? (
            <>
              <Text size="sm" c="dimmed">{t('share.description')}</Text>

              <div>
                <Text size="xs" mb={4}>{t('share.expiry')}</Text>
                <SegmentedControl
                  size="xs"
                  value={expiry}
                  onChange={v => setExpiry(v as any)}
                  data={[
                    { label: t('share.expiryNever'), value: 'never' },
                    { label: t('share.expiry24h'),   value: '24h' },
                    { label: t('share.expiry7d'),    value: '7d' },
                  ]}
                  fullWidth
                />
              </div>

              <Switch
                label={t('share.allowFork')}
                checked={allowFork}
                onChange={e => setAllowFork(e.currentTarget.checked)}
                size="sm"
              />

              {error && <Text size="xs" c="red">{error}</Text>}

              <Button onClick={handleShare} loading={loading} fullWidth>
                {t('share.generate')}
              </Button>
            </>
          ) : (
            <>
              <Text size="sm">{t('share.ready')}</Text>
              <Group gap="xs">
                <TextInput value={shareUrl} readOnly style={{ flex: 1 }} size="xs" />
                <CopyButton value={shareUrl}>
                  {({ copied, copy }) => (
                    <Button
                      size="xs"
                      variant={copied ? 'filled' : 'light'}
                      color={copied ? 'teal' : 'blue'}
                      leftSection={copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                      onClick={copy}
                    >
                      {copied ? t('share.copied') : t('share.copy')}
                    </Button>
                  )}
                </CopyButton>
              </Group>
              <Anchor size="xs" href={shareUrl} target="_blank">
                {t('share.openPreview')} ↗
              </Anchor>
              <Button variant="subtle" size="xs" onClick={() => setShareUrl(null)}>
                {t('share.newLink')}
              </Button>
            </>
          )}
        </Stack>
      </Modal>
    </>
  )
}
