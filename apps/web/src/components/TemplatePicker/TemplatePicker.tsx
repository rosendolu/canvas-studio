import { Box, Image, SimpleGrid, Text, Tooltip, UnstyledButton } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import { DEFAULT_TEMPLATES } from '../../data/defaultAssets'
import type { CanvasElement } from '@canvas-studio/canvas-core'
import type { CanvasTemplate } from '../../data/defaultAssets'

interface TemplatePickerProps {
  onApply: (elements: CanvasElement[], aspectRatio: string) => void
}

export function TemplatePicker({ onApply }: TemplatePickerProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  function applyTemplate(tpl: CanvasTemplate) {
    const elements: CanvasElement[] = tpl.elements.map(el => ({
      ...el,
      uid: nanoid(),
    } as CanvasElement))
    onApply(elements, tpl.aspectRatio)
  }

  return (
    <Box p="sm">
      <Text size="xs" fw={600} mb="xs" c="dimmed">
        {t('templates.title')}
      </Text>
      <SimpleGrid cols={2} spacing="xs">
        {DEFAULT_TEMPLATES.map(tpl => (
          <Tooltip
            key={tpl.id}
            label={isZh ? tpl.nameZh : tpl.name}
            position="top"
            withArrow
          >
            <UnstyledButton
              onClick={() => applyTemplate(tpl)}
              style={{
                borderRadius: 6,
                overflow: 'hidden',
                border: '1px solid var(--mantine-color-default-border)',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'scale(1.04)'
                el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.18)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'scale(1)'
                el.style.boxShadow = 'none'
              }}
            >
              <Box style={{ position: 'relative' }}>
                <Image
                  src={tpl.thumbnail}
                  h={72}
                  fit="cover"
                  alt={tpl.name}
                />
                <Box
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                    padding: '4px 6px 3px',
                  }}
                >
                  <Text size="9px" c="white" fw={600} truncate>
                    {isZh ? tpl.nameZh : tpl.name}
                  </Text>
                </Box>
              </Box>
            </UnstyledButton>
          </Tooltip>
        ))}
      </SimpleGrid>
    </Box>
  )
}
