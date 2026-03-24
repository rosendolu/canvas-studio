import { useLocalStorage } from '@mantine/hooks'

const ASPECT_RATIO_OPTIONS = [
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
  { label: '1:1',  value: '1:1'  },
  { label: '4:3',  value: '4:3'  },
  { label: '3:4',  value: '3:4'  },
]

export function useCanvasConfig() {
  const [aspectRatio, setAspectRatio] = useLocalStorage<string>({
    key: 'canvas-studio:aspectRatio',
    defaultValue: '9:16',
  })

  return { aspectRatio, setAspectRatio, ASPECT_RATIO_OPTIONS }
}
