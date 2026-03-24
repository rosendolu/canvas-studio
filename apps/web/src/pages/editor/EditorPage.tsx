import { useCallback } from 'react'
import { Box, Group, ActionIcon, Tooltip, SegmentedControl, Text, Stack, NumberInput, ColorInput, Button, Divider, Switch } from '@mantine/core'
import { IconZoomIn, IconZoomOut, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react'
import CanvasPlayer from '../../components/CanvasPlayer/CanvasPlayer'
import TimelineRuler from '../../components/Timeline/TimelineRuler'
import { useEditorStore } from '../../store/editorStore'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import { useTranslation } from 'react-i18next'
import { ElementMenu } from '../../components/ElementMenu/ElementMenu'

export function EditorPage() {
  const {
    track, drawWidth, drawHeight, aspectRatio,
    currentFrame, fps, trackScale, chooseDataUid, color,
    dispatch,
  } = useEditorStore()
  const { t } = useTranslation()

  const elements = track
    .flatMap(t => t.lineList.map(el => ({ ...el, muted: t.muted, volume: t.volume })))
    .filter((el: any) => el.start == null || (el.start <= currentFrame && currentFrame < (el.end ?? Infinity)))

  const handleSyncPos = useCallback((uid: string, updates: Partial<CanvasElement>) => {
    dispatch({ type: 'updateElementPos', payload: { uid, updates } })
  }, [dispatch])

  const handleSetActive = useCallback((type: string, uid: string) => {
    dispatch({ type: 'setActiveUid', payload: uid })
  }, [dispatch])

  const handleSetCanvasSize = useCallback((w: number, h: number) => {
    dispatch({ type: 'setCanvasSize', payload: { drawWidth: w, drawHeight: h } })
  }, [dispatch])

  const handleUpdateElements = useCallback((els: CanvasElement[], w?: number, h?: number) => {
    const newTrack = track.map(line => ({
      ...line,
      lineList: line.lineList.map(el => {
        const found = els.find(e => e.uid === el.uid)
        return found ? { ...el, ...found } : el
      }),
    }))
    dispatch({ type: 'updateTrack', payload: newTrack })
    if (w && h) dispatch({ type: 'setCanvasSize', payload: { drawWidth: w, drawHeight: h } })
  }, [dispatch, track])

  const handleAddElement = useCallback((el: Omit<CanvasElement, 'uid'>) => {
    dispatch({ type: 'addTrackElement', payload: { element: el as CanvasElement } })
  }, [dispatch])

  const timelineUserConfig = { start: 0, step: fps, scale: trackScale }

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Main area: left panel + canvas */}
      <Box style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Left: Assets Panel */}
        <Box style={{
          width: 230,
          borderRight: '1px solid var(--mantine-color-default-border)',
          background: 'var(--mantine-color-body)',
          overflowY: 'auto',
        }}>
          <ElementMenu
            onAddElement={handleAddElement}
            bgColor={color}
            onBgColorChange={c => dispatch({ type: 'setBgColor', payload: c })}
          />
        </Box>

        {/* Center: Canvas — always dark checkerboard bg for canvas preview */}
        <Box style={{ flex: 1, minWidth: 0, background: 'var(--mantine-color-dark-9, #141414)', position: 'relative' }}>
          <CanvasPlayer
            elements={elements as CanvasElement[]}
            activeUid={chooseDataUid}
            bgColor={color}
            aspectRatio={aspectRatio}
            drawWidth={drawWidth}
            drawHeight={drawHeight}
            onSyncPos={handleSyncPos}
            onSetActive={handleSetActive}
            onSetCanvasSize={handleSetCanvasSize}
            onUpdateElements={handleUpdateElements}
          />
        </Box>
      </Box>

      {/* Timeline */}
      <Box style={{
        height: 180,
        borderTop: '1px solid var(--mantine-color-default-border)',
        background: 'var(--mantine-color-body)',
        flexShrink: 0,
      }}>
        <Group p="xs" gap="xs" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Tooltip label={t('editor.stop')}>
            <ActionIcon variant="subtle" size="sm" onClick={() => dispatch({ type: 'setCurrentFrame', payload: 0 })}>
              <IconPlayerStop size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('editor.play')}>
            <ActionIcon variant="subtle" size="sm">
              <IconPlayerPlay size={14} />
            </ActionIcon>
          </Tooltip>
          <Box style={{ flex: 1 }} />
          <Tooltip label={t('editor.zoomOut')}>
            <ActionIcon variant="subtle" size="sm" onClick={() => dispatch({ type: 'setTrackScale', payload: Math.max(0, trackScale - 10) })}>
              <IconZoomOut size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('editor.zoomIn')}>
            <ActionIcon variant="subtle" size="sm" onClick={() => dispatch({ type: 'setTrackScale', payload: Math.min(100, trackScale + 10) })}>
              <IconZoomIn size={14} />
            </ActionIcon>
          </Tooltip>
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
        </Group>

        <TimelineRuler
          userConfig={timelineUserConfig}
          track={track}
          trackScale={trackScale}
          fps={fps}
          onFrameChange={f => dispatch({ type: 'setCurrentFrame', payload: f })}
        />

        <Box p="xs">
          <Text size="xs" c="dimmed">
            {track.length === 0
              ? t('editor.noTrack')
              : track.map(t => `${t.type} (${t.lineList.length})`).join(' · ')
            }
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
