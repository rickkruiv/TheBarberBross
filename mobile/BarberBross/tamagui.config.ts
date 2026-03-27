import { createTamagui } from 'tamagui';
import { themes } from './src/theme/theme';
import { tokens } from './src/theme/tokens';
import { fonts } from './src/theme/fonts';

export const tamaguiConfig = createTamagui({
  themes,
  tokens,
  fonts,
  defaultTheme: 'dark',
})

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}