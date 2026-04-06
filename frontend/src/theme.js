import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FF1457" },
    secondary: { main: "#8FA3BF" },
    background: { default: "#0B1117", paper: "#0C1116" },
    text: { primary: "#E6EDF3", secondary: "#9BA7B4", tertiary: "#613C4C" },
    divider: "#1E2733"
  },
  shape: { borderRadius: 5 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#0B1117" },
        "*::-webkit-scrollbar": {
          width: "8px",
          height: "8px"
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor: "transparent"
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px"
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.2)"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", border: 1, borderColor: "divider", backgroundColor: "#0C1116" }
      }
    },
    MuiAppBar: {
      defaultProps: { color: "default" },
      styleOverrides: {
        root: { bgcolor: "background.default", borderBottom: "1px solid #1E2733" }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#0F1720"
        },
        notchedOutline: { borderColor: "#1E2733" },
        input: { padding: "12px 14px" }
      }
    },
    MuiFormLabel: {
      styleOverrides: { root: { color: "#9BA7B4" } }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderColor: "#1E2733",
          "&.Mui-selected": { backgroundColor: "#1B2734", borderColor: "#2B3544" }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: { backgroundColor: "#FF1457", color: "#0B1117", "&:hover": { backgroundColor: "#613C4C" } }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#1E2733"
        }
      }
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #2B3544",
          backgroundColor: "#101821"
        },
        grouped: {
          margin: 0,
          border: "none",
          "&:not(:first-of-type)": {
            borderLeft: "1px solid #2B3544"
          }
        },
        groupedHorizontal: {
          margin: 0,
          border: "none",
          "&:not(:first-of-type)": {
            borderLeft: "1px solid #2B3544"
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
          "&.Mui-selected": {
            backgroundColor: "#1B2734"
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
})

export default theme
