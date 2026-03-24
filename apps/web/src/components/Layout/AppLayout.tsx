import { AppShell, Group, Title, ActionIcon, useMantineColorScheme, Anchor, Badge } from '@mantine/core'
import { IconSun, IconMoon, IconBrandGithub } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const location = useLocation()

  return (
    <AppShell
      header={{ height: 56 }}
      padding={0}
      style={{ height: '100vh' }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Title order={4} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
              🎨 Canvas Studio
            </Title>
            <Badge variant="light" size="sm">Beta</Badge>
          </Group>

          <Group gap="xs">
            <Anchor component={Link} to="/editor" size="sm" c={location.pathname.startsWith('/editor') ? 'brand' : undefined}>
              视频编辑器
            </Anchor>
            <Anchor component={Link} to="/live" size="sm" c={location.pathname.startsWith('/live') ? 'brand' : undefined}>
              直播间
            </Anchor>
            <ActionIcon
              variant="subtle"
              onClick={toggleColorScheme}
              aria-label="切换主题"
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              component="a"
              href="https://github.com/rosendolu/canvas-studio"
              target="_blank"
              aria-label="GitHub"
            >
              <IconBrandGithub size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
