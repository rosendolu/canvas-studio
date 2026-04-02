'use client'

import { Box } from '@mantine/core'

export function EditorClient({
  id,
}: {
  id?: string
}) {
  return (
    <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Editor Client — {id ? `Editing canvas: ${id}` : 'New canvas'}
    </Box>
  )
}
