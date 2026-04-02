import { Box, LoadingOverlay } from '@mantine/core'

export default function Loading() {
  return (
    <Box style={{ height: '100%', position: 'relative' }}>
      <LoadingOverlay visible />
    </Box>
  )
}
