import { useCallback } from 'react'
import { Box, Group, ActionIcon, Tooltip, SegmentedControl } from '@mantine/core'
import { IconZoomIn, IconZoomOut, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react'
import CanvasPlayer from '../../components/CanvasPlayer/CanvasPlayer'
import TimelineRuler from '../../components/Timeline/TimelineRuler'
import { useEditorStore } from '../../store/editorStore'
import type { CanvasElement } from '@canvas-studio/canvas-core'

/**
 * 视频编辑器页面
 * 上方: Canvas 预览区
 * 下方: 时间轴 + 轨道
 */
export function EditorPage() {
  const {
    track, drawWidth, drawHeight, aspectRatio,
    currentFrame, fps, trackScale, chooseDataUid, color,
    dispatch,
  } = useEditorStore()

  // Flatten all elements from track for canvas rendering
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

  const timelineUserConfig = {
    start: 0,
    step: fps,
    scale: trackScale,
  }

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Canvas Area */}
      <Box style={{ flex: 1, minHeight: 0, background: '#1a1a1a', position: 'relative' }}>
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

      {/* Timeline */}
      <Box style={{ height: 180, borderTop: '1px solid #333', background: '#1e1e1e' }}>
        {/* Controls */}
        <Group p="xs" gap="xs" style={{ borderBottom: '1px solid #333' }}>
          <ActionIcon variant="subtle" size="sm" onClick={() => dispatch({ type: 'setCurrentFrame', payload: currentFrame > 0 ? currentFrame - 1 : 0 })}>
            <IconPlayerStop size={14} />
          </ActionIcon>
          <ActionIcon variant="subtle" size="sm">
            <IconPlayerPlay size={14} />
          </ActionIcon>
          <Box style={{ flex: 1 }} />
          <Tooltip label="缩小时间轴">
            <ActionIcon variant="subtle" size="sm" onClick={() => dispatch({ type: 'setTrackScale', payload: Math.max(0, trackScale - 10) })}>
              <IconZoomOut size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="放大时间轴">
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

        {/* Ruler */}
        <TimelineRuler
          userConfig={timelineUserConfig}
          track={track}
          trackScale={trackScale}
          fps={fps}
          onFrameChange={f => dispatch({ type: 'setCurrentFrame', payload: f })}
        />

        {/* Track list placeholder */}
        <Box p="xs" style={{ color: '#666', fontSize: 12 }}>
          {track.length === 0
            ? '暂无轨道，请在左侧面板添加元素'
            : track.map(t => (
                <Box key={t.uid} style={{ height: 28, lineHeight: '28px', borderBottom: '1px solid #2a2a2a' }}>
                  {t.type} ({t.lineList.length} 个元素)
                </Box>
              ))
          }
        </Box>
      </Box>
    </Box>
  )
}
