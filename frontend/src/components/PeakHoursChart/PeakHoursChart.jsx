import React from "react"
import { Box, Paper, Typography, Stack } from "@mui/material"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const chartCardSx = {
  borderRadius: 3,
  bgcolor: "#0C1116",
  border: "1px solid #1E2733",
  p: 2.5,
  height: 320,
  display: "flex",
  flexDirection: "column"
}

export default function PeakHoursChart({ peakHoursData }) {
  return (
    <Box>
      <Paper sx={chartCardSx}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <AccessTimeOutlinedIcon sx={{ color: "#22C55E" }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Horários de Pico
          </Typography>
        </Stack>
        <Box sx={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="hora" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="qtd" stroke="#22C55E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  )
}
