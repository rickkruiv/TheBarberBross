import React from "react"
import { Outlet } from "react-router-dom"
import { Box, Container } from "@mui/material"
import Topbar from "../modules/Topbar"

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", position: "relative" }}>
      <Topbar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", pt: 12 }}>
        <Container sx={{ py: 3, flex: 1, maxWidth: "xl" }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
