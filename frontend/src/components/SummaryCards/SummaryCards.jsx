import React from "react"
import { Box, Paper, Typography, Stack } from "@mui/material"
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined"
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined"
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined"
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined"

const summaryCardSx = {
  borderRadius: 3,
  border: 1,
  borderColor: "divider",
  p: 2.5
}

const headerIconBox = {
  width: 36,
  height: 36,
  borderRadius: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
})

export default function SummaryCards({ serverSummary }) {
  if (!serverSummary) return null;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
      <Box sx={{ flex: "1 1 220px", minWidth: 220 }}>
        <Paper sx={summaryCardSx}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" color="text.secondary">Receita Total</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {currencyFormatter.format(serverSummary.receitaTotal)}
              </Typography>
              <Typography variant="caption" color="text.secondary">-</Typography>
            </Box>
            <Box sx={{ ...headerIconBox, bgcolor: (theme) => theme.palette.mode === "dark" ? "#0F172A" : "rgba(15, 23, 42, 0.05)", color: (theme) => theme.palette.mode === "dark" ? "inherit" : "#0F172A" }}>
              <MonetizationOnOutlinedIcon />
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ flex: "1 1 220px", minWidth: 220 }}>
        <Paper sx={summaryCardSx}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" color="text.secondary">Agendamentos</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>{serverSummary.agendamentos}</Typography>
              <Typography variant="caption" color="text.secondary">-</Typography>
            </Box>
            <Box sx={{ ...headerIconBox, bgcolor: (theme) => theme.palette.mode === "dark" ? "#0B1120" : "rgba(11, 17, 32, 0.05)", color: (theme) => theme.palette.mode === "dark" ? "inherit" : "#0B1120" }}>
              <EventAvailableOutlinedIcon />
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ flex: "1 1 220px", minWidth: 220 }}>
        <Paper sx={summaryCardSx}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" color="text.secondary">Ticket Médio</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {currencyFormatter.format(serverSummary.ticketMedio)}
              </Typography>
              <Typography variant="caption" color="text.secondary">-</Typography>
            </Box>
            <Box sx={{ ...headerIconBox, bgcolor: (theme) => theme.palette.mode === "dark" ? "#1E1B4B" : "rgba(30, 27, 75, 0.05)", color: (theme) => theme.palette.mode === "dark" ? "inherit" : "#1E1B4B" }}>
              <PaymentsOutlinedIcon />
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ flex: "1 1 220px", minWidth: 220 }}>
        <Paper sx={summaryCardSx}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" color="text.secondary">Taxa de Ocupação</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {serverSummary.taxaOcupacao.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">-</Typography>
            </Box>
            <Box sx={{ ...headerIconBox, bgcolor: (theme) => theme.palette.mode === "dark" ? "#1D0033" : "rgba(29, 0, 51, 0.05)", color: (theme) => theme.palette.mode === "dark" ? "inherit" : "#1D0033" }}>
              <TrendingUpOutlinedIcon />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
