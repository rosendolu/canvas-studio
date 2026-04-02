import { createContext, useContext } from 'react'
import type Konva from 'konva'

// ================================================================
// CanvasPlayer Contexts
// ================================================================

export interface ElementsContextType {
  syncPosToState: (e: any) => void
  setActiveUid: (type: string, uid: string) => void
  activeUid: string
  stageRef: React.RefObject<any>
  focusUid?: string
  setFocusUid?: (uid: string) => void
}

export interface PlayerContextType {
  spinning: boolean
  setSpinning: (v: boolean) => void
}

export const ElementsContext = createContext<ElementsContextType>({
  syncPosToState: () => {},
  setActiveUid: () => {},
  activeUid: '',
  stageRef: { current: null },
})

export const PlayerContext = createContext<PlayerContextType>({
  spinning: false,
  setSpinning: () => {},
})
