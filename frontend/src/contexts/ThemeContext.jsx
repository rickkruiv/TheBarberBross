import React, { createContext, useState, useMemo, useContext } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeContext = createContext({
  mode: "dark",
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const theme = useMemo(() => {
    const isDark = mode === "dark";

    return createTheme({
      palette: {
        mode,
        primary: { main: "#FF1457" },
        secondary: { main: isDark ? "#8FA3BF" : "#5A6D88" },
        background: { 
          default: isDark ? "#0B1117" : "#FFFFFF", 
          paper: isDark ? "#0C1116" : "#F8FAFC" 
        },
        text: { 
          primary: isDark ? "#E6EDF3" : "#1A2027", 
          secondary: isDark ? "#9BA7B4" : "#4A5568", 
          tertiary: isDark ? "#613C4C" : "#9B6A7F" 
        },
        divider: isDark ? "#1E2733" : "#E2E8F0"
      },
      shape: { borderRadius: 5 },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: { 
              backgroundColor: isDark ? "#0B1117" : "#FFFFFF",
              scrollbarWidth: "thin",
              scrollbarColor: isDark ? "#1E2733 transparent" : "#CBD5E1 transparent",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: isDark ? "#1E2733" : "#CBD5E1",
                borderRadius: "20px",
              },
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            root: { 
              backgroundImage: "none", 
              border: `1px solid ${isDark ? "#1E2733" : "#E2E8F0"}`, 
              backgroundColor: isDark ? "#0C1116" : "#F8FAFC" 
            }
          }
        },
        MuiAppBar: {
          defaultProps: { color: "default" },
          styleOverrides: {
            root: { 
              backgroundColor: isDark ? "#0B1117" : "#FFFFFF", 
              borderBottom: `1px solid ${isDark ? "#1E2733" : "#E2E8F0"}` 
            }
          }
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "#0F1720" : "#FFFFFF"
            },
            notchedOutline: { borderColor: isDark ? "#1E2733" : "#CBD5E1" },
            input: { padding: "12px 14px" }
          }
        },
        MuiFormLabel: {
          styleOverrides: { root: { color: isDark ? "#9BA7B4" : "#64748B" } }
        },
        MuiButton: {
          styleOverrides: {
            contained: { 
              backgroundColor: "#FF1457", 
              color: "#FFFFFF", 
              "&:hover": { backgroundColor: "#D41147" } 
            }
          }
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: isDark ? "#1E2733" : "#E2E8F0"
            }
          }
        },
        MuiToggleButtonGroup: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${isDark ? "#2B3544" : "#CBD5E1"}`,
              backgroundColor: isDark ? "#101821" : "#F1F5F9"
            },
            grouped: {
              margin: 0,
              border: "none",
              "&:not(:first-of-type)": {
                borderLeft: `1px solid ${isDark ? "#2B3544" : "#CBD5E1"}`
              }
            },
            groupedHorizontal: {
              margin: 0,
              border: "none",
              "&:not(:first-of-type)": {
                borderLeft: `1px solid ${isDark ? "#2B3544" : "#CBD5E1"}`
              }
            }
          }
        },
        MuiToggleButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius: 0,
              padding: "12px 16px",
              fontWeight: 800,
              borderColor: isDark ? "#1E2733" : "#CBD5E1",
              "&.Mui-selected": { 
                backgroundColor: isDark ? "#1B2734" : "#E2E8F0", 
                borderColor: isDark ? "#2B3544" : "#94A3B8" 
              }
            }
          }
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              transition: "all .2s",
            }
          }
        },
        MuiListItemIcon: {
          styleOverrides: {
            root: {
              transition: "all .2s",
              minWidth: 0,
              justifyContent: "center"
            }
          }
        },
        MuiListItemText: {
          styleOverrides: {
            root: {
              transition: "opacity .2s"
            }
          }
        },
      }
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
