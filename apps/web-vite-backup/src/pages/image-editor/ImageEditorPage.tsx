import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box, Group, ActionIcon, Tooltip, SegmentedControl, Text,
  useMantineColorScheme,
} from '@mantine/core'
import { IconPointer, IconDownload, IconArrowBackUp, IconArrowForwardUp } from '@tabler/icons-react'
import CanvasPlayer from '../../components/CanvasPlayer/CanvasPlayer'
import { ElementMenu } from '../../components/ElementMenu/ElementMenu'
import { useLiveStore } from '../../store/liveStore'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import { alignElements } from '@canvas-studio/canvas-core'
import type { AlignMode, AlignBasis } from '@canvas-studio/canvas-core'
import { useTranslation } from 'react-i18next'
import { useCanvasConfig } from '../../hooks/useCanvasConfig'
import { PropertyPanel } from '../../components/PropertyPanel/PropertyPanel'
import { LayerPanel } from '../../components/LayerPanel/LayerPanel'
import { AlignToolbar } from '../../components/AlignToolbar/AlignToolbar'
import { ShareButton } from '../../components/ShareButton/ShareButton'
import { useCanvasExport } from '../../hooks/useCanvasExport'

export function ImageEditorPage() {
  const { pages, drawWidth, drawHeight, aspectRatio, dispatch, undo, redo, canUndo, canRedo, selectedUids } = useLiveStore()
  const [alignBasis, setAlignBasis] = useState<AlignBasis>('canvas')
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

  // Keyboard undo/redo
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [undo, redo])

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

  // Align selected elements and push to store
  const handleAlign = useCallback((mode: AlignMode) => {
    const uids = selectedUids.length >= 1 ? selectedUids : (activeUid ? [activeUid] : [])
    if (!uids.length) return
    const aligned = alignElements(elements, uids, mode, {
      canvasWidth: drawWidth, canvasHeight: drawHeight, basis: alignBasis,
    })
    dispatch({ type: 'updateElements', payload: aligned })
  }, [selectedUids, activeUid, elements, drawWidth, drawHeight, alignBasis, dispatch])

  // Library: insert asset as element
  const handleInsertAsset = useCallback((el: CanvasElement) => {
    dispatch({ type: 'addElement', payload: el })
  }, [dispatch])

  // Library: apply scene template (from TemplatePanel)
  const handleApplySceneFromLib = useCallback((
    els: CanvasElement[], ratio: string, bg: string, _mode: 'replace' | 'merge'
  ) => {
    dispatch({ type: 'activeElement', payload: '' })
    dispatch({ type: 'setAspectRatio', payload: ratio })
    saveRatio(ratio)
    dispatch({ type: 'updateElements', payload: els })
  }, [dispatch, saveRatio])

  // Library: insert overlay template elements
  const handleInsertOverlay = useCallback((els: CanvasElement[]) => {
    els.forEach(el => dispatch({ type: 'addElement', payload: el }))
  }, [dispatch])

  // Brand kit apply: update text style defaults (notification only — no forced rewrite)
  const handleApplyBrandKit = useCallback((_kit: ApiBrandKit) => {
    // Brand kit is available via context/store in future; for now just a no-op placeholder
  }, [])

  const activeElement = elements.find(el => el.uid === activeUid)

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Toolbar */}
      <Group
        px="md" py="xs" gap="sm"
        style={{
          borderBottom: '1px solid var(--mantine-color-default-border)',
          background: 'var(--mantine-color-body)',
          flexWrap: 'wrap',
        }}
      >
        <Text size="sm" fw={500}>🖼️ {t('nav.imageEditor')}</Text>
        <SegmentedControl
          size="xs"
          value={aspectRatio}
          onChange={handleAspectRatioChange}
          data={ASPECT_RATIO_OPTIONS}
        />
        {(selectedUids.length >= 1 || !!activeUid) && (
          <AlignToolbar
            selectedCount={selectedUids.length || (activeUid ? 1 : 0)}
            basis={alignBasis}
            onBasisChange={setAlignBasis}
            onAlign={handleAlign}
          />
        )}
        <Box style={{ flex: 1 }} />
        <Text size="xs" c="dimmed">{t('imageEditor.elementCount', { count: elements.length })}</Text>
        <Tooltip label={t('editor.undo')}>
          <ActionIcon variant="subtle" size="sm" onClick={undo} disabled={!canUndo()}>
            <IconArrowBackUp size={14} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={t('editor.redo')}>
          <ActionIcon variant="subtle" size="sm" onClick={redo} disabled={!canRedo()}>
            <IconArrowForwardUp size={14} />
          </ActionIcon>
        </Tooltip>
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
        <ShareButton elements={elements} aspectRatio={aspectRatio} bgColor={page.bgColor} />
      </Group>

      {/* Main Area */}
      <Box style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Left: Assets — tabbed between ElementMenu, Library, Templates, Brand Kit */}
        <Box style={{
          width: 230,
          borderRight: '1px solid var(--mantine-color-default-border)',
          background: 'var(--mantine-color-body)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <Tabs defaultValue="elements" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Tabs.List style={{ flexShrink: 0 }}>
              <Tabs.Tab value="elements" style={{ fontSize: 11 }}>{t('nav.elements')}</Tabs.Tab>
              <Tabs.Tab value="library" style={{ fontSize: 11 }}>{t('library.tab')}</Tabs.Tab>
              <Tabs.Tab value="templates" style={{ fontSize: 11 }}>{t('templates.tab')}</Tabs.Tab>
              <Tabs.Tab value="brandkit" style={{ fontSize: 11 }}>{t('brandkit.tab')}</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="elements" style={{ flex: 1, overflow: 'hidden' }}>
              <ElementMenu
                onAddElement={handleAddElement}
                onApplyTemplate={handleApplyTemplate}
                bgColor={page.bgColor}
                onBgColorChange={color => dispatch({ type: 'setBgColor', payload: color })}
              />
            </Tabs.Panel>
            <Tabs.Panel value="library" style={{ flex: 1, overflow: 'hidden' }}>
              <AssetLibraryPanel
                drawWidth={drawWidth}
                drawHeight={drawHeight}
                onInsert={handleInsertAsset}
              />
            </Tabs.Panel>
            <Tabs.Panel value="templates" style={{ flex: 1, overflow: 'hidden' }}>
              <TemplatePanel
                elements={elements}
                aspectRatio={aspectRatio}
                bgColor={page.bgColor}
                activeUids={activeUid ? [activeUid] : []}
                onApplyScene={handleApplySceneFromLib}
                onInsertOverlay={handleInsertOverlay}
              />
            </Tabs.Panel>
            <Tabs.Panel value="brandkit" style={{ flex: 1, overflow: 'auto' }}>
              <BrandKitPanel onApply={handleApplyBrandKit} />
            </Tabs.Panel>
          </Tabs>
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

        {/* Right: Layers + Properties */}
        <Box style={{
          width: 220,
          borderLeft: '1px solid var(--mantine-color-default-border)',
          background: 'var(--mantine-color-body)',
          overflowY: 'auto',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <LayerPanel
            elements={elements}
            activeUid={activeUid}
            onSetActive={uid => dispatch({ type: 'activeElement', payload: uid })}
            onUpdate={(uid, updates) => dispatch({ type: 'updateElementAttr', payload: { uid, updates } })}
            onDelete={uid => dispatch({ type: 'removeElement', payload: uid })}
            onReorder={els => dispatch({ type: 'updateElements', payload: els })}
          />
          <Box style={{ borderTop: '1px solid var(--mantine-color-default-border)', flexShrink: 0 }}>
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
    </Box>
  )
}
