import { useState, useCallback } from 'react'
import {
  Box, Text, TextInput, Group, ActionIcon, Button, Modal, Stack,
  ColorSwatch, ColorInput, NumberInput, Badge, Tooltip, Loader,
} from '@mantine/core'
import { IconPlus, IconTrash, IconCopy, IconPencil } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useBrandKits } from '../../hooks/useLibrary'
import type { ApiBrandKit, ApiBrandColor, ApiBrandTypography } from '../../api/libraryApi'

interface BrandKitPanelProps {
  /** Callback when user activates a brand kit (apply defaults) */
  onApply: (kit: ApiBrandKit) => void
}

export function BrandKitPanel({ onApply }: BrandKitPanelProps) {
  const { t } = useTranslation()
  const { brandKits, loading, create, remove, duplicate } = useBrandKits()
  const [createModal, setCreateModal] = useState(false)
  const [kitName, setKitName] = useState('')
  const [palette, setPalette] = useState<ApiBrandColor[]>([{ label: 'Primary', value: '#3B82F6' }])
  const [typography, setTypography] = useState<ApiBrandTypography[]>([
    { fontFamily: 'sans-serif', fontSize: 24, color: '#ffffff' },
  ])

  const handleCreate = useCallback(async () => {
    if (!kitName.trim()) return
    await create({ name: kitName.trim(), palette, typography })
    setCreateModal(false)
    setKitName('')
  }, [kitName, palette, typography, create])

  const addColor = () => setPalette(p => [...p, { label: `Color ${p.length + 1}`, value: '#888888' }])
  const removeColor = (i: number) => setPalette(p => p.filter((_, idx) => idx !== i))
  const updateColor = (i: number, patch: Partial<ApiBrandColor>) =>
    setPalette(p => p.map((c, idx) => idx === i ? { ...c, ...patch } : c))

  return (
    <Box p="xs">
      <Button size="xs" variant="light" fullWidth mb="xs" onClick={() => setCreateModal(true)}>
        {t('brandkit.create')}
      </Button>

      {loading ? (
        <Box ta="center" mt="lg"><Loader size="sm" /></Box>
      ) : brandKits.length === 0 ? (
        <Text size="xs" c="dimmed" ta="center" mt="lg">{t('brandkit.empty')}</Text>
      ) : (
        brandKits.map(kit => (
          <Box key={kit._id} mb="xs" p="xs" style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: 6 }}>
            <Group justify="space-between">
              <Text size="xs" fw={600}>{kit.name}</Text>
              <Group gap={2}>
                <Tooltip label={t('brandkit.apply')} withArrow>
                  <ActionIcon size="xs" variant="filled" color="blue" onClick={() => onApply(kit)}>
                    <IconPencil size={10} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={t('templates.duplicate')} withArrow>
                  <ActionIcon size="xs" variant="subtle" onClick={() => duplicate(kit._id)}>
                    <IconCopy size={10} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={t('templates.delete')} withArrow>
                  <ActionIcon size="xs" variant="subtle" color="red" onClick={() => remove(kit._id)}>
                    <IconTrash size={10} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
            <Group gap={4} mt={4}>
              {kit.palette.map((c, i) => (
                <Tooltip key={i} label={`${c.label} ${c.value}`} withArrow>
                  <ColorSwatch color={c.value} size={16} />
                </Tooltip>
              ))}
            </Group>
            {kit.typography.map((ty, i) => (
              <Text key={i} size="xs" c="dimmed" style={{ fontFamily: ty.fontFamily }}>
                {ty.fontFamily} {ty.fontSize}px
              </Text>
            ))}
          </Box>
        ))
      )}

      {/* Create modal */}
      <Modal opened={createModal} onClose={() => setCreateModal(false)} title={t('brandkit.create')} size="sm">
        <Stack>
          <TextInput label={t('templates.name')} value={kitName} onChange={e => setKitName(e.currentTarget.value)} required />

          <Text size="sm" fw={600}>{t('brandkit.palette')}</Text>
          {palette.map((c, i) => (
            <Group key={i} gap="xs">
              <TextInput size="xs" value={c.label} onChange={e => updateColor(i, { label: e.currentTarget.value })} style={{ flex: 1 }} />
              <ColorInput size="xs" value={c.value} onChange={v => updateColor(i, { value: v })} style={{ width: 100 }} />
              <ActionIcon size="xs" color="red" variant="subtle" onClick={() => removeColor(i)}><IconTrash size={10} /></ActionIcon>
            </Group>
          ))}
          <Button size="xs" variant="subtle" leftSection={<IconPlus size={12} />} onClick={addColor}>
            {t('brandkit.addColor')}
          </Button>

          <Button size="sm" onClick={handleCreate} disabled={!kitName.trim()}>{t('common.save')}</Button>
        </Stack>
      </Modal>
    </Box>
  )
}
