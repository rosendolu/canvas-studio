import { AppShell, Group, Title, ActionIcon, useMantineColorScheme, Anchor, Badge } from '@mantine/core'
import { IconSun, IconMoon, IconBrandGithub } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const location = useLocation()
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(next)
    localStorage.setItem('canvas-studio-lang', next)
  }

  return (
    <AppShell header={{ height: 56 }} padding={0} style={{ height: '100vh' }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Title
              order={4}
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
              onClick={() => window.location.href = '/'}
            >
              {t('appName')}
            </Title>
            <Badge variant="light" size="sm">{t('beta')}</Badge>
          </Group>

          <Group gap="xs">
            <Anchor
              component={Link}
              to="/editor"
              size="sm"
              c={location.pathname.startsWith('/editor') ? 'violet' : undefined}
            >
              {t('nav.editor')}
            </Anchor>
            <Anchor
              component={Link}
              to="/image-editor"
              size="sm"
              c={location.pathname.startsWith('/image-editor') ? 'cyan' : undefined}
            >
              {t('nav.imageEditor')}
            </Anchor>
            <ActionIcon
              variant="subtle"
              onClick={toggleLang}
              title="切换语言 / Toggle Language"
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {i18n.language === 'zh' ? 'EN' : '中'}
              </span>
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              onClick={toggleColorScheme}
              aria-label={t('nav.toggleTheme')}
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
