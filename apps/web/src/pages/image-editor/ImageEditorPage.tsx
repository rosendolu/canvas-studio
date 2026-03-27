import { useCallback, useEffect, useRef } from 'react'
import {
  Box, Group, ActionIcon, Tooltip, SegmentedControl, Text,
  useMantineColorScheme,
} from '@mantine/core'
import { IconPointer, IconDownload } from '@tabler/icons-react'
import CanvasPlayer from '../../components/CanvasPlayer/CanvasPlayer'
import { ElementMenu } from '../../components/ElementMenu/ElementMenu'
import { useLiveStore } from '../../store/liveStore'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import { useTranslation } from 'react-i18next'
import { useCanvasConfig } from '../../hooks/useCanvasConfig'
import { PropertyPanel } from '../../components/PropertyPanel/PropertyPanel'
import { useCanvasExport } from '../../hooks/useCanvasExport'

export function ImageEditorPage() {
  const { pages, drawWidth, drawHeight, aspectRatio, dispatch } = useLiveStore()
  const { t } = useTranslation()
  const { colorScheme } = useMantineColorScheme()
  const stageBg = colorScheme === 'light' ? '#e9ecef' : '#2c2c2c'

  // stageRef lifted here so ExportButton (outside CanvasPlayer tree) can access it
  const stageRef = useRef<any>(null)
  const { exportPng } = useCanvasExport(stageRef)

  const { aspectRatio: savedRatio, setAspectRatio: saveRatio, ASPECT_RATIO_OPTIONS } = useCanvasConfig()

  useEffect(() => {
    if (savedRatio && savedRatio !== aspectRatio) {
      dispatch({ type: 'setAspectRatio', payload: savedRatio })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAspectRatioChange = useCallback((v: string) => {
    saveRatio(v)
    dispatch({ type: 'setAspectRatio', payload: v })
  }, [dispatch, saveRatio])

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

  const handleApplyTemplate = useCallback((templateElements: CanvasElement[], aspectRatio: string) => {
    // Clear current canvas and apply template elements + aspect ratio
    dispatch({ type: 'activeElement', payload: '' })
    dispatch({ type: 'setAspectRatio', payload: aspectRatio })
    saveRatio(aspectRatio)
    // Replace all elements with template elements
    dispatch({ type: 'updateElements', payload: templateElements })
  }, [dispatch, saveRatio])

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
          onChange={handleAspectRatioChange}
          data={ASPECT_RATIO_OPTIONS}
        />
        <Box style={{ flex: 1 }} />
        <Text size="xs" c="dimmed">{t('imageEditor.elementCount', { count: elements.length })}</Text>
        {activeUid && (
          <Tooltip label={t('imageEditor.deselect')}>
            <ActionIcon variant="subtle" size="sm" onClick={() => dispatch({ type: 'activeElement', payload: '' })}>
              <IconPointer size={14} />
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip label={t('imageEditor.exportPng')}>
          <ActionIcon variant="subtle" size="sm" onClick={() => exportPng('canvas-export.png')}>
            <IconDownload size={14} />
          </ActionIcon>
        </Tooltip>
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
            onApplyTemplate={handleApplyTemplate}
            bgColor={page.bgColor}
            onBgColorChange={color => dispatch({ type: 'setBgColor', payload: color })}
          />
        </Box>

        {/* Center: Canvas */}
        <Box style={{ flex: 1, minWidth: 0, background: stageBg, position: 'relative' }}>
          <CanvasPlayer
            stageRef={stageRef}
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
