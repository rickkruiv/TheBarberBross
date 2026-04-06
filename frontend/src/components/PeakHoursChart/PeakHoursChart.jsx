import React from "react"
import { Box, Paper, Typography, Stack } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const chartCardSx = {
  borderRadius: 3,
  border: 1,
  borderColor: "divider",
  p: 2.5,
  height: 320,
  display: "flex",
  flexDirection: "column"
}

export default function PeakHoursChart({ peakHoursData }) {
  const theme = useTheme();
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
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="hora" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider, color: theme.palette.text.primary }} />
              <Line type="monotone" dataKey="qtd" stroke="#22C55E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  )
}
