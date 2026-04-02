'use client'

import { AppShell, Group, Title, ActionIcon, useMantineColorScheme, Badge } from '@mantine/core'
import { IconSun, IconMoon, IconBrandGithub } from '@tabler/icons-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('canvas-studio-lang', next)
    }
  }

  return (
    <AppShell header={{ height: 56 }} padding={0} style={{ height: '100vh' }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Group gap="sm" style={{ cursor: 'pointer' }}>
              <Title order={4} style={{ color: 'inherit' }}>
                {t('appName')}
              </Title>
              <Badge variant="light" size="sm">
                {t('beta')}
              </Badge>
            </Group>
          </Link>

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
              {colorScheme === 'dark' ? (
                <IconSun size={18} />
              ) : (
                <IconMoon size={18} />
              )}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              component="a"
              href="https://github.com/rosendolu/canvas-studio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <IconBrandGithub size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main
        style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
