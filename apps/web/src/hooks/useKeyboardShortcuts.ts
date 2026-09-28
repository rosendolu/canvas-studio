import { useCallback, useEffect, useRef } from 'react'
import type { CanvasElement } from '@canvas-studio/canvas-core'

export interface ShortcutCallbacks {
  onDelete: () => void
  onDuplicate: () => void
  onCopy: () => void
  onPaste: () => void
  onNudge: (dx: number, dy: number) => void
  onUndo?: () => void
  onRedo?: () => void
  onPlayPause?: () => void
  onSelectAll?: () => void
}

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
}

export const SHORTCUTS: Record<string, KeyboardShortcut> = {
  delete: { key: 'Delete', description: 'Delete selected element' },
  backspace: { key: 'Backspace', description: 'Delete selected element' },
  duplicate: { key: 'd', ctrl: true, description: 'Duplicate selected element' },
  copy: { key: 'c', ctrl: true, description: 'Copy selected element' },
  paste: { key: 'v', ctrl: true, description: 'Paste element' },
  undo: { key: 'z', ctrl: true, description: 'Undo' },
  redo: { key: 'y', ctrl: true, description: 'Redo' },
  redoShift: { key: 'z', ctrl: true, shift: true, description: 'Redo' },
  nudgeUp: { key: 'ArrowUp', description: 'Nudge up 1px' },
  nudgeDown: { key: 'ArrowDown', description: 'Nudge down 1px' },
  nudgeLeft: { key: 'ArrowLeft', description: 'Nudge left 1px' },
  nudgeRight: { key: 'ArrowRight', description: 'Nudge right 1px' },
  nudgeUpFast: { key: 'ArrowUp', shift: true, description: 'Nudge up 10px' },
  nudgeDownFast: { key: 'ArrowDown', shift: true, description: 'Nudge down 10px' },
  nudgeLeftFast: { key: 'ArrowLeft', shift: true, description: 'Nudge left 10px' },
  nudgeRightFast: { key: 'ArrowRight', shift: true, description: 'Nudge right 10px' },
  playPause: { key: ' ', description: 'Play/Pause' },
  selectAll: { key: 'a', ctrl: true, description: 'Select all elements' },
}

/**
 * Check if the target element is an input field where shortcuts should be disabled
 */
function isInputTarget(target: EventTarget | null): boolean {
  if (!target) return false
  const el = target as HTMLElement
  const tag = el.tagName?.toLowerCase()
  return tag === 'input' || tag === 'textarea' || el.isContentEditable
}

/**
 * Match keyboard event against shortcut config
 */
function matchesShortcut(
  e: KeyboardEvent,
  shortcut: KeyboardShortcut
): boolean {
  if (e.key !== shortcut.key) return false
  if (shortcut.ctrl && !(e.ctrlKey || e.metaKey)) return false
  if (shortcut.shift && !e.shiftKey) return false
  if (shortcut.alt && !e.altKey) return false
  if (shortcut.meta && !e.metaKey) return false
  return true
}

/**
 * Hook for keyboard shortcuts in canvas editor
 */
export function useKeyboardShortcuts(
  activeElement: CanvasElement | undefined,
  callbacks: ShortcutCallbacks,
  options?: {
    enabled?: boolean
    enablePlayPause?: boolean
  }
): { shortcuts: typeof SHORTCUTS } {
  const { enabled = true, enablePlayPause = false } = options ?? {}

  // Use refs to avoid re-creating handlers on every render
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const activeElementRef = useRef(activeElement)
  activeElementRef.current = activeElement

  // Throttle nudge operations
  const nudgeThrottleRef = useRef<number | null>(null)
  const lastNudgeTimeRef = useRef<number>(0)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return

      // Skip if target is an input field
      if (isInputTarget(e.target)) return

      // Delete / Backspace
      if (matchesShortcut(e, SHORTCUTS.delete) || matchesShortcut(e, SHORTCUTS.backspace)) {
        if (activeElementRef.current) {
          e.preventDefault()
          callbacksRef.current.onDelete()
        }
        return
      }

      // Duplicate (Ctrl+D)
      if (matchesShortcut(e, SHORTCUTS.duplicate)) {
        if (activeElementRef.current) {
          e.preventDefault()
          callbacksRef.current.onDuplicate()
        }
        return
      }

      // Copy (Ctrl+C)
      if (matchesShortcut(e, SHORTCUTS.copy)) {
        if (activeElementRef.current) {
          e.preventDefault()
          callbacksRef.current.onCopy()
        }
        return
      }

      // Paste (Ctrl+V)
      if (matchesShortcut(e, SHORTCUTS.paste)) {
        e.preventDefault()
        callbacksRef.current.onPaste()
        return
      }

      // Undo (Ctrl+Z)
      if (matchesShortcut(e, SHORTCUTS.undo)) {
        e.preventDefault()
        callbacksRef.current.onUndo?.()
        return
      }

      // Redo (Ctrl+Y or Ctrl+Shift+Z)
      if (matchesShortcut(e, SHORTCUTS.redo) || matchesShortcut(e, SHORTCUTS.redoShift)) {
        e.preventDefault()
        callbacksRef.current.onRedo?.()
        return
      }

      // Select All (Ctrl+A)
      if (matchesShortcut(e, SHORTCUTS.selectAll)) {
        e.preventDefault()
        callbacksRef.current.onSelectAll?.()
        return
      }

      // Play/Pause (Space)
      if (enablePlayPause && matchesShortcut(e, SHORTCUTS.playPause)) {
        e.preventDefault()
        callbacksRef.current.onPlayPause?.()
        return
      }

      // Nudge with arrow keys
      const nudgeShortcuts = [
        { shortcut: SHORTCUTS.nudgeUp, dx: 0, dy: -1 },
        { shortcut: SHORTCUTS.nudgeDown, dx: 0, dy: 1 },
        { shortcut: SHORTCUTS.nudgeLeft, dx: -1, dy: 0 },
        { shortcut: SHORTCUTS.nudgeRight, dx: 1, dy: 0 },
        { shortcut: SHORTCUTS.nudgeUpFast, dx: 0, dy: -10 },
        { shortcut: SHORTCUTS.nudgeDownFast, dx: 0, dy: 10 },
        { shortcut: SHORTCUTS.nudgeLeftFast, dx: -10, dy: 0 },
        { shortcut: SHORTCUTS.nudgeRightFast, dx: 10, dy: 0 },
      ]

      for (const { shortcut, dx, dy } of nudgeShortcuts) {
        if (matchesShortcut(e, shortcut)) {
          if (activeElementRef.current) {
            e.preventDefault()

            // Throttle nudge to prevent excessive history entries
            const now = Date.now()
            const throttleMs = 50

            if (now - lastNudgeTimeRef.current < throttleMs) {
              // Clear pending nudge and schedule new one
              if (nudgeThrottleRef.current) {
                window.clearTimeout(nudgeThrottleRef.current)
              }
              nudgeThrottleRef.current = window.setTimeout(() => {
                callbacksRef.current.onNudge(dx, dy)
                lastNudgeTimeRef.current = Date.now()
              }, throttleMs)
            } else {
              callbacksRef.current.onNudge(dx, dy)
              lastNudgeTimeRef.current = now
            }
          }
          return
        }
      }
    },
    [enabled, enablePlayPause]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (nudgeThrottleRef.current) {
        window.clearTimeout(nudgeThrottleRef.current)
      }
    }
  }, [handleKeyDown])

  return { shortcuts: SHORTCUTS }
}

export default useKeyboardShortcuts
