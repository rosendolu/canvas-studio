import { Group, ActionIcon, Tooltip, SegmentedControl, Divider } from '@mantine/core'
import {
  IconAlignLeft, IconAlignCenter, IconAlignRight,
  IconAlignBoxTopCenter, IconAlignBoxCenterMiddle, IconAlignBoxBottomCenter,
  IconArrowsHorizontal, IconArrowsVertical,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type { AlignMode, AlignBasis } from '@canvas-studio/canvas-core'

interface AlignToolbarProps {
  /** Number of currently selected elements */
  selectedCount: number
  basis: AlignBasis
  onBasisChange: (b: AlignBasis) => void
  onAlign: (mode: AlignMode) => void
}

const ALIGN_ACTIONS: { mode: AlignMode; icon: React.ReactNode; labelKey: string }[] = [
  { mode: 'left',    icon: <IconAlignLeft size={14} />,            labelKey: 'align.left' },
  { mode: 'centerH', icon: <IconAlignCenter size={14} />,          labelKey: 'align.centerH' },
  { mode: 'right',   icon: <IconAlignRight size={14} />,           labelKey: 'align.right' },
  { mode: 'top',     icon: <IconAlignBoxTopCenter size={14} />,    labelKey: 'align.top' },
  { mode: 'centerV', icon: <IconAlignBoxCenterMiddle size={14} />, labelKey: 'align.centerV' },
  { mode: 'bottom',  icon: <IconAlignBoxBottomCenter size={14} />, labelKey: 'align.bottom' },
]

const DISTRIBUTE_ACTIONS: { mode: AlignMode; icon: React.ReactNode; labelKey: string }[] = [
  { mode: 'distributeH', icon: <IconArrowsHorizontal size={14} />, labelKey: 'align.distributeH' },
  { mode: 'distributeV', icon: <IconArrowsVertical size={14} />,   labelKey: 'align.distributeV' },
]

export function AlignToolbar({ selectedCount, basis, onBasisChange, onAlign }: AlignToolbarProps) {
  const { t } = useTranslation()
  if (selectedCount < 1) return null

  return (
    <Group gap={2} align="center">
      <SegmentedControl
        size="xs"
        value={basis}
        onChange={v => onBasisChange(v as AlignBasis)}
        data={[
          { label: t('align.basisCanvas'), value: 'canvas' },
          { label: t('align.basisSelection'), value: 'selection' },
        ]}
        style={{ fontSize: 10 }}
      />
      <Divider orientation="vertical" mx={4} />
      {ALIGN_ACTIONS.map(a => (
        <Tooltip key={a.mode} label={t(a.labelKey)} withArrow>
          <ActionIcon size="sm" variant="subtle" onClick={() => onAlign(a.mode)}>
            {a.icon}
          </ActionIcon>
        </Tooltip>
      ))}
      {selectedCount >= 3 && (
        <>
          <Divider orientation="vertical" mx={4} />
          {DISTRIBUTE_ACTIONS.map(a => (
            <Tooltip key={a.mode} label={t(a.labelKey)} withArrow>
              <ActionIcon size="sm" variant="subtle" onClick={() => onAlign(a.mode)}>
                {a.icon}
              </ActionIcon>
            </Tooltip>
          ))}
        </>
      )}
    </Group>
  )
}
