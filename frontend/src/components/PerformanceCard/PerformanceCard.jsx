import React from "react"
import { Box, Paper, Typography, Stack } from "@mui/material"
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined"
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined"

export default function PerformanceCard() {
  return (
    <Box>
      <Paper
        sx={{
          borderRadius: 3,
          bgcolor: "#0C1116",
          border: "1px solid #1E2733",
          p: 2.5,
          height: 260,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={6}>
          <EmojiEventsOutlinedIcon sx={{ color: "#22C55E" }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Desempenho dos Profissionais
          </Typography>
        </Stack>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            gap: 1
          }}
        >
          <GroupOutlinedIcon sx={{ fontSize: 40 }} />
          <Typography variant="body2">
            Nenhum dado de desempenho disponível
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
