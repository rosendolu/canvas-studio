import { useState } from 'react'
import { Stack, Tabs, Text, Box, Button, ColorInput, Divider, TextInput, Image, Tooltip } from '@mantine/core'
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

/** Horizontal scrollable strip of asset thumbnails */
function AssetStrip({ items, accentColor, onAdd }: {
  items: { src: string; label: string; originalWidth?: number; originalHeight?: number }[]
  accentColor: string
  onAdd: (item: typeof items[number]) => void
}) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        overflowX: 'auto',
        overflowY: 'hidden',
        paddingBottom: 4,
        scrollbarWidth: 'thin',
        flexWrap: 'nowrap',
      }}
    >
      {items.map(item => (
        <Tooltip key={item.label} label={item.label} position="top" withArrow>
          <Box
            style={{
              flexShrink: 0,
              width: 72,
              height: 52,
              cursor: 'pointer',
              borderRadius: 6,
              overflow: 'hidden',
              border: '2px solid transparent',
              transition: 'border-color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            onClick={() => onAdd(item)}
          >
            <Image src={item.src} w={72} h={52} fit="cover" />
          </Box>
        </Tooltip>
      ))}
    </Box>
  )
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
        <Tabs.List
          style={{
            flexWrap: 'nowrap',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
          }}
        >
          <Tabs.Tab value="background" fz={10} style={{ flexShrink: 0 }}>{t('elements.tabBackground')}</Tabs.Tab>
          <Tabs.Tab value="elements" fz={10} style={{ flexShrink: 0 }}>{t('elements.tabElements')}</Tabs.Tab>
          <Tabs.Tab value="mask" fz={10} style={{ flexShrink: 0 }}>{t('elements.tabMask')}</Tabs.Tab>
          <Tabs.Tab value="text" fz={10} style={{ flexShrink: 0 }}>{t('elements.tabText')}</Tabs.Tab>
        </Tabs.List>

        {/* ── Background Tab ── */}
        <Tabs.Panel value="background" style={{ flex: 1, overflowY: 'auto' }} p="sm">
          <Stack gap="sm">
            <ColorInput size="xs" label={t('elements.bgColor')} value={bgColor} onChange={onBgColorChange} format="hex" />
            <Divider label={t('elements.defaultAssets')} labelPosition="center" />
            <AssetStrip
              items={DEFAULT_BACKGROUNDS}
              accentColor="var(--mantine-color-violet-5)"
              onAdd={bg => addBackground(bg.src, bg.originalWidth, bg.originalHeight)}
            />
            <Divider label={t('elements.imgVideoBg')} labelPosition="center" />
            <TextInput size="xs" label={t('elements.imageUrl')} placeholder="https://..." value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
            <Button size="xs" onClick={() => addBackground()} disabled={!imgUrl.trim()}>{t('elements.addBgImage')}</Button>
          </Stack>
        </Tabs.Panel>

        {/* ── Elements Tab ── */}
        <Tabs.Panel value="elements" style={{ flex: 1, overflowY: 'auto' }} p="sm">
          <Stack gap="sm">
            <Text size="xs" c="dimmed" fw={500}>{t('elements.stickers')}</Text>
            <AssetStrip
              items={DEFAULT_STICKERS}
              accentColor="var(--mantine-color-cyan-5)"
              onAdd={s => addSticker(s.src, s.originalWidth, s.originalHeight)}
            />
            <TextInput size="xs" label={t('elements.imageUrl')} placeholder="https://..." value={stickerUrl} onChange={e => setStickerUrl(e.target.value)} />
            <Button size="xs" onClick={() => addSticker()} disabled={!stickerUrl.trim()}>{t('elements.addSticker')}</Button>

            <Divider label="Slideshow" labelPosition="center" />
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
            <AssetStrip
              items={DEFAULT_MASKS}
              accentColor="var(--mantine-color-teal-5)"
              onAdd={m => addMask(m.src, m.originalWidth, m.originalHeight)}
            />
            <Divider labelPosition="center" />
            <TextInput size="xs" label={t('elements.maskUrl')} placeholder="https://..." value={maskUrl} onChange={e => setMaskUrl(e.target.value)} />
            <Button size="xs" onClick={() => addMask()} disabled={!maskUrl.trim()}>{t('elements.addMask')}</Button>
          </Stack>
        </Tabs.Panel>

        {/* ── Text Tab ── */}
        <Tabs.Panel value="text" style={{ flex: 1, overflowY: 'auto' }} p="sm">
          <Stack gap="sm">
            <Text size="xs" c="dimmed">{t('elements.bubbleText')}</Text>
            {/* Bubble text presets — horizontal scroll */}
            <Box
              style={{
                display: 'flex', gap: 6, overflowX: 'auto', overflowY: 'hidden',
                flexWrap: 'nowrap', paddingBottom: 4, scrollbarWidth: 'thin',
              }}
            >
              {DEFAULT_BUBBLE_TEXTS.map((b, i) => (
                <Button
                  key={i}
                  size="xs"
                  variant="light"
                  style={{ flexShrink: 0, color: b.color !== '#ffffff' ? b.color : undefined }}
                  onClick={() => addBubbleText(b)}
                >
                  {b.text}
                </Button>
              ))}
            </Box>
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
