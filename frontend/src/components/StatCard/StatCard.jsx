import React from "react"
import { Box, Paper, Typography } from "@mui/material"

export default function StatCard({ title, value, icon }) {
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        p: 2.5,
        borderRadius: 2,
        border: "1px solid #1E2733",
        bgcolor: "#0C1116",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ mt: 1 }}>
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0,0,0,0.4)"
        }}
      >
        {icon}
      </Box>
    </Paper>
  )
}
