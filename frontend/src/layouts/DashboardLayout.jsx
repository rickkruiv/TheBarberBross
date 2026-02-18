import React from "react"
import { Outlet } from "react-router-dom"
import { AppBar, Box, Container, IconButton, Toolbar, Typography, useMediaQuery } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import TopbarUser from "../modules/TopbarUser"
import Sidebar, { drawerWidth, miniWidth } from "../modules/Sidebar"

export default function DashboardLayout() {
  const isMobile = useMediaQuery("(max-width:900px)")
  const [open, setOpen] = React.useState(() => {
    const v = localStorage.getItem("sidebarOpen")
    return v === null ? true : JSON.parse(v)
  })
  const toggle = () => {
    const v = !open
    setOpen(v)
    localStorage.setItem("sidebarOpen", JSON.stringify(v))
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar open={open} onToggle={toggle} setSidebarOpen={setOpen} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="fixed"
          elevation={0}
          color="default"
          sx={{
            zIndex: t => t.zIndex.drawer + 1,
            ml: { md: open ? `${drawerWidth}px` : `${miniWidth}px`, xs: 0 },
            width: { md: `calc(100% - ${open ? drawerWidth : miniWidth}px)`, xs: "100%" }
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton edge="start" onClick={toggle}><MenuIcon /></IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Cadastro de Funcionários</Typography>
            <TopbarUser />
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container sx={{ py: 3, flex: 1, maxWidth: "xl" }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
