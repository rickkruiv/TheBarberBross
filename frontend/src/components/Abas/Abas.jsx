import {
  Box,
  ListItemButton,
  ListItemText
} from "@mui/material"
import { NavLink } from "react-router-dom"

export default function Abas({ to, icon, text }) {
  return (
    <ListItemButton component={NavLink} to={to}>
      <Box sx={{ minWidth: 40, display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      <ListItemText primary={text} />
    </ListItemButton>
  )
}
