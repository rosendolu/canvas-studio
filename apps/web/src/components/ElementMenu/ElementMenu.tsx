import { useState } from 'react'
import { Stack, Tabs, Text, Box, Button, ColorInput, Divider, TextInput, NumberInput, Group, ActionIcon, Tooltip } from '@mantine/core'
import { nanoid } from 'nanoid'
import type { CanvasElement } from '@canvas-studio/canvas-core'

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

/**
 * 素材面板
 * - 背景设置（纯色 / 图片 URL）
 * - 贴图（输入 URL）
 * - 气泡文字
 * - 数字人（Avatar）
 * - 滚动轮播 / 幻灯片（直接演示）
 */
export function ElementMenu({ onAddElement, bgColor, onBgColorChange }: ElementMenuProps) {
  const [imgUrl, setImgUrl] = useState('')
  const [stickerUrl, setStickerUrl] = useState('')
  const [bubbleText, setBubbleText] = useState('Hello 👋')
  const [bubbleSrc, setBubbleSrc] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  function addBackground() {
    if (!imgUrl.trim()) return
    onAddElement(makeEl({
      type: 'background',
      src: imgUrl.trim(),
      originalWidth: 1920, originalHeight: 1080,
      width: 0, height: 0,
    }))
    setImgUrl('')
  }

  function addSticker() {
    if (!stickerUrl.trim()) return
    onAddElement(makeEl({
      type: 'sticker',
      src: stickerUrl.trim(),
      originalWidth: 200, originalHeight: 200,
      width: 0, height: 0,
    }))
    setStickerUrl('')
  }

  function addBubbleText() {
    onAddElement(makeEl({
      type: 'bubbleText',
      src: bubbleSrc.trim(),
      text: bubbleText || '双击编辑',
      fontSize: 16,
      color: '#ffffff',
      fontFamily: 'sans-serif',
      originalWidth: 160, originalHeight: 60,
      width: 0, height: 0,
    }))
  }

  function addAvatar() {
    if (!avatarUrl.trim()) return
    onAddElement(makeEl({
      type: 'avatar',
      src: avatarUrl.trim(),
      originalWidth: 400, originalHeight: 700,
      width: 0, height: 0,
      mask: {
        type: '',
        left: 0, top: 0,
        width: 100, height: 100,
        scaleX: 1, scaleY: 1,
        background: '#000',
        offsetX: 0, offsetY: 0,
      },
    }))
    setAvatarUrl('')
  }

  function addCarousel() {
    const demoSrc = 'https://picsum.photos/400/300'
    onAddElement(makeEl({
      type: 'picture-scrolling',
      src: demoSrc,
      originalWidth: 400, originalHeight: 300,
      width: 0, height: 0,
    } as any))
  }

  function addSlideshow() {
    onAddElement(makeEl({
      type: 'slideshow',
      src: '',
      imageList: [
        { src: 'https://picsum.photos/seed/a/400/300', originalWidth: 400, originalHeight: 300 },
        { src: 'https://picsum.photos/seed/b/400/300', originalWidth: 400, originalHeight: 300 },
        { src: 'https://picsum.photos/seed/c/400/300', originalWidth: 400, originalHeight: 300 },
      ],
      config: { time: 4000, transitionDuration: 600 },
      originalWidth: 400, originalHeight: 300,
      width: 0, height: 0,
    } as any))
  }

  return (
    <Stack gap={0} style={{ height: '100%' }}>
      <Box px="md" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-dark-5)' }}>
        <Text size="sm" fw={600}>素材面板</Text>
      </Box>

      <Tabs defaultValue="background" style={{ flex: 1 }}>
        <Tabs.List grow>
          <Tabs.Tab value="background" fz={11}>背景</Tabs.Tab>
          <Tabs.Tab value="elements" fz={11}>元素</Tabs.Tab>
          <Tabs.Tab value="text" fz={11}>文字</Tabs.Tab>
        </Tabs.List>

        {/* ── 背景 Tab ── */}
        <Tabs.Panel value="background" p="md">
          <Stack gap="sm">
            <Text size="xs" c="dimmed">纯色背景</Text>
            <ColorInput size="xs" label="背景色" value={bgColor} onChange={onBgColorChange} format="hex" />

            <Divider label="图片/视频背景" labelPosition="center" />
            <TextInput size="xs" label="图片 URL" placeholder="https://..." value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
            <Button size="xs" onClick={addBackground} disabled={!imgUrl.trim()}>添加背景图</Button>

            <Button size="xs" variant="outline" onClick={() => {
              onAddElement(makeEl({
                type: 'background',
                src: `https://picsum.photos/seed/${Date.now()}/1920/1080`,
                originalWidth: 1920, originalHeight: 1080,
                width: 0, height: 0,
              }))
            }}>
              + 随机演示背景
            </Button>
          </Stack>
        </Tabs.Panel>

        {/* ── 元素 Tab ── */}
        <Tabs.Panel value="elements" p="md">
          <Stack gap="sm">
            <Text size="xs" c="dimmed" fw={500}>贴图 / 素材</Text>
            <TextInput size="xs" label="图片 URL" placeholder="https://..." value={stickerUrl} onChange={e => setStickerUrl(e.target.value)} />
            <Button size="xs" onClick={addSticker} disabled={!stickerUrl.trim()}>添加贴图</Button>
            <Button size="xs" variant="outline" onClick={() => {
              setStickerUrl(`https://picsum.photos/seed/${Date.now()}/200/200`)
            }}>填入演示图</Button>

            <Divider label="数字人 Avatar" labelPosition="center" />
            <TextInput size="xs" label="数字人图片 URL" placeholder="https://..." value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} />
            <Button size="xs" onClick={addAvatar} disabled={!avatarUrl.trim()}>添加数字人</Button>
            <Button size="xs" variant="outline" onClick={() => setAvatarUrl('https://picsum.photos/300/500')}>填入演示</Button>

            <Divider label="动态元素" labelPosition="center" />
            <Button size="xs" variant="light" onClick={addCarousel}>+ 滚动轮播 (Carousel)</Button>
            <Button size="xs" variant="light" onClick={addSlideshow}>+ 幻灯片切换 (Slideshow)</Button>
          </Stack>
        </Tabs.Panel>

        {/* ── 文字 Tab ── */}
        <Tabs.Panel value="text" p="md">
          <Stack gap="sm">
            <Text size="xs" c="dimmed">气泡文字</Text>
            <TextInput size="xs" label="文字内容" value={bubbleText} onChange={e => setBubbleText(e.target.value)} />
            <TextInput size="xs" label="气泡背景图 URL（可选）" placeholder="https://..." value={bubbleSrc} onChange={e => setBubbleSrc(e.target.value)} />
            <Button size="xs" onClick={addBubbleText}>添加气泡文字</Button>
            <Text size="xs" c="dimmed" mt="xs">💡 双击气泡文字可直接编辑内容</Text>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
