import React from "react"
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  TablePagination
} from "@mui/material"
import Search from "@mui/icons-material/Search"
import EventAvailable from "@mui/icons-material/EventAvailable"
import CalendarToday from "@mui/icons-material/CalendarToday"
import DoneAll from "@mui/icons-material/DoneAll"
import PendingActions from "@mui/icons-material/PendingActions"
import CheckCircle from "@mui/icons-material/CheckCircle"
import Refresh from "@mui/icons-material/Refresh"
import EditIcon from "@mui/icons-material/EditOutlined"
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchAgendamentos, deleteAgendamento, updateStatusAgendamento } from "../../services/agendamentos"
import StatCard from "../../components/StatCard/StatCard"
import { toastError, toastSuccess } from "../../services/toast"
import AgendamentoModal from "../../components/modals/ApointmentDetailModal"
import StatusSelect from "../../components/statusSelect/statusSelect"
import DefaultLoading from "../../components/loading/DefaultLoading"
import { TableSortLabel } from "@mui/material"

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

export default function AgendamentosList() {
  const navigate = useNavigate()
  const [q, setQ] = React.useState("")
  const [modalOpen, setModalOpen] = React.useState(false)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = React.useState(null)
  const [order, setOrder] = React.useState("asc")
  const [orderBy, setOrderBy] = React.useState("cliente.nome")
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const headCells = [
    { id: "cliente.nome", label: "Cliente", width: "18%" },
    { id: "servicos[0].nome", label: "Serviço", width: "18%" },
    { id: "funcionario.nome", label: "Profissional", width: "18%" },
    { id: "dataHorario", label: "Data", width: "10%" },
    { id: "dataHorario", label: "Hora", width: "8%" },
    { id: "status", label: "Status", width: "10%" },
    { id: "valorTotal", label: "Valor", width: "8%" }
  ];

  function getValueByPath(obj, path) {
    try {
      return path.split('.').reduce((acc, curr) => {
        if (curr.includes("[")) {
          const [name, index] = curr.replace("]", "").split("[")
          return acc?.[name]?.[index]
        }
        return acc?.[curr]
      }, obj)
    } catch {
      return ""
    }
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["agendamentos/empresaId=7"],
    queryFn: () => fetchAgendamentos(),
    staleTime: 30000
  })

  async function atualizarStatus(agendamentoId, novoStatus) {
    try {
      await updateStatusAgendamento(agendamentoId, 7, novoStatus)
      toastSuccess("Status atualizado com sucesso")
      refetch()
    } catch {
      toastError("Erro ao atualizar status")
    }
  }

  const list = Array.isArray(data) ? data : data?.data || []

  React.useEffect(() => {
    if (isError) toastError("Falha ao carregar agendamentos")
  }, [isError])

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return list
    return list.filter(a => {
      const cliente = a.cliente?.nome?.toLowerCase() || ""
      const telefone = a.cliente?.telefone?.toLowerCase() || ""
      const servicos = a.servicos?.[0]?.nome?.toLowerCase() || ""
      const profissional = a.funcionario?.nome?.toLowerCase() || ""
      return (
        cliente.includes(term) ||
        telefone.includes(term) ||
        servicos.includes(term) ||
        profissional.includes(term)
      )
    })
  }, [q, list])

  const total = list.length
  const pendentes = list.filter(a => a.status === "PENDENTE").length
  const confirmados = list.filter(a => a.status === "EM_ANDAMENTO").length
  const concluidos = list.filter(a => a.status === "CONCLUIDO").length

  async function handleDelete(agendamentoId) {
    const ok = window.confirm("Deseja realmente excluir este agendamento?")
    if (!ok) return
    try {
      await deleteAgendamento(agendamentoId, 7)
      toastSuccess("Agendamento excluído com sucesso")
      refetch()
    } catch {
      toastError("Falha ao excluir agendamento")
    }
  }

  function descendingComparator(a, b, orderBy) {
    const v1 = getValueByPath(a, orderBy)
    const v2 = getValueByPath(b, orderBy)
    if (v2 < v1) return -1
    if (v2 > v1) return 1
    return 0
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          fullWidth
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar por cliente, telefone, serviço ou profissional..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="contained"
          startIcon={<EventAvailable />}
          onClick={() => navigate("/agenda/novo")}
          sx={{
            bgcolor: "#62B6A5",
            color: "#0B1117",
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: "#58a897" },
            width: "250px",
            p: 1.4
          }}
        >
          NOVO AGENDAMENTO
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: "1 1 180px" }}>
          <StatCard title="Total" value={total} icon={<CalendarToday />} />
        </Box>
        <Box sx={{ flex: "1 1 180px" }}>
          <StatCard title="Confirmados" value={confirmados} icon={<DoneAll />} dot />
        </Box>
        <Box sx={{ flex: "1 1 180px" }}>
          <StatCard title="Pendentes" value={pendentes} icon={<PendingActions />} dot />
        </Box>
        <Box sx={{ flex: "1 1 180px" }}>
          <StatCard title="Concluídos" value={concluidos} icon={<CheckCircle />} dot />
        </Box>
      </Box>

      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid #1E2733",
          bgcolor: "#0C1116"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}
        >
          <Typography variant="h6" fontWeight={800}>
            Agendamentos
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
          >
            Atualizar
          </Button>
        </Box>

        {isLoading ? (
          <DefaultLoading loadMessage="Carregando agendamentos..." />
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Box sx={{ textAlign: "center", maxWidth: 420 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: "1px dashed #2b3544",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2
                }}
              >
                <EventAvailable sx={{ fontSize: 32, color: "#4b5565" }} />
              </Box>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                Nenhum agendamento cadastrado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Comece criando seu primeiro agendamento
              </Typography>
              <Button
                variant="contained"
                startIcon={<EventAvailable />}
                onClick={() => navigate("/agenda/novo")}
                sx={{
                  bgcolor: "#62B6A5",
                  color: "#0B1117",
                  "&:hover": { bgcolor: "#58a897" }
                }}
              >
                Criar Agendamento
              </Button>
            </Box>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map(column => (
                  <TableCell
                    key={column.id}
                    sx={{ width: column.width, maxWidth: column.width }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleRequestSort(null, column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="right" width={"10%"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => (
                  <TableRow
                    key={row.agendamentoId}
                    onClick={() => {
                      setAgendamentoSelecionado(row)
                      setModalOpen(true)
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{row.cliente?.nome || "-"}</TableCell>
                    <TableCell>
                      {row.servicos && row.servicos.length > 0
                        ? `${row.servicos[0].nome}${row.servicos.length > 1 ? " + ..." : ""}`
                        : "-"}
                    </TableCell>
                    <TableCell>{row.funcionario?.nome || "-"}</TableCell>
                    <TableCell>{formatDate(row.dataHorario)}</TableCell>
                    <TableCell>{formatTime(row.dataHorario)}</TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <StatusSelect
                        status={row.status}
                        onChange={(novoStatus) => atualizarStatus(row.agendamentoId, novoStatus)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatBRL(row.valorTotal)}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/agenda/${row.agendamentoId}/editar`)
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(row.agendamentoId)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
        />
      </Paper>

      <AgendamentoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        agendamentoSelecionado={agendamentoSelecionado}
        formatBRL={formatBRL}
        formatDate={formatDate}
        formatTime={formatTime}
      />
    </Box>
  )
}
