import { useState } from 'react'
import { Stack, Tabs, Text, Box, Button, ColorInput, Divider, TextInput, ScrollArea, Image, SimpleGrid, Tooltip } from '@mantine/core'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_BACKGROUNDS,
  DEFAULT_STICKERS,
  DEFAULT_MASKS,
  DEFAULT_CAROUSEL_SETS,
  DEFAULT_BUBBLE_TEXTS,
} from '../../data/defaultAssets'

interface ElementMenuProps {
  onAddElement: (el: Omit<CanvasElement, 'uid'>) => void
  bgColor: string
  onBgColorChange: (color: string) => void
}

function makeEl(overrides: Partial<CanvasElement>): Omit<CanvasElement, 'uid'> {
  return {
    type: 'sticker',
    src: '',
    left: 0, top: 0,
    width: 0, height: 0,
    originalWidth: 0, originalHeight: 0,
    scaleX: 1, scaleY: 1,
    rotation: 0,
    offsetX: 0, offsetY: 0,
    visible: true,
    ...overrides,
  }
}

export function ElementMenu({ onAddElement, bgColor, onBgColorChange }: ElementMenuProps) {
  const { t } = useTranslation()
  const [imgUrl, setImgUrl] = useState('')
  const [stickerUrl, setStickerUrl] = useState('')
  const [maskUrl, setMaskUrl] = useState('')
  const [bubbleText, setBubbleText] = useState('Hello 👋')
  const [bubbleSrc, setBubbleSrc] = useState('')

  function addBackground(src?: string, w = 1920, h = 1080) {
    const url = src || imgUrl.trim()
    if (!url) return
    onAddElement(makeEl({ type: 'background', src: url, originalWidth: w, originalHeight: h, width: 0, height: 0 }))
    if (!src) setImgUrl('')
  }

  function addSticker(src?: string, w = 300, h = 300) {
    const url = src || stickerUrl.trim()
    if (!url) return
    onAddElement(makeEl({ type: 'sticker', src: url, originalWidth: w, originalHeight: h, width: 0, height: 0 }))
    if (!src) setStickerUrl('')
  }

  function addMask(src?: string, w = 400, h = 400) {
    const url = src || maskUrl.trim()
    if (!url) return
    onAddElement(makeEl({
      type: 'avatar',
      src: url,
      originalWidth: w, originalHeight: h,
      width: 0, height: 0,
      mask: {
        type: 'circle',
        left: 0, top: 0,
        width: Math.min(w, h), height: Math.min(w, h),
        scaleX: 1, scaleY: 1,
        background: 'transparent',
        offsetX: 0, offsetY: 0,
      },
    }))
    if (!src) setMaskUrl('')
  }

  function addBubbleText(preset?: { text: string; color: string; fontSize: number }) {
    onAddElement(makeEl({
      type: 'bubbleText',
      src: bubbleSrc.trim(),
      text: preset?.text || bubbleText || 'Hello 👋',
      fontSize: preset?.fontSize || 16,
      color: preset?.color || '#ffffff',
      fontFamily: 'sans-serif',
      originalWidth: 160, originalHeight: 60,
      width: 0, height: 0,
    }))
  }

  function addCarousel(images: { src: string; originalWidth: number; originalHeight: number }[]) {
    onAddElement(makeEl({
      type: 'slideshow',
      src: '',
      imageList: images,
      config: { time: 3500, transitionDuration: 600 },
      originalWidth: images[0].originalWidth, originalHeight: images[0].originalHeight,
      width: 0, height: 0,
    } as any))
  }

  return (
    <Stack gap={0} style={{ height: '100%' }}>
      <Box px="md" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
        <Text size="sm" fw={600}>{t('elements.panelTitle')}</Text>
      </Box>

      <Tabs defaultValue="background" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Tabs.List grow>
          <Tabs.Tab value="background" fz={10}>{t('elements.tabBackground')}</Tabs.Tab>
          <Tabs.Tab value="elements" fz={10}>{t('elements.tabElements')}</Tabs.Tab>
          <Tabs.Tab value="mask" fz={10}>{t('elements.tabMask')}</Tabs.Tab>
          <Tabs.Tab value="text" fz={10}>{t('elements.tabText')}</Tabs.Tab>
        </Tabs.List>

        {/* ── Background Tab ── */}
        <Tabs.Panel value="background" style={{ flex: 1, overflowY: 'auto' }} p="sm">
          <Stack gap="sm">
            <ColorInput size="xs" label={t('elements.bgColor')} value={bgColor} onChange={onBgColorChange} format="hex" />
            <Divider label={t('elements.defaultAssets')} labelPosition="center" />
            <SimpleGrid cols={2} spacing="xs">
              {DEFAULT_BACKGROUNDS.map(bg => (
                <Tooltip key={bg.label} label={bg.label} position="top">
                  <Box
                    style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', border: '2px solid transparent', transition: 'border-color .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--mantine-color-violet-5)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                    onClick={() => addBackground(bg.src, bg.originalWidth, bg.originalHeight)}
                  >
                    <Image src={bg.src} h={52} fit="cover" />
                  </Box>
                </Tooltip>
              ))}
            </SimpleGrid>
            <Divider label={t('elements.imgVideoBg')} labelPosition="center" />
            <TextInput size="xs" label={t('elements.imageUrl')} placeholder="https://..." value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
            <Button size="xs" onClick={() => addBackground()} disabled={!imgUrl.trim()}>{t('elements.addBgImage')}</Button>
          </Stack>
        </Tabs.Panel>

        {/* ── Elements Tab ── */}
        <Tabs.Panel value="elements" style={{ flex: 1, overflowY: 'auto' }} p="sm">
          <Stack gap="sm">
            <Text size="xs" c="dimmed" fw={500}>{t('elements.stickers')}</Text>
            <SimpleGrid cols={2} spacing="xs">
              {DEFAULT_STICKERS.map(s => (
                <Tooltip key={s.label} label={s.label} position="top">
                  <Box
                    style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', border: '2px solid transparent', transition: 'border-color .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--mantine-color-cyan-5)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                    onClick={() => addSticker(s.src, s.originalWidth, s.originalHeight)}
                  >
                    <Image src={s.src} h={52} fit="cover" />
                  </Box>
                </Tooltip>
              ))}
            </SimpleGrid>
            <TextInput size="xs" label={t('elements.imageUrl')} placeholder="https://..." value={stickerUrl} onChange={e => setStickerUrl(e.target.value)} />
            <Button size="xs" onClick={() => addSticker()} disabled={!stickerUrl.trim()}>{t('elements.addSticker')}</Button>

            <Divider label="幻灯片 / Slideshow" labelPosition="center" />
            {DEFAULT_CAROUSEL_SETS.map(set => (
              <Button key={set.label} size="xs" variant="light" onClick={() => addCarousel(set.images)}>
                🎴 {set.label}
              </Button>
            ))}
          </Stack>
        </Tabs.Panel>

        {/* ── Mask Tab ── */}
        <Tabs.Panel value="mask" style={{ flex: 1, overflowY: 'auto' }} p="sm">
          <Stack gap="sm">
            <Text size="xs" c="dimmed">{t('elements.mask')}</Text>
            <Text size="xs" c="dimmed" style={{ lineHeight: 1.4 }}>
              💡 圆形蒙版裁切，适合人像/头像融图合成
            </Text>
            <SimpleGrid cols={2} spacing="xs">
              {DEFAULT_MASKS.map(m => (
                <Tooltip key={m.label} label={m.label} position="top">
                  <Box
                    style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', border: '2px solid transparent', transition: 'border-color .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--mantine-color-teal-5)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                    onClick={() => addMask(m.src, m.originalWidth, m.originalHeight)}
                  >
                    <Image src={m.src} h={60} fit="cover" />
                    <Text size={10} ta="center" py={2} c="dimmed">{m.label}</Text>
                  </Box>
                </Tooltip>
              ))}
            </SimpleGrid>
            <Divider labelPosition="center" />
            <TextInput size="xs" label={t('elements.maskUrl')} placeholder="https://..." value={maskUrl} onChange={e => setMaskUrl(e.target.value)} />
            <Button size="xs" onClick={() => addMask()} disabled={!maskUrl.trim()}>{t('elements.addMask')}</Button>
          </Stack>
        </Tabs.Panel>

        {/* ── Text Tab ── */}
        <Tabs.Panel value="text" style={{ flex: 1, overflowY: 'auto' }} p="sm">
          <Stack gap="sm">
            <Text size="xs" c="dimmed">{t('elements.bubbleText')}</Text>
            <SimpleGrid cols={2} spacing="xs">
              {DEFAULT_BUBBLE_TEXTS.map((b, i) => (
                <Button
                  key={i}
                  size="xs"
                  variant="light"
                  style={{ color: b.color !== '#ffffff' ? b.color : undefined }}
                  onClick={() => addBubbleText(b)}
                >
                  {b.text}
                </Button>
              ))}
            </SimpleGrid>
            <Divider labelPosition="center" />
            <TextInput size="xs" label={t('elements.bubbleContent')} value={bubbleText} onChange={e => setBubbleText(e.target.value)} />
            <TextInput size="xs" label={t('elements.bubbleBgUrl')} placeholder="https://..." value={bubbleSrc} onChange={e => setBubbleSrc(e.target.value)} />
            <Button size="xs" onClick={() => addBubbleText()}>{t('elements.addBubble')}</Button>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
