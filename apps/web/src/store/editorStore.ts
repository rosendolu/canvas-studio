import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import type { CanvasElement, PageState, TrackLine } from '@canvas-studio/canvas-core'

// ================================================================
// Editor Store (video timeline mode)
// ================================================================

export interface EditorState {
  drawWidth: number
  drawHeight: number
  aspectRatio: string
  currentFrame: number
  fps: number
  trackScale: number
  track: TrackLine[]
  chooseDataUid: string
  color: string
  maxTrackWidth: number
  // Undo/redo history — snapshots of track
  _history: TrackLine[][]
  _historyIndex: number
}

export interface EditorActions {
  dispatch: (action: EditorAction) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export type EditorAction =
  | { type: 'setCanvasSize'; payload: { drawWidth: number; drawHeight: number } }
  | { type: 'setAspectRatio'; payload: string }
  | { type: 'setCurrentFrame'; payload: number }
  | { type: 'setTrackScale'; payload: number }
  | { type: 'addTrackElement'; payload: { element: CanvasElement } }
  | { type: 'removeTrackElement'; payload: { uid: string } }
  | { type: 'updateElementPos'; payload: { uid: string; updates: Partial<CanvasElement> } }
  | { type: 'setActiveUid'; payload: string }
  | { type: 'setBgColor'; payload: string }
  | { type: 'updateTrack'; payload: TrackLine[] }
  | { type: 'clearTrack' }

const MAX_HISTORY = 30

const initialState: EditorState = {
  drawWidth: 0,
  drawHeight: 0,
  aspectRatio: '16:9',
  currentFrame: 0,
  fps: 25,
  trackScale: 80,
  track: [],
  chooseDataUid: '',
  color: 'transparent',
  maxTrackWidth: 1000,
  _history: [[]],
  _historyIndex: 0,
}

function pushHistory(state: EditorState, snapshot: TrackLine[]) {
  state._history = state._history.slice(0, state._historyIndex + 1)
  state._history.push(JSON.parse(JSON.stringify(snapshot)))
  if (state._history.length > MAX_HISTORY) {
    state._history.shift()
  } else {
    state._historyIndex = state._history.length - 1
  }
}

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set, get) => ({
    ...initialState,

    canUndo: () => get()._historyIndex > 0,
    canRedo: () => get()._historyIndex < get()._history.length - 1,

    undo() {
      set((state) => {
        if (state._historyIndex <= 0) return
        state._historyIndex--
        state.track = JSON.parse(JSON.stringify(state._history[state._historyIndex]))
        state.chooseDataUid = ''
      })
    },

    redo() {
      set((state) => {
        if (state._historyIndex >= state._history.length - 1) return
        state._historyIndex++
        state.track = JSON.parse(JSON.stringify(state._history[state._historyIndex]))
        state.chooseDataUid = ''
      })
    },

    dispatch(action: EditorAction) {
      set((state) => {
        switch (action.type) {
          case 'setCanvasSize':
            state.drawWidth = action.payload.drawWidth
            state.drawHeight = action.payload.drawHeight
            break

          case 'setAspectRatio':
            state.aspectRatio = action.payload
            break

          case 'setCurrentFrame':
            state.currentFrame = action.payload
            break

          case 'setTrackScale':
            state.trackScale = action.payload
            break

          case 'addTrackElement': {
            const { element } = action.payload
            const uid = nanoid()
            const el = { ...element, uid }
            let trackLine = state.track.find(t => t.type === el.type)
            if (!trackLine) {
              state.track.push({ uid: nanoid(), type: el.type, muted: false, volume: 1, lineList: [] })
              trackLine = state.track[state.track.length - 1]
            }
            trackLine.lineList.push(el)
            state.chooseDataUid = uid
            pushHistory(state, state.track)
            break
          }

          case 'removeTrackElement': {
            const removedUid = action.payload.uid
            const allEls = state.track.flatMap(l => l.lineList)
            const removedIdx = allEls.findIndex(el => el.uid === removedUid)
            const nextEl = allEls[removedIdx + 1] || allEls[removedIdx - 1] || null
            state.chooseDataUid = nextEl ? nextEl.uid : ''
            for (const line of state.track) {
              const idx = line.lineList.findIndex(el => el.uid === removedUid)
              if (idx !== -1) { line.lineList.splice(idx, 1); break }
            }
            pushHistory(state, state.track)
            break
          }

          case 'updateElementPos': {
            const { uid, updates } = action.payload
            for (const line of state.track) {
              const el = line.lineList.find(e => e.uid === uid)
              if (el) { Object.assign(el, updates); break }
            }
            pushHistory(state, state.track)
            break
          }

          case 'setActiveUid':
            state.chooseDataUid = action.payload
            break

          case 'setBgColor':
            state.color = action.payload
            break

          case 'updateTrack':
            state.track = action.payload
            pushHistory(state, state.track)
            break

          case 'clearTrack':
            state.track = []
            state.chooseDataUid = ''
            pushHistory(state, state.track)
            break
        }
      })
    },
  }))
)
