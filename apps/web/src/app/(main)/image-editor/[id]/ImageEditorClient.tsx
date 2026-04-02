'use client'

import { Box } from '@mantine/core'

export default function ImageEditorClient({
  id,
}: {
  id?: string
}) {
  return (
    <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Image Editor Client — {id ? `Editing image: ${id}` : 'New image editor'}
    </Box>
  )
}
