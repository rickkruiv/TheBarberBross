import { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: any) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<"system" | "light" | "dark">("system");

  const scheme = themeMode === "system" ? systemScheme ?? "dark" : themeMode;

  const colors = scheme === "dark" ? darkColors : lightColors;

  const theme = {
    colors,
    spacing,
    typography,
    isDark: scheme === "dark",
    themeMode,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}