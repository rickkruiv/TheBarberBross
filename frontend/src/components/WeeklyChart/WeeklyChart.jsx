import React from "react"
import { Box, Paper, Typography, Stack } from "@mui/material"
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const chartCardSx = {
  borderRadius: 3,
  bgcolor: "#0C1116",
  border: "1px solid #1E2733",
  p: 2.5,
  height: 320,
  display: "flex",
  flexDirection: "column"
}

export default function WeeklyChart({ weeklyData }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Paper sx={chartCardSx}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <QueryStatsOutlinedIcon sx={{ color: "#22C55E" }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Agendamentos por Dia da Semana
          </Typography>
        </Stack>
        <Box sx={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="dia" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="qtd" radius={[4, 4, 0, 0]} fill="#62B6A5" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  )
}
