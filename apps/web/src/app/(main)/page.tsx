'use client'

import Link from 'next/link'
import { Box, Stack, Title, Text, SimpleGrid, Card, Button, Group, ThemeIcon } from '@mantine/core'

const features = [
  { icon: '🎬', title: 'Multi-track Timeline', desc: 'Frame-level precision with multi-track support for complex compositions' },
  { icon: '🖼️', title: 'Image Mask Compositing', desc: 'Circle/rect crop masks for seamless image blending and portrait cutouts' },
  { icon: '🔄', title: 'Seamless Carousel', desc: 'Smooth looping scrolls for images/videos with configurable speed & direction' },
  { icon: '🎴', title: 'Slideshow Transitions', desc: 'Elegant multi-image switching with built-in slide/fade transitions' },
  { icon: '✨', title: 'APNG Animated Stickers', desc: 'Full APNG frame parsing with smooth Konva-powered playback' },
  { icon: '💬', title: 'Bubble Text', desc: 'Double-click to edit inline, custom bubble backgrounds & font styles' },
  { icon: '📐', title: 'Multi-ratio Canvas', desc: '16:9 / 9:16 / 1:1 — optimized for every major publishing platform' },
  { icon: '🌙', title: 'Dark / Light Theme', desc: 'One-click theme switch, easier on the eyes for long editing sessions' },
]

export default function HomePage() {
  return (
    <Box p="xl" style={{ height: '100%', overflowY: 'auto' }}>
      {/* Hero */}
      <Stack gap="lg" align="center" mb="xl" pt="xl">
        <div style={{ textAlign: 'center', maxWidth: 600 }}>
          <Title order={1} mb="xs" style={{ fontSize: 40, letterSpacing: -1 }}>
            🎨 Canvas Studio
          </Title>
          <Text c="dimmed" size="xl" lh={1.6}>
            Professional creative content tool — Video Editing · Image Compositing · Live Animation
          </Text>
        </div>

        <Group gap="md" mt="md">
          <Button
            size="lg"
            variant="gradient"
            gradient={{ from: 'violet', to: 'indigo' }}
            leftSection={<span>🎬</span>}
            component={Link}
            href="/editor"
          >
            Open Video Editor
          </Button>
          <Button
            size="lg"
            variant="gradient"
            gradient={{ from: 'cyan', to: 'teal' }}
            leftSection={<span>🖼️</span>}
            component={Link}
            href="/image-editor"
          >
            Open Image Editor
          </Button>
        </Group>
      </Stack>

      {/* Features */}
      <Title order={3} mb="md" ta="center">Core Features</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
        {features.map((f) => (
          <Card key={f.title} withBorder radius="md" p="lg" style={{ transition: 'transform .15s', cursor: 'default' }}>
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
