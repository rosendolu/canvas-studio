import { Box, Stack, Title, Text, SimpleGrid, Card, Button, Group, Badge } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: '🎬', title: '视频编辑器', desc: '时间轴 + 帧级控制，支持多轨道编排' },
  { icon: '📺', title: '直播间画布', desc: '实时元素编辑，支持数字人+贴图+气泡文字' },
  { icon: '🔄', title: '滚动轮播', desc: '图片无缝滚动，可配置水平/垂直速度' },
  { icon: '🎴', title: '幻灯片切换', desc: '多图切换，支持滑入过渡动画' },
  { icon: '✨', title: 'APNG 动态贴图', desc: '解析 APNG 帧，Konva 驱动流畅播放' },
  { icon: '💬', title: '气泡文字', desc: '双击进入内联编辑，键盘方向键微调位置' },
  { icon: '🎭', title: '数字人蒙版', desc: '圆形 clip 蒙版，可拖拽移动和缩放' },
  { icon: '🖼️', title: '导出图片', desc: '基于 Konva 导出 DataURL 或 Blob' },
  { icon: '🌙', title: '主题切换', desc: 'Mantine 内置 light/dark 双主题' },
]

export function HomePage() {
  const navigate = useNavigate()

  return (
    <Box p="xl" style={{ height: '100%', overflowY: 'auto' }}>
      <Stack gap="xl" align="center" mb="xl">
        <div style={{ textAlign: 'center' }}>
          <Title order={1} mb="xs">🎨 Canvas Studio</Title>
          <Text c="dimmed" size="lg">开源 Canvas 编辑器 · React + Vite + Mantine + NestJS + MongoDB</Text>
          <Group justify="center" mt="md" gap="sm">
            <Badge color="brand">React 18</Badge>
            <Badge color="cyan">Vite 5</Badge>
            <Badge color="violet">Mantine 7</Badge>
            <Badge color="orange">Konva</Badge>
            <Badge color="green">NestJS</Badge>
            <Badge color="yellow">MongoDB</Badge>
          </Group>
        </div>

        <Group gap="md">
          <Button size="lg" onClick={() => navigate('/editor')}>打开视频编辑器</Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/live')}>进入直播间</Button>
        </Group>
      </Stack>

      <Title order={3} mb="md">功能一览</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {FEATURES.map(f => (
          <Card key={f.title} withBorder radius="md" p="md">
            <Text size="xl" mb="xs">{f.icon}</Text>
            <Text fw={600} mb={4}>{f.title}</Text>
            <Text size="sm" c="dimmed">{f.desc}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  )
}
