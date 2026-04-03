'use client';

import Link from 'next/link';
import { Box, Stack, Title, Text, SimpleGrid, Card, Button, Group, ThemeIcon } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
    const { t } = useTranslation();

    const features = [
        { icon: '🎬', titleKey: 'home.features.0.title', descKey: 'home.features.0.desc' },
        { icon: '🖼️', titleKey: 'home.features.1.title', descKey: 'home.features.1.desc' },
        { icon: '🔄', titleKey: 'home.features.2.title', descKey: 'home.features.2.desc' },
        { icon: '🎴', titleKey: 'home.features.3.title', descKey: 'home.features.3.desc' },
        { icon: '✨', titleKey: 'home.features.4.title', descKey: 'home.features.4.desc' },
        { icon: '💬', titleKey: 'home.features.5.title', descKey: 'home.features.5.desc' },
        { icon: '📐', titleKey: 'home.features.6.title', descKey: 'home.features.6.desc' },
        { icon: '🌙', titleKey: 'home.features.7.title', descKey: 'home.features.7.desc' },
    ];

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
                        component={Link}
                        href="/editor"
                    >
                        {t('home.openEditor')}
                    </Button>
                    <Button
                        size="lg"
                        variant="gradient"
                        gradient={{ from: 'cyan', to: 'teal' }}
                        leftSection={<span>🖼️</span>}
                        component={Link}
                        href="/image-editor"
                    >
                        {t('home.openImageEditor')}
                    </Button>
                </Group>
            </Stack>

            {/* Features */}
            <Title order={3} mb="md" ta="center">
                {t('home.featuresTitle')}
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
                {features.map((f, index) => (
                    <Card
                        key={index}
                        withBorder
                        radius="md"
                        p="lg"
                        style={{ transition: 'transform .15s', cursor: 'default' }}
                    >
                        <ThemeIcon size={44} radius="md" variant="light" mb="sm">
                            <span style={{ fontSize: 22 }}>{f.icon}</span>
                        </ThemeIcon>
                        <Text fw={600} mb={4}>
                            {t(f.titleKey)}
                        </Text>
                        <Text size="sm" c="dimmed" lh={1.5}>
                            {t(f.descKey)}
                        </Text>
                    </Card>
                ))}
            </SimpleGrid>
        </Box>
    );
}
