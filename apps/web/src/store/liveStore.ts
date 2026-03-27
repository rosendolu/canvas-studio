import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import type { CanvasElement, PageState } from '@canvas-studio/canvas-core'

// ================================================================
// Live Room Store (like nnk-24h-live)
// ================================================================

export interface LiveState {
  drawWidth: number
  drawHeight: number
  aspectRatio: string
  pages: PageState[]
  // Undo/redo history — stores snapshots of pages[0].elements
  _history: CanvasElement[][]
  _historyIndex: number
}

export interface LiveActions {
  dispatch: (action: LiveAction) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export type LiveAction =
  | { type: 'setCanvasSize'; payload: { drawWidth: number; drawHeight: number } }
  | { type: 'setAspectRatio'; payload: string }
  | { type: 'addElement'; payload: CanvasElement }
  | { type: 'removeElement'; payload: string }
  | { type: 'updateElementsPos'; payload: { elements: CanvasElement[]; drawWidth?: number; drawHeight?: number } }
  | { type: 'updateElementAttr'; payload: { uid: string; updates: Partial<CanvasElement> } }
  | { type: 'activeElement'; payload: string }
  | { type: 'setBgColor'; payload: string }
  | { type: 'updateElements'; payload: CanvasElement[] }

const MAX_HISTORY = 30

function createDefaultPage(): PageState {
  return {
    uid: nanoid(),
    bgColor: 'transparent',
    elements: [],
    activeElementsUid: '',
  }
}

const initialState: LiveState = {
  drawWidth: 0,
  drawHeight: 0,
  aspectRatio: '9:16',
  pages: [createDefaultPage()],
  _history: [[]],
  _historyIndex: 0,
}

/** Actions that mutate elements and should push to history */
const HISTORY_ACTIONS = new Set([
  'addElement', 'removeElement', 'updateElementsPos',
  'updateElementAttr', 'updateElements',
])

function pushHistory(state: LiveState, snapshot: CanvasElement[]) {
  // Drop any redo states above current index
  state._history = state._history.slice(0, state._historyIndex + 1)
  state._history.push(JSON.parse(JSON.stringify(snapshot)))
  if (state._history.length > MAX_HISTORY) {
    state._history.shift()
  } else {
    state._historyIndex = state._history.length - 1
  }
}

export const useLiveStore = create<LiveState & LiveActions>()(
  immer((set, get) => ({
    ...initialState,

    canUndo: () => get()._historyIndex > 0,
    canRedo: () => get()._historyIndex < get()._history.length - 1,

    undo() {
      set((state) => {
        if (state._historyIndex <= 0) return
        state._historyIndex--
        state.pages[0].elements = JSON.parse(JSON.stringify(state._history[state._historyIndex]))
        state.pages[0].activeElementsUid = ''
      })
    },

    redo() {
      set((state) => {
        if (state._historyIndex >= state._history.length - 1) return
        state._historyIndex++
        state.pages[0].elements = JSON.parse(JSON.stringify(state._history[state._historyIndex]))
        state.pages[0].activeElementsUid = ''
      })
    },

    dispatch(action: LiveAction) {
      set((state) => {
        const page = state.pages[0]

        switch (action.type) {
          case 'setCanvasSize':
            state.drawWidth = action.payload.drawWidth
            state.drawHeight = action.payload.drawHeight
            break

          case 'setAspectRatio':
            state.aspectRatio = action.payload
            break

          case 'addElement': {
            const newUid = nanoid()
            page.elements.push({ ...action.payload, uid: newUid })
            page.activeElementsUid = newUid
            pushHistory(state, page.elements)
            break
          }

          case 'removeElement': {
            const removedUid = action.payload as string
            const idx = page.elements.findIndex(el => el.uid === removedUid)
            const next = page.elements[idx + 1] || page.elements[idx - 1] || null
            page.activeElementsUid = next ? next.uid : ''
            page.elements = page.elements.filter(el => el.uid !== removedUid)
            pushHistory(state, page.elements)
            break
          }

          case 'updateElementsPos': {
            const { elements, drawWidth, drawHeight } = action.payload
            page.elements = elements
            if (drawWidth) state.drawWidth = drawWidth
            if (drawHeight) state.drawHeight = drawHeight
            pushHistory(state, page.elements)
            break
          }

          case 'updateElementAttr': {
            const { uid, updates } = action.payload
            const el = page.elements.find(e => e.uid === uid)
            if (el) Object.assign(el, updates)
            pushHistory(state, page.elements)
            break
          }

          case 'activeElement':
            page.activeElementsUid = action.payload
            break

          case 'setBgColor':
            page.bgColor = action.payload
            break

          case 'updateElements':
            page.elements = action.payload
            pushHistory(state, page.elements)
            break
        }
      })
    },
  }))
)

// Re-export HISTORY_ACTIONS for testing
export { HISTORY_ACTIONS }
