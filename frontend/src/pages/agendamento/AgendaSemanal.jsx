import React from "react"
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Chip
} from "@mui/material"
import ChevronLeft from "@mui/icons-material/ChevronLeft"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Today from "@mui/icons-material/Today"
import AccessTime from "@mui/icons-material/AccessTime"
import CalendarMonth from "@mui/icons-material/CalendarMonth"
import { useQuery } from "@tanstack/react-query"
import { fetchAgendamentos } from "../../services/agendamentos"
import { fetchServices } from "../../services/services"
import { fetchEmployees } from "../../services/employees"
import { toastError } from "../../services/toast"
import AgendamentoModal from "../../components/modals/ApointmentDetailModal";
import DefaultLoading from "../../components/loading/DefaultLoading"

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30"
]

function startOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return d
}

function addDays(date, days) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() + days)
  return d
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatWeekRange(weekStart) {
  const weekEnd = addDays(weekStart, 6)
  const startStr = weekStart.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  })
  const endStr = weekEnd.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  })
  const yearStr =
    weekStart.getFullYear() === weekEnd.getFullYear()
      ? weekStart.getFullYear()
      : `${weekStart.getFullYear()} / ${weekEnd.getFullYear()}`
  return `${startStr} - ${endStr} de ${yearStr}`
}

function formatDayNumber(date) {
  return date.getDate()
}

function formatDayMonthShort(date) {
  const d = String(date.getDate()).padStart(2, "0")
  const m = String(date.getMonth() + 1).padStart(2, "0")
  return `${d}/${m}`
}

function formatDate(value) {
  if (!value) return "-"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleDateString("pt-BR")
}

function formatTime(value) {
  if (!value) return "-"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

function formatBRL(value) {
  if (value == null) return "R$ 0,00"
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}


function getStatusBg(status) {
  if (status === "EM_ANDAMENTO") return "#22c55e33"
  if (status === "PENDENTE") return "#f9731633"
  if (status === "CONCLUIDO") return "#0ea5e933"
  if (status === "CANCELADO") return "#ef444433"
  return "#1f293333"
}

function getStatusBorder(status) {
  if (status === "EM_ANDAMENTO") return "#22c55e"
  if (status === "PENDENTE") return "#f97316"
  if (status === "CONCLUIDO") return "#0ea5e9"
  if (status === "CANCELADO") return "#ef4444"
  return "#4b5563"
}

function getStatusLabel(status) {
  if (status === "EM_ANDAMENTO") return "Confirmado"
  if (status === "PENDENTE") return "Pendente"
  if (status === "CONCLUIDO") return "Concluído"
  if (status === "CANCELADO") return "Cancelado"
  return status || "-"
}

function getDateKeyFromDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getDateKeyFromIso(iso) {
  if (!iso) return ""
  const m = iso.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : ""
}

function getTimeFromIso(iso) {
  if (!iso) return ""
  const m = iso.match(/T(\d{2}):(\d{2})/)
  return m ? `${m[1]}:${m[2]}` : ""
}

export default function AgendaSemanal() {
  const [weekStart, setWeekStart] = React.useState(startOfWeek(new Date()))
  const [barbeiroId, setBarbeiroId] = React.useState("")
  const [servicosId, setservicosId] = React.useState("")
  const [selectedDayIndex, setSelectedDayIndex] = React.useState(0)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = React.useState(null)

  const {
    data: agendaData,
    isLoading: loadingAgenda,
    isError: errorAgenda
  } = useQuery({
    queryKey: [`agendamentos/empresaId=7`], // fazer por passagem de parametros dps
    queryFn: () => fetchAgendamentos(),
    staleTime: 30000
  })

  const {
    data: servicesData,
    isLoading: loadingServices,
    isError: errorServices
  } = useQuery({
    queryKey: ["services-all"],
    queryFn: () => fetchServices()
  })

  const {
    data: employeesData,
    isLoading: loadingEmployees,
    isError: errorEmployees
  } = useQuery({
    queryKey: ["employees-all"],
    queryFn: () => fetchEmployees()
  })

  React.useEffect(() => {
    if (errorAgenda || errorServices || errorEmployees) {
      toastError("Falha ao carregar dados da agenda")
    }
  }, [errorAgenda, errorServices, errorEmployees])

  const agendamentos = Array.isArray(agendaData)
    ? agendaData
    : agendaData?.data || []
  const services = Array.isArray(servicesData)
    ? servicesData
    : servicesData?.data || []
  const employees = Array.isArray(employeesData)
    ? employeesData
    : employeesData?.data || []

  const isLoading = loadingAgenda || loadingServices || loadingEmployees

  const weekDates = React.useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart]
  )

  const weekKeys = React.useMemo(
    () => weekDates.map(d => getDateKeyFromDate(d)),
    [weekDates]
  )

  const filteredAgendamentos = React.useMemo(() => {
    return agendamentos.filter(a => {
      const dayKey = getDateKeyFromIso(a.dataHorario)
      if (!dayKey) return false
      if (!weekKeys.includes(dayKey)) return false
      if (barbeiroId && String(a.funcionario?.funcionarioId) !== barbeiroId)
        return false
      if (servicosId && !(a.servicos || []).some(s => String(s.servicosId) === servicosId)) return false
      return true
    })
  }, [agendamentos, weekKeys, barbeiroId, servicosId])

  const agendamentosPorDia = React.useMemo(() => {
    const map = {}
    filteredAgendamentos.forEach(a => {
      const dayKey = getDateKeyFromIso(a.dataHorario)
      if (!dayKey) return
      if (!map[dayKey]) map[dayKey] = []
      map[dayKey].push(a)
    })
    return map
  }, [filteredAgendamentos])

  const slotsMap = React.useMemo(() => {
    const map = {}
    filteredAgendamentos.forEach(a => {
      const dayKey = getDateKeyFromIso(a.dataHorario)
      const time = getTimeFromIso(a.dataHorario)
      if (!dayKey || !time) return
      const dayIndex = weekKeys.indexOf(dayKey)
      if (dayIndex < 0 || dayIndex > 6) return
      const key = `${time}-${dayIndex}`
      if (!map[key]) map[key] = []
      map[key].push(a)
    })
    return map
  }, [filteredAgendamentos, weekKeys])

  return (
    
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      
      {isLoading ? (
        <DefaultLoading loadMessage="Carregando agenda..."/>
      ) : (
        <>
        <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "stretch", md: "center" },
                  justifyContent: "space-between",
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    border: "1px solid #1E2733",
                    bgcolor: "#0C1116",
                    minWidth: 0
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setWeekStart(prev => addDays(prev, -7))
                      setSelectedDayIndex(0)
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarMonth sx={{ fontSize: 20, color: "#62B6A5" }} />
                    <Typography fontWeight={700} noWrap>
                      {formatWeekRange(weekStart)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setWeekStart(prev => addDays(prev, 7))
                      setSelectedDayIndex(0)
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                  <Box sx={{ flex: 1 }} />
                  <Button
                    size="small"
                    startIcon={<Today />}
                    onClick={() => {
                      const today = new Date()
                      const start = startOfWeek(today)
                      setWeekStart(start)
                      setSelectedDayIndex(today.getDay())
                    }}
                    sx={{
                      ml: 1,
                      borderRadius: 999,
                      textTransform: "none",
                      borderColor: "#1E2733"
                    }}
                    variant="outlined"
                  >
                    Hoje
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    minWidth: { xs: "100%", md: 480 }
                  }}
                >
                  <TextField
                    select
                    fullWidth
                    label="Todos os barbeiros"
                    value={barbeiroId}
                    onChange={e => setBarbeiroId(e.target.value)}
                  >
                    <MenuItem value="">Todos os barbeiros</MenuItem>
                    {employees.map(emp => (
                      <MenuItem key={emp.funcionarioId} value={String(emp.funcionarioId)}>
                        {emp.nome}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Todos os serviços"
                    value={servicosId}
                    onChange={e => setservicosId(e.target.value)}
                  >
                    <MenuItem value="">Todos os serviços</MenuItem>
                    {services.map(s => (
                      <MenuItem key={s.servicosId} value={String(s.servicosId)}>
                        {s.nome}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  pb: 1
                }}
              >
                {weekDates.map((date, index) => {
                  const key = getDateKeyFromDate(date)
                  const count = agendamentosPorDia[key]?.length || 0
                  const isToday = sameDay(date, new Date())
                  const isSelected = index === selectedDayIndex
                  return (
                    <Box
                      key={key}
                      onClick={() => setSelectedDayIndex(index)}
                      sx={{
                        flex: "0 0 120px",
                        borderRadius: 2,
                        p: 2,
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: isSelected ? "#62B6A5" : isToday ? "#374151" : "#1E2733",
                        bgcolor: isSelected ? "#132022" : "#0C1116",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0.5,
                        transition: "all 0.15s ease-in-out"
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: "uppercase" }}
                      >
                        {WEEK_DAYS[date.getDay()]}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: "#E5E7EB" }}
                      >
                        {formatDayNumber(date)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDayMonthShort(date)}
                      </Typography>
                      <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16, color: "#9CA3AF" }} />
                        <Typography variant="caption" color="text.secondary">
                          {count} agendamentos
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>

              <Paper
                sx={{
                  borderRadius: 2,
                  border: "1px solid #1E2733",
                  bgcolor: "#05070B",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid #1E2733",
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <AccessTime sx={{ fontSize: 18, color: "#62B6A5" }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Agenda Semanal
                  </Typography>
                </Box>

                <Box
                  sx={{
                    overflowX: "auto"
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 960
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        borderBottom: "1px solid #1E2733",
                        bgcolor: "#0B1117"
                      }}
                    >
                      <Box
                        sx={{
                          width: 92,
                          px: 2,
                          py: 1.5,
                          borderRight: "1px solid #1E2733",
                          display: "flex",
                          alignItems: "center",
                          gap: 1
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Horário
                        </Typography>
                      </Box>
                      {weekDates.map((date, index) => {
                        const isToday = sameDay(date, new Date())
                        const isSelected = index === selectedDayIndex
                        return (
                          <Box
                            key={index}
                            sx={{
                              flex: 1,
                              px: 2,
                              py: 1.5,
                              borderRight:
                                index < 6 ? "1px solid #1E2733" : "1px solid transparent",
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.2,
                              bgcolor: isSelected
                                ? "#111827"
                                : isToday
                                ? "#050816"
                                : "transparent"
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textTransform: "uppercase" }}
                            >
                              {WEEK_DAYS[date.getDay()]}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {formatDayMonthShort(date)}
                            </Typography>
                          </Box>
                        )
                      })}
                    </Box>

                    <Box
                      sx={{
                        maxHeight: 480,
                        overflowY: "auto"
                      }}
                    >
                      {TIME_SLOTS.map(slot => (
                        <Box
                          key={slot}
                          sx={{
                            display: "flex",
                            borderBottom: "1px solid #111827",
                            minHeight: 54
                          }}
                        >
                          <Box
                            sx={{
                              width: 92,
                              px: 2,
                              py: 1.5,
                              borderRight: "1px solid #1E2733",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75
                            }}
                          >
                            <AccessTime sx={{ fontSize: 16, color: "#6B7280" }} />
                            <Typography variant="body2" color="text.secondary">
                              {slot}
                            </Typography>
                          </Box>
                          {weekDates.map((_, dayIndex) => {
                            const key = `${slot}-${dayIndex}`
                            const aps = slotsMap[key] || []
                            const hasAny = aps.length > 0
                            const first = aps[0]
                            const isSelected = dayIndex === selectedDayIndex
                            return (
                              <Box
                                key={dayIndex}
                                sx={{
                                  flex: 1,
                                  borderRight:
                                    dayIndex < 6
                                      ? "1px solid #1E2733"
                                      : "1px solid transparent",
                                  display: "flex",
                                  alignItems: "stretch",
                                  justifyContent: "stretch",
                                  px: 0.5,
                                  py: 0.5,
                                  bgcolor: isSelected ? "#05070F" : "transparent"
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "100%",
                                    borderRadius: 1,
                                    border: hasAny
                                      ? `1px solid ${getStatusBorder(first?.status)}`
                                      : "1px dashed #111827",
                                    bgcolor: hasAny ? getStatusBg(first?.status) : "transparent",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    px: hasAny ? 1 : 0,
                                    py: hasAny ? 0.75 : 0
                                  }}
                                >
                                  {hasAny && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.25,
                                        width: "100%",
                                        overflow: "hidden"
                                      }}
                                      onClick={() => {
                                        setAgendamentoSelecionado(first);
                                        setModalOpen(true);
                                      }}
                                      style={{cursor: "pointer"}}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontWeight: 700,
                                          whiteSpace: "wrap",
                                          textOverflow: "ellipsis",
                                          overflow: "hidden"
                                        }}
                                      >
                                        {first.cliente?.nome || "-"}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                          whiteSpace: "normal",
                                          textOverflow: "ellipsis",
                                          overflow: "hidden"
                                        }}
                                      >
                                        {(first.servicos || []).length === 1
                                          ? first.servicos[0].nome
                                          : (first.servicos || []).length > 1
                                            ? first.servicos[0].nome + " + ..."
                                            : "-"
                                        }
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.primary"
                                        sx={{
                                          fontWeight: 700,
                                          whiteSpace: "normal",
                                          wordBreak: "break-word",
                                          overflow: "hidden"
                                        }}
                                      >
                                        {first.funcionario.nome}
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          gap: 1,
                                          mt: 0.25
                                        }}
                                      >
                                        <Chip
                                          label={getStatusLabel(first.status)}
                                          size="small"
                                          sx={{
                                            height: 20,
                                            fontSize: 10,
                                            bgcolor: "transparent",
                                            borderColor: getStatusBorder(first.status),
                                            color: getStatusBorder(first.status)
                                          }}
                                          variant="outlined"
                                        />
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    borderTop: "1px solid #111827",
                    px: 3,
                    py: 2,
                    display: "flex",
                    justifyContent: "center",
                    gap: 4,
                    bgcolor: "#05070B"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "3px",
                        bgcolor: getStatusBorder("EM_ANDAMENTO")
                      }}
                    />
                    <Typography variant="caption">Confirmado</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "3px",
                        bgcolor: getStatusBorder("PENDENTE")
                      }}
                    />
                    <Typography variant="caption">Pendente</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "3px",
                        bgcolor: getStatusBorder("CONCLUIDO")
                      }}
                    />
                    <Typography variant="caption">Concluído</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "3px",
                        bgcolor: getStatusBorder("CANCELADO")
                      }}
                    />
                    <Typography variant="caption">Cancelado</Typography>
                  </Box>
                </Box>
              </Paper>

              <AgendamentoModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                agendamentoSelecionado={agendamentoSelecionado}
                formatBRL={formatBRL}
                formatDate={formatDate}
                formatTime={formatTime}
              />
        </>

      )}
      
    </Box>
  )
}
