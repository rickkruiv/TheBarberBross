import React, { useMemo, useState } from "react"
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { fetchAgendamentos } from "../../services/agendamentos"
import { useDashboard } from "../../services/dashboard"
import SummaryCards from "../../components/SummaryCards/SummaryCards"
import WeeklyChart from "../../components/WeeklyChart/WeeklyChart"
import RevenueChart from "../../components/RevenueChart/RevenueChart"
import PeakHoursChart from "../../components/PeakHoursChart/PeakHoursChart"
import PerformanceCard from "../../components/PerformanceCard/PerformanceCard"

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("mes")

  const { data: agendamentosData } = useQuery({
    queryKey: ["agendamentos-dashboard"],
    queryFn: () => fetchAgendamentos()
  })

  const { data: dashboardData } = useDashboard()

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

      <SummaryCards serverSummary={serverSummary} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 3
        }}
      >
        <WeeklyChart weeklyData={weeklyData} />
        <RevenueChart serviceRevenueData={serviceRevenueData} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <PeakHoursChart peakHoursData={peakHoursData} />
        <PerformanceCard />
      </Box>
    </Box>
  )
}
