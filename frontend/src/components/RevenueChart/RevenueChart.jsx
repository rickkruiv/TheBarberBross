import React from "react"
import { Box, Paper, Typography, Stack } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined"
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

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
})

export default function RevenueChart({ serviceRevenueData }) {
  const theme = useTheme();
  return (
    <Box sx={{ flex: 1 }}>
      <Paper sx={chartCardSx}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <ContentCutOutlinedIcon sx={{ color: "#38BDF8" }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Receita por Serviço
          </Typography>
        </Stack>
        <Box sx={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceRevenueData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis type="number" stroke={theme.palette.text.secondary} tickFormatter={v => currencyFormatter.format(v)} />
              <YAxis dataKey="servico" type="category" stroke={theme.palette.text.secondary} width={80} />
              <Tooltip cursor={{fill: 'transparent'}} formatter={value => currencyFormatter.format(value)} labelFormatter={label => `Serviço: ${label}`} contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider, color: theme.palette.text.primary }} />
              <Bar dataKey="valor" radius={[0, 4, 4, 0]} fill="#38BDF8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  )
}
