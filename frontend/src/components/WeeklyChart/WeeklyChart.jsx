import { Box, Paper, Typography, Stack } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const chartCardSx = {
  borderRadius: 3,
  border: 1,
  borderColor: "divider",
  p: 2.5,
  height: 320,
  display: "flex",
  flexDirection: "column"
}

export default function WeeklyChart({ weeklyData }) {
  const theme = useTheme();

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
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="dia" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} allowDecimals={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider, color: theme.palette.text.primary }} />
              <Bar dataKey="qtd" radius={[4, 4, 0, 0]} fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  )
}
