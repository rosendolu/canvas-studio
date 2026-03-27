import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box, Group, ActionIcon, Tooltip, SegmentedControl, Text,
  useMantineColorScheme,
} from '@mantine/core'
import {
  IconZoomIn, IconZoomOut, IconPlayerPlay, IconPlayerStop,
  IconPointer,
} from '@tabler/icons-react'
import CanvasPlayer from '../../components/CanvasPlayer/CanvasPlayer'
import TimelineRuler from '../../components/Timeline/TimelineRuler'
import { useEditorStore } from '../../store/editorStore'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import { useTranslation } from 'react-i18next'
import { ElementMenu } from '../../components/ElementMenu/ElementMenu'
import { useCanvasConfig } from '../../hooks/useCanvasConfig'
import { PropertyPanel } from '../../components/PropertyPanel/PropertyPanel'

export function EditorPage() {
  const {
    track, drawWidth, drawHeight, aspectRatio,
    currentFrame, fps, trackScale, chooseDataUid, color,
    dispatch,
  } = useEditorStore()
  const { t } = useTranslation()
  const { colorScheme } = useMantineColorScheme()
  const stageBg = colorScheme === 'light' ? '#e9ecef' : '#2c2c2c'

  const { aspectRatio: savedRatio, setAspectRatio: saveRatio, ASPECT_RATIO_OPTIONS } = useCanvasConfig()

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const playFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const currentFrameRef = useRef<number>(currentFrame)

  // Keep ref in sync with store value
  useEffect(() => {
    currentFrameRef.current = currentFrame
  }, [currentFrame])

  // On mount: restore saved ratio
  useEffect(() => {
    if (savedRatio && savedRatio !== aspectRatio) {
      dispatch({ type: 'setAspectRatio', payload: savedRatio })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Playback animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (playFrameRef.current != null) cancelAnimationFrame(playFrameRef.current)
      return
    }
    lastTimeRef.current = performance.now()
    const msPerFrame = 1000 / fps
    function tick(now: number) {
      const elapsed = now - lastTimeRef.current
      if (elapsed >= msPerFrame) {
        lastTimeRef.current = now - (elapsed % msPerFrame)
        dispatch({ type: 'setCurrentFrame', payload: currentFrameRef.current + 1 })
      }
      playFrameRef.current = requestAnimationFrame(tick)
    }
    playFrameRef.current = requestAnimationFrame(tick)
    return () => {
      if (playFrameRef.current != null) cancelAnimationFrame(playFrameRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, fps])

  const handlePlay = () => setIsPlaying(v => !v)
  const handleStop = () => {
    setIsPlaying(false)
    dispatch({ type: 'setCurrentFrame', payload: 0 })
  }

  const handleAspectRatioChange = useCallback((v: string) => {
    saveRatio(v)
    dispatch({ type: 'setAspectRatio', payload: v })
  }, [dispatch, saveRatio])

  const elements = track
    .flatMap(t => t.lineList.map(el => ({ ...el, muted: t.muted, volume: t.volume })))
    .filter((el: any) => el.start == null || (el.start <= currentFrame && currentFrame < (el.end ?? Infinity)))

  const handleSyncPos = useCallback((uid: string, updates: Partial<CanvasElement>) => {
    dispatch({ type: 'updateElementPos', payload: { uid, updates } })
  }, [dispatch])

  const handleSetActive = useCallback((_type: string, uid: string) => {
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

  const handleDeleteElement = useCallback((uid: string) => {
    dispatch({ type: 'removeTrackElement', payload: { uid } })
  }, [dispatch])

  const activeElement = track
    .flatMap(t => t.lineList)
    .find(el => el.uid === chooseDataUid)

  const timelineUserConfig = { start: 0, step: fps, scale: trackScale }

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Main area */}
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

        {/* Center: Canvas */}
        <Box style={{ flex: 1, minWidth: 0, background: stageBg, position: 'relative' }}>
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
              if (chooseDataUid) dispatch({ type: 'updateElementPos', payload: { uid: chooseDataUid, updates } })
            }}
            onDelete={() => {
              if (chooseDataUid) dispatch({ type: 'removeTrackElement', payload: { uid: chooseDataUid } })
            }}
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
            <ActionIcon variant="subtle" size="sm" onClick={handleStop}>
              <IconPlayerStop size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={isPlaying ? t('editor.stop') : t('editor.play')}>
            <ActionIcon
              variant={isPlaying ? 'filled' : 'subtle'}
              color={isPlaying ? 'blue' : undefined}
              size="sm"
              onClick={handlePlay}
            >
              <IconPlayerPlay size={14} />
            </ActionIcon>
          </Tooltip>
          <Text size="xs" c="dimmed">{currentFrame}f</Text>

          {chooseDataUid && (
            <Tooltip label={t('editor.deselect')}>
              <ActionIcon variant="subtle" size="sm" onClick={() => dispatch({ type: 'setActiveUid', payload: '' })}>
                <IconPointer size={14} />
              </ActionIcon>
            </Tooltip>
          )}

          <Box style={{ flex: 1 }} />
          <Text size="xs" c="dimmed">{t('editor.elementCount', { count: elements.length })}</Text>
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
            onChange={handleAspectRatioChange}
            data={ASPECT_RATIO_OPTIONS}
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
