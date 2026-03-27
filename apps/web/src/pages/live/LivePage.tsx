import { useCallback } from 'react'
import {
  Box, Group, ActionIcon, Tooltip, SegmentedControl, Text,
  useMantineColorScheme,
} from '@mantine/core'
import { IconPointer } from '@tabler/icons-react'
import CanvasPlayer from '../../components/CanvasPlayer/CanvasPlayer'
import { ElementMenu } from '../../components/ElementMenu/ElementMenu'
import { useLiveStore } from '../../store/liveStore'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import { useTranslation } from 'react-i18next'
import { PropertyPanel } from '../../components/PropertyPanel/PropertyPanel'

export function LivePage() {
  const { pages, drawWidth, drawHeight, aspectRatio, dispatch } = useLiveStore()
  const { t } = useTranslation()
  const { colorScheme } = useMantineColorScheme()
  const stageBg = colorScheme === 'light' ? '#e9ecef' : '#2c2c2c'

  const page = pages[0]
  const elements = page.elements
  const activeUid = page.activeElementsUid

  const handleSyncPos = useCallback((uid: string, updates: Partial<CanvasElement>) => {
    dispatch({ type: 'updateElementAttr', payload: { uid, updates } })
  }, [dispatch])

  const handleSetActive = useCallback((_type: string, uid: string) => {
    dispatch({ type: 'activeElement', payload: uid })
  }, [dispatch])

  const handleSetCanvasSize = useCallback((w: number, h: number) => {
    dispatch({ type: 'setCanvasSize', payload: { drawWidth: w, drawHeight: h } })
  }, [dispatch])

  const handleUpdateElements = useCallback((els: CanvasElement[], w?: number, h?: number) => {
    dispatch({ type: 'updateElementsPos', payload: { elements: els, drawWidth: w, drawHeight: h } })
  }, [dispatch])

  const handleAddElement = useCallback((el: Omit<CanvasElement, 'uid'>) => {
    dispatch({ type: 'addElement', payload: el as CanvasElement })
  }, [dispatch])

  const handleDeleteElement = useCallback((uid: string) => {
    dispatch({ type: 'removeElement', payload: uid })
  }, [dispatch])

  const activeElement = elements.find(el => el.uid === activeUid)

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Toolbar */}
      <Group
        px="md" py="xs" gap="sm"
        style={{
          borderBottom: '1px solid var(--mantine-color-default-border)',
          background: 'var(--mantine-color-body)',
        }}
      >
        <Text size="sm" fw={500}>📡 {t('liveEditor.title')}</Text>
        <SegmentedControl
          size="xs"
          value={aspectRatio}
          onChange={v => dispatch({ type: 'setAspectRatio', payload: v })}
          data={[
            { label: '9:16', value: '9:16' },
            { label: '16:9', value: '16:9' },
            { label: '1:1', value: '1:1' },
          ]}
        />
        <Box style={{ flex: 1 }} />
        <Text size="xs" c="dimmed">{elements.length} el</Text>
        {activeUid && (
          <Tooltip label="Deselect">
            <ActionIcon variant="subtle" size="sm" onClick={() => dispatch({ type: 'activeElement', payload: '' })}>
              <IconPointer size={14} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      {/* Main Area */}
      <Box style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Left: Assets */}
        <Box style={{
          width: 230,
          borderRight: '1px solid var(--mantine-color-default-border)',
          background: 'var(--mantine-color-body)',
          overflowY: 'auto',
        }}>
          <ElementMenu
            onAddElement={handleAddElement}
            bgColor={page.bgColor}
            onBgColorChange={color => dispatch({ type: 'setBgColor', payload: color })}
          />
        </Box>

        {/* Center: Canvas */}
        <Box style={{ flex: 1, minWidth: 0, background: stageBg, position: 'relative' }}>
          <CanvasPlayer
            elements={elements}
            activeUid={activeUid}
            bgColor={page.bgColor}
            aspectRatio={aspectRatio}
            drawWidth={drawWidth}
            drawHeight={drawHeight}
            onSyncPos={handleSyncPos}
            onSetActive={handleSetActive}
            onSetCanvasSize={handleSetCanvasSize}
            onUpdateElements={handleUpdateElements}
            onDeleteElement={handleDeleteElement}
          />
        </Box>

        {/* Right: Properties */}
        <Box style={{
          width: 220,
          borderLeft: '1px solid var(--mantine-color-default-border)',
          background: 'var(--mantine-color-body)',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          <PropertyPanel
            activeElement={activeElement}
            onUpdate={updates => {
              if (activeUid) dispatch({ type: 'updateElementAttr', payload: { uid: activeUid, updates } })
            }}
            onDelete={() => {
              if (activeUid) dispatch({ type: 'removeElement', payload: activeUid })
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
