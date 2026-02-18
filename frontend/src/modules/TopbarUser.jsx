import React from "react"
import { Avatar, IconButton, Tooltip } from "@mui/material"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"

export default function TopbarUser() {
  return (
    <>
      <Tooltip title="Notificações"><IconButton><NotificationsNoneIcon /></IconButton></Tooltip>
      <Tooltip title="Ajuda"><IconButton><HelpOutlineIcon /></IconButton></Tooltip>
      <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
    </>
  )
}
