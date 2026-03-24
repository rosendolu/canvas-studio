import { AppShell, Group, Title, ActionIcon, useMantineColorScheme, Badge } from '@mantine/core'
import { IconSun, IconMoon, IconBrandGithub } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
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
          {/* Logo */}
          <Group gap="sm" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
            <Title order={4} style={{ color: 'inherit' }}>
              {t('appName')}
            </Title>
            <Badge variant="light" size="sm">{t('beta')}</Badge>
          </Group>

          {/* Right actions */}
          <Group gap="xs">
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
