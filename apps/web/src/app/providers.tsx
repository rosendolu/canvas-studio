'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { I18nextProvider, useTranslation as useI18nextTranslation } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useState, useEffect } from 'react';
import { theme } from '../theme';
import zh from '../i18n/zh';
import en from '../i18n/en';

// Initialize i18next if not already initialized
if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources: {
            zh: zh,
            en: en,
        },
        lng: 'zh',
        fallbackLng: 'zh',
        interpolation: {
            escapeValue: false,
        },
    });
}

function I18nSync({ children }: { children: React.ReactNode }) {
    const { i18n: i18nInstance } = useI18nextTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Restore language from localStorage on client side
        const savedLang = localStorage.getItem('canvas-studio-lang');
        if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
            i18nInstance.changeLanguage(savedLang);
        }
        setMounted(true);
    }, [i18nInstance]);

    return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <Notifications />
                    <I18nSync>{children}</I18nSync>
                </MantineProvider>
            </QueryClientProvider>
        </I18nextProvider>
    );
}
