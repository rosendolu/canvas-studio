import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import type { CanvasElement, PageState, TrackLine } from '@canvas-studio/canvas-core'

// ================================================================
// Editor Store (video timeline mode - like image-maker)
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
}

export interface EditorActions {
  dispatch: (action: EditorAction) => void
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

const initialState: EditorState = {
  drawWidth: 0,
  drawHeight: 0,
  aspectRatio: '16:9',
  currentFrame: 0,
  fps: 25,
  trackScale: 80,
  track: [],
  chooseDataUid: '',
  color: '#ffffff',
  maxTrackWidth: 1000,
}

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set) => ({
    ...initialState,

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
            // Find track line by type or create new
            let trackLine = state.track.find(t => t.type === el.type)
            if (!trackLine) {
              state.track.push({ uid: nanoid(), type: el.type, muted: false, volume: 1, lineList: [] })
              trackLine = state.track[state.track.length - 1]
            }
            trackLine.lineList.push(el)
            break
          }

          case 'removeTrackElement':
            for (const line of state.track) {
              const idx = line.lineList.findIndex(el => el.uid === action.payload.uid)
              if (idx !== -1) { line.lineList.splice(idx, 1); break }
            }
            break

          case 'updateElementPos': {
            const { uid, updates } = action.payload
            for (const line of state.track) {
              const el = line.lineList.find(e => e.uid === uid)
              if (el) { Object.assign(el, updates); break }
            }
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
            break
        }
      })
    },
  }))
)
