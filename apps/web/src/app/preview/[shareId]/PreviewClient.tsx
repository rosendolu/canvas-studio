'use client'

import { Box } from '@mantine/core'

export default function PreviewClient({
  shareId,
}: {
  shareId: string
}) {
  return (
    <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Preview Client — Share: {shareId}
    </Box>
  )
}
