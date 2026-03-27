import { createTheme, createWeakenMask, createStrengthenMask, applyMask, } from '@tamagui/create-theme'

import { darkColors, lightColors } from './colors'

const lightTransparent = 'rgba(255,255,255,0)'
const darkTransparent = 'rgba(0,0,0,0)'

const palettes = {
  dark: [
    darkTransparent,
    darkColors.background,
    darkColors.backgroundSecondary,
    darkColors.surface,
    darkColors.surfaceElevated,
    darkColors.border,
    darkColors.divider,
    darkColors.primarySoft,
    darkColors.primary,
    darkColors.primaryHover,
    darkColors.textMuted,
    darkColors.textSecondary,
    darkColors.text,
    lightTransparent,
  ],

  light: [
    lightTransparent,
    lightColors.background,
    lightColors.backgroundSecondary,
    lightColors.surface,
    lightColors.surfaceElevated,
    lightColors.border,
    lightColors.divider,
    lightColors.primarySoft,
    lightColors.primary,
    lightColors.primaryHover,
    lightColors.textMuted,
    lightColors.textSecondary,
    lightColors.text,
    darkTransparent,
  ],
}

const template = {
  background: 1,
  backgroundHover: 2,
  backgroundPress: 0,
  backgroundFocus: 2,

  color: 12,
  colorHover: 11,
  colorPress: 12,
  colorFocus: 11,

  borderColor: 5,
  borderColorHover: 6,
  borderColorPress: 4,
  borderColorFocus: 5,

  placeholderColor: 10,

  backgroundStrong: 3,
  backgroundTransparent: 0,
}

const lightShadows = {
  shadowColor: 'rgba(0,0,0,0.08)',
}

const darkShadows = {
  shadowColor: 'rgba(0,0,0,0.3)',
}

const light = createTheme(palettes.light, {
  ...template,
  ...lightShadows,
})

const dark = createTheme(palettes.dark, {
  ...template,
  ...darkShadows,
})

const weaker = createWeakenMask()
const stronger = createStrengthenMask()

const maskOptions = {
  min: 1,
  max: palettes.light.length - 2,
}

function createComponentThemes(theme: any) {
  const softer = applyMask(theme, weaker, maskOptions)
  const strongerTheme = applyMask(theme, stronger, maskOptions)

  return {
    Card: softer,
    Button: strongerTheme,
    Input: theme,
    TextArea: theme,
    Switch: softer,
  }
}

export const themes = {
  light: {
    ...light,
    ...createComponentThemes(light),
    ...lightColors,
  },

  dark: {
    ...dark,
    ...createComponentThemes(dark),
    ...darkColors,
  },
}