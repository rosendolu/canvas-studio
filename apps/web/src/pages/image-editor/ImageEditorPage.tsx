import { useCallback } from 'react'
import { Box, Group, ActionIcon, Tooltip, SegmentedControl, Text, Stack, NumberInput, ColorInput, Button, Divider, Switch, useMantineColorScheme } from '@mantine/core'
import CanvasPlayer from '../../components/CanvasPlayer/CanvasPlayer'
import { ElementMenu } from '../../components/ElementMenu/ElementMenu'
import { useLiveStore } from '../../store/liveStore'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import { useTranslation } from 'react-i18next'

export function ImageEditorPage() {
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
        <Text size="sm" fw={500}>🖼️ {t('nav.imageEditor')}</Text>
        <SegmentedControl
          size="xs"
          value={aspectRatio}
          onChange={v => dispatch({ type: 'setAspectRatio', payload: v })}
          data={[
            { label: '16:9', value: '16:9' },
            { label: '9:16', value: '9:16' },
            { label: '1:1', value: '1:1' },
          ]}
        />
        <Box style={{ flex: 1 }} />
        <Text size="xs" c="dimmed">{elements.length} 个元素</Text>
        {activeUid && (
          <Tooltip label="取消选中">
            <ActionIcon variant="subtle" size="sm" onClick={() => dispatch({ type: 'activeElement', payload: '' })}>
              ✕
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

function PropertyPanel({ activeElement, onUpdate, onDelete }: {
  activeElement?: CanvasElement
  onUpdate: (u: Partial<CanvasElement>) => void
  onDelete: () => void
}) {
  if (!activeElement) {
    return (
      <Box p="md">
        <Text size="sm" c="dimmed" ta="center" mt="xl">选中一个元素查看属性</Text>
      </Box>
    )
  }

  return (
    <Stack p="md" gap="xs">
      <Text size="sm" fw={600}>元素属性</Text>
      <Text size="xs" c="dimmed">{activeElement.type}</Text>
      <Divider />
      <NumberInput size="xs" label="X 位置" value={Math.round(activeElement.left)} onChange={v => onUpdate({ left: Number(v) })} />
      <NumberInput size="xs" label="Y 位置" value={Math.round(activeElement.top)} onChange={v => onUpdate({ top: Number(v) })} />
      <NumberInput size="xs" label="宽度" value={Math.round(activeElement.width)} onChange={v => onUpdate({ width: Number(v) })} />
      <NumberInput size="xs" label="高度" value={Math.round(activeElement.height)} onChange={v => onUpdate({ height: Number(v) })} />
      <NumberInput size="xs" label="旋转" value={Math.round(activeElement.rotation || 0)} suffix="°" onChange={v => onUpdate({ rotation: Number(v) })} />
      <Switch size="xs" label="显示" checked={activeElement.visible} onChange={e => onUpdate({ visible: e.currentTarget.checked })} />
      {activeElement.type === 'bubbleText' && (
        <>
          <Divider label="文字" />
          <ColorInput size="xs" label="颜色" value={activeElement.color || '#fff'} onChange={v => onUpdate({ color: v })} />
          <NumberInput size="xs" label="字号" value={activeElement.fontSize || 12} onChange={v => onUpdate({ fontSize: Number(v) })} />
        </>
      )}
      <Divider />
      <Button size="xs" color="red" variant="outline" onClick={onDelete}>删除</Button>
    </Stack>
  )
}
