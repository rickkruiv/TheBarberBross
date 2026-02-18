import React from "react"
import { Box, Checkbox, Switch, Typography } from "@mui/material"

export function BenefitSwitchRow({ title, subtitle, checked, onChange }) {
  return (
    <Box sx={{ border: "1px solid #1E2733", bgcolor: "#0C1116", p: 2, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      </Box>
      <Switch checked={checked} onChange={onChange} />
    </Box>
  )
}

export function BenefitCheckRow({ title, subtitle, checked, onChange }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, bgcolor: "#0C1116", border: "1px solid #1E2733", px: 2, py: 1.5, borderRadius: 2 }}>
      <Checkbox checked={checked} onChange={onChange} />
      <Box>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      </Box>
    </Box>
  )
}
