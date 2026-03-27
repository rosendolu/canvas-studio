import {
  Box,
  Button,
  ColorInput,
  Divider,
  NumberInput,
  Slider,
  Stack,
  Switch,
  Text,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface PropertyPanelProps {
  activeElement?: CanvasElement
  onUpdate: (updates: Partial<CanvasElement>) => void
  onDelete: () => void
}

export function PropertyPanel({ activeElement, onUpdate, onDelete }: PropertyPanelProps) {
  const { t } = useTranslation()

  if (!activeElement) {
    return (
      <Box p="md">
        <Text size="sm" c="dimmed" ta="center" mt="xl">
          {t('properties.noSelection')}
        </Text>
      </Box>
    )
  }

  return (
    <Stack p="md" gap="xs">
      <Text size="sm" fw={600}>{t('properties.title')}</Text>
      <Text size="xs" c="dimmed">{activeElement.type}</Text>
      <Divider />

      <NumberInput
        size="xs"
        label={t('properties.posX')}
        value={Math.round(activeElement.left)}
        onChange={v => onUpdate({ left: Number(v) })}
      />
      <NumberInput
        size="xs"
        label={t('properties.posY')}
        value={Math.round(activeElement.top)}
        onChange={v => onUpdate({ top: Number(v) })}
      />
      <NumberInput
        size="xs"
        label={t('properties.width')}
        value={Math.round(activeElement.width)}
        onChange={v => onUpdate({ width: Number(v) })}
      />
      <NumberInput
        size="xs"
        label={t('properties.height')}
        value={Math.round(activeElement.height)}
        onChange={v => onUpdate({ height: Number(v) })}
      />
      <NumberInput
        size="xs"
        label={t('properties.rotation')}
        value={Math.round(activeElement.rotation || 0)}
        suffix="°"
        onChange={v => onUpdate({ rotation: Number(v) })}
      />
      <NumberInput
        size="xs"
        label={t('properties.scaleX')}
        value={activeElement.scaleX}
        step={0.1}
        decimalScale={2}
        onChange={v => onUpdate({ scaleX: Number(v) })}
      />
      <NumberInput
        size="xs"
        label={t('properties.scaleY')}
        value={activeElement.scaleY}
        step={0.1}
        decimalScale={2}
        onChange={v => onUpdate({ scaleY: Number(v) })}
      />

      <Text size="xs" c="dimmed">{t('properties.opacity')}</Text>
      <Slider
        size="xs"
        min={0}
        max={1}
        step={0.01}
        value={activeElement.opacity ?? 1}
        onChange={v => onUpdate({ opacity: v })}
        label={v => `${Math.round(v * 100)}%`}
      />

      <Switch
        size="xs"
        label={t('properties.visible')}
        checked={activeElement.visible}
        onChange={e => onUpdate({ visible: e.currentTarget.checked })}
      />

      {activeElement.type === 'bubbleText' && (
        <>
          <Divider label={t('properties.textColor')} />
          <ColorInput
            size="xs"
            label={t('properties.textColor')}
            value={activeElement.color || '#fff'}
            onChange={v => onUpdate({ color: v })}
          />
          <NumberInput
            size="xs"
            label={t('properties.fontSize')}
            value={activeElement.fontSize || 12}
            onChange={v => onUpdate({ fontSize: Number(v) })}
          />
        </>
      )}

      <Divider />
      <Button size="xs" color="red" variant="outline" onClick={onDelete}>
        {t('properties.deleteElement')}
      </Button>
    </Stack>
  )
}
