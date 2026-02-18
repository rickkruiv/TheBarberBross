import React, { useMemo, useState } from "react"
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Stack
} from "@mui/material"
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined"
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined"
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined"
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined"
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined"
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined"
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from "recharts"
import { useQuery } from "@tanstack/react-query"
import { fetchAgendamentos } from "../../services/agendamentos"
import { fetchDashboard } from "../../services/dashboard"

const summaryCardSx = {
  borderRadius: 3,
  bgcolor: "#0C1116",
  border: "1px solid #1E2733",
  p: 2.5
}

const chartCardSx = {
  borderRadius: 3,
  bgcolor: "#0C1116",
  border: "1px solid #1E2733",
  p: 2.5,
  height: 320,
  display: "flex",
  flexDirection: "column"
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

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("mes")

  const { data: agendamentosData } = useQuery({
    queryKey: ["agendamentos-dashboard"],
    queryFn: () => fetchAgendamentos()
  })

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => fetchDashboard()
  })

  const filteredAgendamentos = useMemo(() => {
    const list = Array.isArray(agendamentosData)
      ? agendamentosData
      : agendamentosData?.data || []
    if (!list.length) return []
    const now = new Date()
    let start
    if (periodo === "mes") {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (periodo === "30d") {
      start = new Date(now)
      start.setDate(start.getDate() - 30)
    } else if (periodo === "7d") {
      start = new Date(now)
      start.setDate(start.getDate() - 7)
    } else {
      start = new Date(0)
    }
    return list.filter(a => {
      if (!a.dataHorario) return false
      const d = new Date(a.dataHorario)
      return d >= start && d <= now
    })
  }, [agendamentosData, periodo])

  const weeklyData = useMemo(() => {
    const base = [
      { dia: "Dom", qtd: 0 },
      { dia: "Seg", qtd: 0 },
      { dia: "Ter", qtd: 0 },
      { dia: "Qua", qtd: 0 },
      { dia: "Qui", qtd: 0 },
      { dia: "Sex", qtd: 0 },
      { dia: "Sáb", qtd: 0 }
    ]
    filteredAgendamentos.forEach(a => {
      if (!a.dataHorario) return
      const d = new Date(a.dataHorario)
      const idx = d.getDay()
      if (base[idx]) base[idx].qtd += 1
    })
    return base
  }, [filteredAgendamentos])

  const serviceRevenueData = useMemo(() => {
    const map = new Map()
    filteredAgendamentos.forEach(a => {
      const nomeServico = a.servico?.nome || a.servico?.descricao || "Serviço"
      const valor = Number(a.valorTotal ?? 0)
      map.set(nomeServico, (map.get(nomeServico) || 0) + valor)
    })
    return Array.from(map.entries()).map(([servico, valor]) => ({
      servico,
      valor
    }))
  }, [filteredAgendamentos])

  const peakHoursData = useMemo(() => {
    const base = [
      { hora: "09h", qtd: 0 },
      { hora: "10h", qtd: 0 },
      { hora: "11h", qtd: 0 },
      { hora: "12h", qtd: 0 },
      { hora: "13h", qtd: 0 },
      { hora: "14h", qtd: 0 },
      { hora: "15h", qtd: 0 },
      { hora: "16h", qtd: 0 },
      { hora: "17h", qtd: 0 },
      { hora: "18h", qtd: 0 }
    ]
    filteredAgendamentos.forEach(a => {
      if (!a.dataHorario) return
      const d = new Date(a.dataHorario)
      const hour = d.getHours()
      const label = `${String(hour).padStart(2, "0")}h`
      const slot = base.find(b => b.hora === label)
      if (slot) slot.qtd += 1
    })
    return base
  }, [filteredAgendamentos])

  const serverSummary = {
    receitaTotal: Number(dashboardData?.receitaTotal ?? 0),
    agendamentos: Number(dashboardData?.agendamentos ?? 0),
    ticketMedio: Number(dashboardData?.ticketMedio ?? 0),
    taxaOcupacao: Number(dashboardData?.taxaOcupacao ?? 0)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Dashboard Gerencial
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análise de desempenho e indicadores financeiros
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={periodo}
            onChange={e => setPeriodo(e.target.value)}
            displayEmpty
          >
            <MenuItem value="mes">Este Mês</MenuItem>
            <MenuItem value="30d">Últimos 30 dias</MenuItem>
            <MenuItem value="7d">Últimos 7 dias</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3
        }}
      >
        <Box sx={{ flex: "1 1 220px", minWidth: 220 }}>
          <Paper sx={summaryCardSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Receita Total
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {currencyFormatter.format(serverSummary.receitaTotal)}
                </Typography>
                <Typography variant="caption" color="text.secondary">-</Typography>
              </Box>
              <Box sx={{ ...headerIconBox, bgcolor: "#0F172A" }}>
                <MonetizationOnOutlinedIcon />
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ flex: "1 1 220px", minWidth: 220 }}>
          <Paper sx={summaryCardSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Agendamentos
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {serverSummary.agendamentos}
                </Typography>
                <Typography variant="caption" color="text.secondary">-</Typography>
              </Box>
              <Box sx={{ ...headerIconBox, bgcolor: "#0B1120" }}>
                <EventAvailableOutlinedIcon />
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ flex: "1 1 220px", minWidth: 220 }}>
          <Paper sx={summaryCardSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Ticket Médio
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {currencyFormatter.format(serverSummary.ticketMedio)}
                </Typography>
                <Typography variant="caption" color="text.secondary">-</Typography>
              </Box>
              <Box sx={{ ...headerIconBox, bgcolor: "#1E1B4B" }}>
                <PaymentsOutlinedIcon />
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ flex: "1 1 220px", minWidth: 220 }}>
          <Paper sx={summaryCardSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Taxa de Ocupação
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {serverSummary.taxaOcupacao.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  -
                </Typography>
              </Box>
              <Box sx={{ ...headerIconBox, bgcolor: "#1D0033" }}>
                <TrendingUpOutlinedIcon />
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 3
        }}
      >
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
                <BarChart
                  data={weeklyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="dia" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="qtd" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

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
                <BarChart
                  data={serviceRevenueData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis
                    type="number"
                    stroke="#9CA3AF"
                    tickFormatter={v => currencyFormatter.format(v)}
                  />
                  <YAxis dataKey="servico" type="category" stroke="#9CA3AF" />
                  <Tooltip
                    formatter={value => currencyFormatter.format(value)}
                    labelFormatter={label => `Serviço: ${label}`}
                  />
                  <Bar dataKey="valor" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                <LineChart
                  data={peakHoursData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="hora" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="qtd" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

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
      </Box>
    </Box>
  )
}
