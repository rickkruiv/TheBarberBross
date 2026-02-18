import React from "react"
import { Card, CardHeader, CardContent, Box } from "@mui/material"

export default function SectionCard({ icon, title, children, contentSx }) {
  return (
    <Card>
      <CardHeader
        avatar={<Box sx={{ width: 28, height: 28, borderRadius: 1, display: "grid", placeItems: "center", bgcolor: "rgba(124,224,195,.14)", color: "primary.main" }}>{icon}</Box>}
        title={title}
      />
      <CardContent sx={contentSx}>{children}</CardContent>
    </Card>
  )
}
