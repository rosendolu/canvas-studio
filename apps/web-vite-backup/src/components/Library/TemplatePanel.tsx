import { useState, useCallback } from 'react'
import {
  Box, Text, TextInput, SegmentedControl, Group, ActionIcon, Button,
  Loader, SimpleGrid, Card, Image, Badge, Tooltip, Modal, Stack,
  Select, Textarea,
} from '@mantine/core'
import { IconSearch, IconTrash, IconCopy, IconPencil, IconCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useTemplates } from '../../hooks/useLibrary'
import type { ApiTemplate } from '../../api/libraryApi'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import {
  applySceneTemplate, applyOverlayTemplate,
  extractScenePayload, extractOverlayPayload,
} from '@canvas-studio/canvas-core'

interface TemplatePanelProps {
  elements: CanvasElement[]
  aspectRatio: string
  bgColor: string
  activeUids: string[]
  onApplyScene: (elements: CanvasElement[], aspectRatio: string, bgColor: string, mode: 'replace' | 'merge') => void
  onInsertOverlay: (elements: CanvasElement[]) => void
}

export function TemplatePanel({
  elements, aspectRatio, bgColor, activeUids,
  onApplyScene, onInsertOverlay,
}: TemplatePanelProps) {
  const { t } = useTranslation()
  const [typeFilter, setTypeFilter] = useState<'all' | 'scene' | 'overlay'>('all')
  const [q, setQ] = useState('')
  const [saveModal, setSaveModal] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveDesc, setSaveDesc] = useState('')
  const [saveType, setSaveType] = useState<'scene' | 'overlay'>('scene')
  const [applyModal, setApplyModal] = useState<ApiTemplate | null>(null)
  const [applyMode, setApplyMode] = useState<'replace' | 'merge'>('replace')

  const { templates, loading, create, remove, duplicate } = useTemplates(
    typeFilter !== 'all' ? { type: typeFilter, q: q || undefined } : { q: q || undefined }
  )

  const handleSave = useCallback(async () => {
    if (!saveName.trim()) return
    const payload = saveType === 'scene'
      ? extractScenePayload(elements, aspectRatio, bgColor)
      : extractOverlayPayload(elements, activeUids.length ? activeUids : elements.map(e => e.uid))
    await create({ name: saveName.trim(), description: saveDesc, type: saveType, tags: [], payload: payload as any })
    setSaveModal(false)
    setSaveName(''); setSaveDesc('')
  }, [saveName, saveDesc, saveType, elements, aspectRatio, bgColor, activeUids, create])

  const handleApply = useCallback(() => {
    if (!applyModal) return
    if (applyModal.type === 'scene') {
      const scene = applyModal.payload as any
      onApplyScene(
        applySceneTemplate(scene, elements, applyMode),
        scene.aspectRatio ?? aspectRatio,
        scene.bgColor ?? bgColor,
        applyMode,
      )
    } else {
      const overlay = applyModal.payload as any
      onInsertOverlay(applyOverlayTemplate(overlay, elements))
    }
    setApplyModal(null)
  }, [applyModal, applyMode, elements, aspectRatio, bgColor, onApplyScene, onInsertOverlay])

  return (
    <Box p="xs" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Controls */}
      <Group gap="xs" mb="xs">
        <TextInput
          size="xs"
          placeholder={t('library.search')}
          leftSection={<IconSearch size={12} />}
          value={q}
          onChange={e => setQ(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
      </Group>
      <SegmentedControl
        size="xs"
        mb="xs"
        value={typeFilter}
        onChange={v => setTypeFilter(v as any)}
        data={[
          { label: t('templates.all'), value: 'all' },
          { label: t('templates.scene'), value: 'scene' },
          { label: t('templates.overlay'), value: 'overlay' },
        ]}
      />
      <Button size="xs" variant="light" mb="xs" fullWidth onClick={() => setSaveModal(true)}>
        {t('templates.saveAs')}
      </Button>

      {/* Grid */}
      {loading ? (
        <Box ta="center" mt="lg"><Loader size="sm" /></Box>
      ) : templates.length === 0 ? (
        <Text size="xs" c="dimmed" ta="center" mt="lg">{t('templates.empty')}</Text>
      ) : (
        <SimpleGrid cols={2} spacing={6} style={{ overflowY: 'auto', flex: 1 }}>
          {templates.map(tpl => (
            <Card key={tpl._id} p={4} radius="sm" withBorder>
              <Card.Section
                style={{ cursor: 'pointer', background: 'var(--mantine-color-default-hover)', minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setApplyModal(tpl)}
              >
                {tpl.thumbnail
                  ? <Image src={tpl.thumbnail} height={50} fit="contain" />
                  : <Text size="xl">{tpl.type === 'scene' ? '🎬' : '🔲'}</Text>
                }
              </Card.Section>
              <Text size="xs" truncate mt={2}>{tpl.name}</Text>
              <Badge size="xs" variant="light" color={tpl.type === 'scene' ? 'blue' : 'grape'} mt={2}>
                {tpl.type}
              </Badge>
              <Group gap={2} mt={2}>
                <Tooltip label={t('templates.duplicate')} withArrow>
                  <ActionIcon size="xs" variant="subtle" onClick={() => duplicate(tpl._id)}>
                    <IconCopy size={10} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={t('templates.delete')} withArrow>
                  <ActionIcon size="xs" variant="subtle" color="red" onClick={() => remove(tpl._id)}>
                    <IconTrash size={10} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Save modal */}
      <Modal opened={saveModal} onClose={() => setSaveModal(false)} title={t('templates.saveAs')} size="sm">
        <Stack>
          <TextInput label={t('templates.name')} value={saveName} onChange={e => setSaveName(e.currentTarget.value)} required />
          <Textarea label={t('templates.description')} value={saveDesc} onChange={e => setSaveDesc(e.currentTarget.value)} rows={2} />
          <Select
            label={t('templates.type')}
            value={saveType}
            onChange={v => setSaveType(v as any)}
            data={[{ value: 'scene', label: t('templates.scene') }, { value: 'overlay', label: t('templates.overlay') }]}
          />
          <Button size="sm" onClick={handleSave} disabled={!saveName.trim()}>{t('common.save')}</Button>
        </Stack>
      </Modal>

      {/* Apply modal */}
      <Modal opened={!!applyModal} onClose={() => setApplyModal(null)} title={t('templates.applyTitle')} size="xs">
        <Stack>
          <Text size="sm">{applyModal?.name}</Text>
          {applyModal?.type === 'scene' && (
            <SegmentedControl
              size="xs"
              value={applyMode}
              onChange={v => setApplyMode(v as any)}
              data={[
                { label: t('templates.replace'), value: 'replace' },
                { label: t('templates.merge'), value: 'merge' },
              ]}
            />
          )}
          <Button size="sm" onClick={handleApply}>{t('templates.apply')}</Button>
        </Stack>
      </Modal>
    </Box>
  )
}
