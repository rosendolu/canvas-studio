import type { CanvasElement } from '@canvas-studio/canvas-core';
import {
    ActionIcon,
    Box,
    Button,
    ColorInput,
    Divider,
    Image,
    Skeleton,
    Stack,
    Tabs,
    Text,
    TextInput,
    Tooltip,
    UnstyledButton,
    useMantineColorScheme,
} from '@mantine/core';
import { IconPlus, IconTrash, IconUpload } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DEFAULT_BACKGROUNDS,
    DEFAULT_BUBBLE_TEXTS,
    DEFAULT_CAROUSEL_SETS,
    DEFAULT_MASKS,
    DEFAULT_STICKERS,
} from '../../data/defaultAssets';
import { useCustomAssets, type AssetType } from '../../hooks/useCustomAssets';

interface ElementMenuProps {
    onAddElement: (el: Omit<CanvasElement, 'uid'>) => void;
    bgColor: string;
    onBgColorChange: (color: string) => void;
}

function makeEl(overrides: Partial<CanvasElement>): Omit<CanvasElement, 'uid'> {
    return {
        type: 'sticker',
        src: '',
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        originalWidth: 0,
        originalHeight: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        visible: true,
        opacity: 1,
        ...overrides,
    };
}

/** Stack grid of asset thumbnails — 2 per row, wraps vertically */
function AssetGrid({
    items,
    accentColor,
    onAdd,
}: {
    items: {
        src: string;
        label: string;
        originalWidth?: number;
        originalHeight?: number;
    }[];
    accentColor: string;
    onAdd: (item: (typeof items)[number]) => void;
}) {
    return (
        <Box
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 6,
            }}>
            {items.map(item => (
                <Tooltip key={item.label} label={item.label} position="top" withArrow>
                    <Box
                        style={{
                            cursor: 'pointer',
                            borderRadius: 6,
                            overflow: 'hidden',
                            border: '2px solid transparent',
                            transition: 'border-color .15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                        onClick={() => onAdd(item)}>
                        <Image
                            src={item.src}
                            h={52}
                            fit="cover"
                            style={{ display: 'block', width: '100%' }}
                        />
                    </Box>
                </Tooltip>
            ))}
        </Box>
    );
}

export function ElementMenu({ onAddElement, bgColor, onBgColorChange }: ElementMenuProps) {
    const { t } = useTranslation();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const [imgUrl, setImgUrl] = useState('');
    const [stickerUrl, setStickerUrl] = useState('');
    const [maskUrl, setMaskUrl] = useState('');
    const [bubbleText, setBubbleText] = useState('Hello 👋');
    const [bubbleSrc, setBubbleSrc] = useState('');

    function addBackground(src?: string, w = 1920, h = 1080) {
        const url = src || imgUrl.trim();
        if (!url) return;
        onAddElement(
            makeEl({
                type: 'background',
                src: url,
                originalWidth: w,
                originalHeight: h,
                width: 0,
                height: 0,
            })
        );
        if (!src) setImgUrl('');
    }

    function addSticker(src?: string, w = 300, h = 300) {
        const url = src || stickerUrl.trim();
        if (!url) return;
        onAddElement(
            makeEl({
                type: 'sticker',
                src: url,
                originalWidth: w,
                originalHeight: h,
                width: 0,
                height: 0,
            })
        );
        if (!src) setStickerUrl('');
    }

    function addMask(src?: string, w = 400, h = 400) {
        const url = src || maskUrl.trim();
        if (!url) return;
        onAddElement(
            makeEl({
                type: 'avatar',
                src: url,
                originalWidth: w,
                originalHeight: h,
                width: 0,
                height: 0,
                mask: {
                    type: 'circle',
                    left: 0,
                    top: 0,
                    width: Math.min(w, h),
                    height: Math.min(w, h),
                    scaleX: 1,
                    scaleY: 1,
                    background: 'transparent',
                    offsetX: 0,
                    offsetY: 0,
                },
            })
        );
        if (!src) setMaskUrl('');
    }

    function addBubbleText(preset?: { text: string; color: string; fontSize: number }) {
        onAddElement(
            makeEl({
                type: 'bubbleText',
                src: bubbleSrc.trim(),
                text: preset?.text || bubbleText || 'Hello 👋',
                fontSize: preset?.fontSize || 16,
                color: resolveColor(preset?.color ?? 'auto', isDark),
                fontFamily: 'sans-serif',
                originalWidth: 160,
                originalHeight: 60,
                width: 0,
                height: 0,
            })
        );
    }

    function addCarousel(images: { src: string; originalWidth: number; originalHeight: number }[]) {
        onAddElement(
            makeEl({
                type: 'slideshow',
                src: '',
                imageList: images,
                config: { time: 3500, transitionDuration: 600 },
                originalWidth: images[0].originalWidth,
                originalHeight: images[0].originalHeight,
                width: 0,
                height: 0,
            } as any)
        );
    }

    return (
        <Stack gap={0} style={{ height: '100%' }}>
            <Box
                px="md"
                py="xs"
                style={{
                    borderBottom: '1px solid var(--mantine-color-default-border)',
                }}>
                <Text size="sm" fw={600}>
                    {t('elements.panelTitle')}
                </Text>
            </Box>

            <Tabs
                defaultValue="background"
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Tabs.List
                    style={{
                        flexWrap: 'nowrap',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        scrollbarWidth: 'none',
                    }}>
                    <Tabs.Tab value="background" fz={10} style={{ flexShrink: 0 }}>
                        {t('elements.tabBackground')}
                    </Tabs.Tab>
                    <Tabs.Tab value="elements" fz={10} style={{ flexShrink: 0 }}>
                        {t('elements.tabElements')}
                    </Tabs.Tab>
                    <Tabs.Tab value="mask" fz={10} style={{ flexShrink: 0 }}>
                        {t('elements.tabMask')}
                    </Tabs.Tab>
                    <Tabs.Tab value="text" fz={10} style={{ flexShrink: 0 }}>
                        {t('elements.tabText')}
                    </Tabs.Tab>
                </Tabs.List>

                {/* ── Background Tab ── */}
                <Tabs.Panel value="background" style={{ flex: 1, overflowY: 'auto' }} p="sm">
                    <Stack gap="sm">
                        <ColorInput
                            size="xs"
                            label={t('elements.bgColor')}
                            value={bgColor}
                            onChange={onBgColorChange}
                            format="hex"
                        />
                        <Divider label={t('elements.defaultAssets')} labelPosition="center" />
                        <AssetGrid
                            items={DEFAULT_BACKGROUNDS}
                            accentColor="var(--mantine-color-violet-5)"
                            onAdd={bg => addBackground(bg.src, bg.originalWidth, bg.originalHeight)}
                        />
                        <Divider label={t('elements.imgVideoBg')} labelPosition="center" />
                        <TextInput
                            size="xs"
                            label={t('elements.imageUrl')}
                            placeholder="https://..."
                            value={imgUrl}
                            onChange={e => setImgUrl(e.target.value)}
                        />
                        <Button size="xs" onClick={() => addBackground()} disabled={!imgUrl.trim()}>
                            {t('elements.addBgImage')}
                        </Button>
                        <CustomAssetsSection
                            type="background"
                            accentColor="var(--mantine-color-violet-5)"
                            onAdd={a => addBackground(a.src, a.originalWidth, a.originalHeight)}
                        />
                    </Stack>
                </Tabs.Panel>

                {/* ── Elements Tab ── */}
                <Tabs.Panel value="elements" style={{ flex: 1, overflowY: 'auto' }} p="sm">
                    <Stack gap="sm">
                        <Text size="xs" c="dimmed" fw={500}>
                            {t('elements.stickers')}
                        </Text>
                        <AssetGrid
                            items={DEFAULT_STICKERS}
                            accentColor="var(--mantine-color-cyan-5)"
                            onAdd={s => addSticker(s.src, s.originalWidth, s.originalHeight)}
                        />
                        <TextInput
                            size="xs"
                            label={t('elements.imageUrl')}
                            placeholder="https://..."
                            value={stickerUrl}
                            onChange={e => setStickerUrl(e.target.value)}
                        />
                        <Button
                            size="xs"
                            onClick={() => addSticker()}
                            disabled={!stickerUrl.trim()}>
                            {t('elements.addSticker')}
                        </Button>
                        <CustomAssetsSection
                            type="sticker"
                            accentColor="var(--mantine-color-cyan-5)"
                            onAdd={a => addSticker(a.src, a.originalWidth, a.originalHeight)}
                        />

                        <Divider label="Slideshow" labelPosition="center" />
                        {DEFAULT_CAROUSEL_SETS.map(set => (
                            <Button
                                key={set.label}
                                size="xs"
                                variant="light"
                                onClick={() => addCarousel(set.images)}>
                                🎴 {set.label}
                            </Button>
                        ))}
                    </Stack>
                </Tabs.Panel>

                {/* ── Mask Tab ── */}
                <Tabs.Panel value="mask" style={{ flex: 1, overflowY: 'auto' }} p="sm">
                    <Stack gap="sm">
                        <Text size="xs" c="dimmed">
                            {t('elements.mask')}
                        </Text>
                        <AssetGrid
                            items={DEFAULT_MASKS}
                            accentColor="var(--mantine-color-teal-5)"
                            onAdd={m => addMask(m.src, m.originalWidth, m.originalHeight)}
                        />
                        <Divider labelPosition="center" />
                        <TextInput
                            size="xs"
                            label={t('elements.maskUrl')}
                            placeholder="https://..."
                            value={maskUrl}
                            onChange={e => setMaskUrl(e.target.value)}
                        />
                        <Button size="xs" onClick={() => addMask()} disabled={!maskUrl.trim()}>
                            {t('elements.addMask')}
                        </Button>
                        <CustomAssetsSection
                            type="mask"
                            accentColor="var(--mantine-color-teal-5)"
                            onAdd={a => addMask(a.src, a.originalWidth, a.originalHeight)}
                        />
                    </Stack>
                </Tabs.Panel>

                {/* ── Text Tab ── */}
                <Tabs.Panel value="text" style={{ flex: 1, overflowY: 'auto' }} p="sm">
                    <Stack gap="sm">
                        <Text size="xs" c="dimmed">
                            {t('elements.bubbleText')}
                        </Text>
                        {/* Bubble text presets — vertical stack list */}
                        <BubblePresetList
                            items={DEFAULT_BUBBLE_TEXTS}
                            onAdd={addBubbleText}
                            isDark={isDark}
                        />
                        <Divider labelPosition="center" />
                        <TextInput
                            size="xs"
                            label={t('elements.bubbleContent')}
                            value={bubbleText}
                            onChange={e => setBubbleText(e.target.value)}
                        />
                        <TextInput
                            size="xs"
                            label={t('elements.bubbleBgUrl')}
                            placeholder="https://..."
                            value={bubbleSrc}
                            onChange={e => setBubbleSrc(e.target.value)}
                        />
                        <Button size="xs" onClick={() => addBubbleText()}>
                            {t('elements.addBubble')}
                        </Button>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}

// ── resolveColor ─────────────────────────────────────────────────────────────
/** 将 'auto' 令牌解析为主题适配的实际颜色，其他颜色值原样返回 */
function resolveColor(color: string, isDark: boolean): string {
    if (color === 'auto') return isDark ? '#ffffff' : '#1a1a1a';
    return color;
}

// ── BubblePresetList ──────────────────────────────────────────────────────────
function BubblePresetList({
    items,
    onAdd,
    isDark,
}: {
    items: { text: string; color: string; fontSize: number }[];
    onAdd: (b: { text: string; color: string; fontSize: number }) => void;
    isDark: boolean;
}) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    return (
        <Stack gap={4}>
            {items.map((b, i) => {
                const displayColor = resolveColor(b.color, isDark);
                return (
                    <UnstyledButton
                        key={i}
                        onClick={() => onAdd(b)}
                        aria-label={b.text}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '6px 8px',
                            borderRadius: 6,
                            borderLeft: `3px solid ${displayColor}`,
                            background:
                                hoveredIndex === i
                                    ? 'var(--mantine-color-default-hover)'
                                    : 'var(--mantine-color-default)',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                        }}>
                        <Text
                            size="xs"
                            style={{
                                color: displayColor,
                                flex: 1,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>
                            {b.text}
                        </Text>
                        <Text size="xs" c="dimmed" ml={6} style={{ flexShrink: 0 }}>
                            {b.fontSize}px
                        </Text>
                    </UnstyledButton>
                );
            })}
        </Stack>
    );
}

// ── CustomAssetsSection ───────────────────────────────────────────────────────
function CustomAssetsSection({
    type,
    accentColor,
    onAdd,
}: {
    type: AssetType;
    accentColor: string;
    onAdd: (a: { src: string; originalWidth: number; originalHeight: number }) => void;
}) {
    const { t } = useTranslation();
    const { items, loading, addFromUrl, addFromFile, remove } = useCustomAssets(type);
    const [customUrl, setCustomUrl] = useState('');
    const [adding, setAdding] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleAddUrl() {
        const url = customUrl.trim();
        if (!url) return;
        setAdding(true);
        try {
            await addFromUrl(url);
            setCustomUrl('');
        } catch {
            // ignore bad URL
        } finally {
            setAdding(false);
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setAdding(true);
        try {
            await addFromFile(file);
        } finally {
            setAdding(false);
            e.target.value = '';
        }
    }

    return (
        <Stack gap="xs">
            <Divider label={t('elements.myAssets')} labelPosition="center" />

            {/* Loading skeleton */}
            {loading && (
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2,1fr)',
                        gap: 6,
                    }}>
                    {[1, 2].map(i => (
                        <Skeleton key={i} height={52} radius={6} />
                    ))}
                </Box>
            )}

            {/* Saved assets grid with delete */}
            {!loading && items.length > 0 && (
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2,1fr)',
                        gap: 6,
                    }}>
                    {items.map(item => (
                        <Box
                            key={item.id}
                            style={{
                                position: 'relative',
                                borderRadius: 6,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: '2px solid transparent',
                                transition: 'border-color .15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                            onClick={() => onAdd(item)}>
                            <Image
                                src={item.src}
                                h={52}
                                fit="cover"
                                style={{ display: 'block', width: '100%' }}
                            />
                            <ActionIcon
                                size="xs"
                                variant="filled"
                                color="red"
                                style={{
                                    position: 'absolute',
                                    top: 2,
                                    right: 2,
                                    opacity: 0.85,
                                }}
                                onClick={e => {
                                    e.stopPropagation();
                                    remove(item.id);
                                }}
                                title={t('elements.deleteAsset')}>
                                <IconTrash size={10} />
                            </ActionIcon>
                        </Box>
                    ))}
                </Box>
            )}

            {/* URL input + Upload button */}
            <Box style={{ display: 'flex', gap: 4 }}>
                <TextInput
                    size="xs"
                    placeholder={t('elements.customUrlPlaceholder')}
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
                    style={{ flex: 1 }}
                />
                <ActionIcon
                    size="sm"
                    variant="light"
                    loading={adding}
                    onClick={handleAddUrl}
                    disabled={!customUrl.trim()}
                    title={t('elements.addCustom')}>
                    <IconPlus size={14} />
                </ActionIcon>
                <ActionIcon
                    size="sm"
                    variant="light"
                    loading={adding}
                    onClick={() => fileInputRef.current?.click()}
                    title={t('elements.uploadImage')}>
                    <IconUpload size={14} />
                </ActionIcon>
            </Box>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </Stack>
    );
}
