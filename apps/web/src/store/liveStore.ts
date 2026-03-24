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
}

export interface LiveActions {
  dispatch: (action: LiveAction) => void
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
}

export const useLiveStore = create<LiveState & LiveActions>()(
  immer((set) => ({
    ...initialState,

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

          case 'addElement':
            page.elements.push({ ...action.payload, uid: nanoid() })
            break

          case 'removeElement':
            page.elements = page.elements.filter(el => el.uid !== action.payload)
            break

          case 'updateElementsPos': {
            const { elements, drawWidth, drawHeight } = action.payload
            page.elements = elements
            if (drawWidth) state.drawWidth = drawWidth
            if (drawHeight) state.drawHeight = drawHeight
            break
          }

          case 'updateElementAttr': {
            const { uid, updates } = action.payload
            const el = page.elements.find(e => e.uid === uid)
            if (el) Object.assign(el, updates)
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
            break
        }
      })
    },
  }))
)
