import React from "react"
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@mui/material"

export default function Group({
  icon,
  label,
  children,
  open: groupOpen,
  onToggle,
  sidebarOpen,
  setSidebarOpen
}) {
  const handleClick = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true)
      onToggle()
    } else {
      onToggle()
    }
  }

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>

      <Collapse in={sidebarOpen && Boolean(groupOpen)} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          {children}
        </List>
      </Collapse>
    </>
  )
}