import { Box, ActionIcon, Text, Tooltip, Stack, Group } from '@mantine/core'
import {
  IconEye, IconEyeOff, IconLock, IconLockOpen,
  IconChevronUp, IconChevronDown, IconTrash,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface LayerPanelProps {
  elements: CanvasElement[]
  activeUid: string
  onSetActive: (uid: string) => void
  onUpdate: (uid: string, updates: Partial<CanvasElement>) => void
  onDelete: (uid: string) => void
  onReorder: (elements: CanvasElement[]) => void
}

const TYPE_ICON: Record<string, string> = {
  background: '🖼',
  sticker: '✨',
  product: '📦',
  picture: '🖼',
  bubbleText: '💬',
  avatar: '👤',
  'picture-scrolling': '🔄',
  slideshow: '🎴',
}

function typeIcon(type: string) {
  return TYPE_ICON[type] ?? '▪'
}

export function LayerPanel({
  elements, activeUid, onSetActive, onUpdate, onDelete, onReorder,
}: LayerPanelProps) {
  const { t } = useTranslation()

  // Display in reverse order (top layer first)
  const reversed = [...elements].reverse()

  function moveUp(uid: string) {
    const idx = elements.findIndex(e => e.uid === uid)
    if (idx >= elements.length - 1) return
    const next = [...elements]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    onReorder(next)
  }

  function moveDown(uid: string) {
    const idx = elements.findIndex(e => e.uid === uid)
    if (idx <= 0) return
    const next = [...elements]
    ;[next[idx], next[idx - 1]] = [next[idx - 1], next[idx]]
    onReorder(next)
  }

  if (elements.length === 0) {
    return (
      <Box p="md">
        <Text size="xs" c="dimmed" ta="center" mt="lg">{t('layers.empty')}</Text>
      </Box>
    )
  }

  return (
    <Stack gap={0} p="xs">
      <Text size="xs" fw={600} mb={4} c="dimmed">{t('layers.title')} ({elements.length})</Text>
      {reversed.map((el) => {
        const isActive = el.uid === activeUid
        return (
          <Box
            key={el.uid}
            onClick={() => onSetActive(el.uid)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 4px',
              borderRadius: 4,
              cursor: 'pointer',
              background: isActive
                ? 'var(--mantine-color-blue-light)'
                : 'transparent',
              opacity: el.visible === false ? 0.4 : 1,
            }}
          >
            {/* Type icon */}
            <Text size="xs" style={{ width: 18, flexShrink: 0, textAlign: 'center' }}>
              {typeIcon(el.type)}
            </Text>

            {/* Name */}
            <Text
              size="xs"
              style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              fw={isActive ? 600 : 400}
            >
              {el.type}{el.text ? `: ${el.text.slice(0, 12)}` : ''}
            </Text>

            {/* Controls */}
            <Group gap={2} style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              <Tooltip label={t('layers.moveUp')} withArrow>
                <ActionIcon size="xs" variant="subtle" onClick={() => moveUp(el.uid)}>
                  <IconChevronUp size={11} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={t('layers.moveDown')} withArrow>
                <ActionIcon size="xs" variant="subtle" onClick={() => moveDown(el.uid)}>
                  <IconChevronDown size={11} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={el.visible === false ? t('layers.show') : t('layers.hide')} withArrow>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => onUpdate(el.uid, { visible: !el.visible })}
                >
                  {el.visible === false ? <IconEyeOff size={11} /> : <IconEye size={11} />}
                </ActionIcon>
              </Tooltip>
              <Tooltip label={el.locked ? t('layers.unlock') : t('layers.lock')} withArrow>
                <ActionIcon
                  size="xs"
                  variant={el.locked ? 'filled' : 'subtle'}
                  color={el.locked ? 'orange' : undefined}
                  onClick={() => onUpdate(el.uid, { locked: !el.locked })}
                >
                  {el.locked ? <IconLock size={11} /> : <IconLockOpen size={11} />}
                </ActionIcon>
              </Tooltip>
              <Tooltip label={t('layers.delete')} withArrow>
                <ActionIcon size="xs" variant="subtle" color="red" onClick={() => onDelete(el.uid)}>
                  <IconTrash size={11} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Box>
        )
      })}
    </Stack>
  )
}
