import { useCallback } from 'react'

/**
 * Export the Konva stage as a PNG and trigger browser download.
 * Accepts the stageRef from CanvasPlayer context.
 */
export function useCanvasExport(stageRef: React.RefObject<any>) {
  const exportPng = useCallback(
    (filename = 'canvas-export.png') => {
      const stage = stageRef.current
      if (!stage) return
      const dataUrl = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = filename
      a.click()
    },
    [stageRef],
  )

  return { exportPng }
}
