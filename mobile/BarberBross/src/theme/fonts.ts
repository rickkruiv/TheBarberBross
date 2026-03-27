import { createFont } from 'tamagui'

export const bodyFont = createFont({
  family: 'System',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
  },
  lineHeight: {
    1: 16,
    2: 18,
    3: 20,
    4: 22,
    5: 24,
    6: 28,
  },
  weight: {
    4: '400',
    6: '600',
    7: '700',
  },
})

export const fonts = {
  body: bodyFont,
}