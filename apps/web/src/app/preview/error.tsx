'use client'

import { Button, Stack, Text } from '@mantine/core'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Stack align="center" justify="center" style={{ height: '100%' }} gap="md">
      <Text size="xl" fw={600}>Preview Error</Text>
      <Text c="dimmed">{error.message}</Text>
      <Button onClick={reset}>Try again</Button>
    </Stack>
  )
}
