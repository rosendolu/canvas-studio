import { Box, Stack, Title, Text, SimpleGrid, Card, Button, Group, ThemeIcon } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const features = t('home.features', { returnObjects: true }) as { icon: string; title: string; desc: string }[]

  return (
    <Box p="xl" style={{ height: '100%', overflowY: 'auto' }}>
      {/* Hero */}
      <Stack gap="lg" align="center" mb="xl" pt="xl">
        <div style={{ textAlign: 'center', maxWidth: 600 }}>
          <Title order={1} mb="xs" style={{ fontSize: 40, letterSpacing: -1 }}>
            🎨 Canvas Studio
          </Title>
          <Text c="dimmed" size="xl" lh={1.6}>
            {t('home.subtitle')}
          </Text>
        </div>

        <Group gap="md" mt="md">
          <Button
            size="lg"
            variant="gradient"
            gradient={{ from: 'violet', to: 'indigo' }}
            leftSection={<span>🎬</span>}
            onClick={() => navigate('/editor')}
          >
            {t('home.openEditor')}
          </Button>
          <Button
            size="lg"
            variant="gradient"
            gradient={{ from: 'cyan', to: 'teal' }}
            leftSection={<span>🖼️</span>}
            onClick={() => navigate('/image-editor')}
          >
            {t('home.openImageEditor')}
          </Button>
        </Group>
      </Stack>

      {/* Features */}
      <Title order={3} mb="md" ta="center">{t('home.featuresTitle')}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
        {features.map(f => (
          <Card key={f.title} withBorder radius="md" p="lg" style={{ transition: 'transform .15s', cursor: 'default' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          >
            <ThemeIcon size={44} radius="md" variant="light" mb="sm">
              <span style={{ fontSize: 22 }}>{f.icon}</span>
            </ThemeIcon>
            <Text fw={600} mb={4}>{f.title}</Text>
            <Text size="sm" c="dimmed" lh={1.5}>{f.desc}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  )
}
