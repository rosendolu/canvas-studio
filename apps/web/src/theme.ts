import { createTheme, MantineColorsTuple } from '@mantine/core'

// Brand primary color - 可以通过环境变量或运行时修改
const brandColor: MantineColorsTuple = [
  '#e3f9f5', '#c8f3ec', '#92e7d9', '#58dbc5',
  '#31d0b4', '#18c9ac', '#00c5a7', '#00ae94',
  '#009b84', '#008773',
]

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand: brandColor },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  defaultRadius: 'md',
  components: {
    AppShell: {
      defaultProps: {
        padding: 'md',
      },
    },
  },
})
