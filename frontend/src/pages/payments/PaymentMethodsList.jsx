import React, { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  InputAdornment
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"
import PaymentsIcon from "@mui/icons-material/Payments"
import SearchIcon from "@mui/icons-material/Search"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPayments, createPayment, updatePayment, deletePayment } from "../../services/payment"
import { toastError, toastSuccess } from "../../services/toast"
import DefaultLoading from "../../components/loading/DefaultLoading"

const METHOD_OPTIONS = [
  { code: "DINHEIRO", label: "Dinheiro", icon: "💵" },
  { code: "CARTAO_CREDITO", label: "Cartão de Crédito", icon: "💳" },
  { code: "CARTAO_DEBITO", label: "Cartão de Débito", icon: "💳" },
  { code: "PIX", label: "PIX", icon: "📱" }
]

const ACTIVE_STATUS = "EM_ANDAMENTO"
const INACTIVE_STATUS = "CANCELADO"

const getMethodLabel = code => METHOD_OPTIONS.find(o => o.code === code)?.label || code
const getMethodIcon = code => METHOD_OPTIONS.find(o => o.code === code)?.icon || "💰"

const PaymentMethodsList = () => {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState(false)
  const [editingMethod, setEditingMethod] = useState(null)
  const [methodCode, setMethodCode] = useState(METHOD_OPTIONS[0].code)
  const [fee, setFee] = useState("0")
  const [search, setSearch] = useState("")

  const {
    data: methods = [],
    isPending
  } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
    onError: () => toastError("Erro ao carregar métodos de pagamento")
  })

  const filteredMethods = methods.filter(method =>
    getMethodLabel(method.code).toLowerCase().includes(search.toLowerCase())
  )

  const totalMethods = methods.length
  const activeMethods = methods.filter(m => m.status === ACTIVE_STATUS).length
  const inactiveMethods = methods.filter(m => m.status === INACTIVE_STATUS).length

  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toastSuccess("Método criado com sucesso")
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      setOpenModal(false)
    },
    onError: () => toastError("Erro ao criar método de pagamento")
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePayment(id, data),
    onSuccess: () => {
      toastSuccess("Método atualizado com sucesso")
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      setOpenModal(false)
    },
    onError: () => toastError("Erro ao atualizar método de pagamento")
  })

  const deleteMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      toastSuccess("Método removido com sucesso")
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    },
    onError: () => toastError("Erro ao remover método de pagamento")
  })

  const handleOpenNew = () => {
    setEditingMethod(null)
    setMethodCode(METHOD_OPTIONS[0].code)
    setFee("0")
    setOpenModal(true)
  }

  const handleOpenEdit = method => {
    setEditingMethod(method)
    setMethodCode(method.code)
    setFee(String(method.fee))
    setOpenModal(true)
  }

  const handleCloseModal = () => setOpenModal(false)

  const handleSubmit = () => {
    if (!methodCode) {
      toastError("Selecione o método de pagamento")
      return
    }

    const parsedFee = Number(fee.replace(",", "."))
    const payload = {
      code: methodCode,
      fee: isNaN(parsedFee) ? 0 : parsedFee,
      status: editingMethod?.status || ACTIVE_STATUS
    }

    if (editingMethod) {
      updateMutation.mutate({ id: editingMethod.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleToggleStatus = method => {
    const nextStatus = method.status === ACTIVE_STATUS ? INACTIVE_STATUS : ACTIVE_STATUS
    const payload = {
      code: method.code,
      fee: method.fee,
      status: nextStatus
    }
    updateMutation.mutate({ id: method.id, data: payload })
  }

  const handleDelete = method => {
    if (window.confirm("Deseja realmente excluir este método de pagamento?")) {
      deleteMutation.mutate(method.id)
    }
  }

  if (isPending) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <DefaultLoading/>
      </Box>
    )
  }

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Box width="100%" maxWidth={1200}>
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.4)"
                }}
              >
                <PaymentsIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  Métodos de Pagamento
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure as formas de pagamento aceitas pela barbearia
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenNew}
              sx={{ borderRadius: 20, px: 3 }}
            >
              NOVO MÉTODO
            </Button>
          </CardContent>
        </Card>

        <Box
          sx={{
            mb: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2
          }}
        >
          <Card sx={{ borderRadius: 3, width: "100%", height: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total de Métodos
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {totalMethods}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.4)"
                }}
              >
                <PaymentsIcon />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, width: "100%", height: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Métodos Ativos
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {activeMethods}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.4)"
                }}
              >
                <PaymentsIcon />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, width: "100%", height: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Métodos Inativos
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {inactiveMethods}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.4)"
                }}
              >
                <PaymentsIcon />
              </Box>
            </CardContent>
          </Card>
        </Box>


        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: theme => `1px solid ${theme.palette.divider}`
              }}
            >
              <TextField
                fullWidth
                placeholder="Buscar por nome..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Método</TableCell>
                  <TableCell>Taxa (%)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMethods.map(method => (
                  <TableRow key={method.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "action.hover"
                          }}
                        >
                          <Typography fontSize={20}>{getMethodIcon(method.code)}</Typography>
                        </Box>
                        <Typography>{getMethodLabel(method.code)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {method.fee > 0 ? (
                        <Typography sx={{ color: "warning.main", fontWeight: 500 }}>
                          {method.fee}%
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "success.main" }}>Sem taxa</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Switch
                          checked={method.status === ACTIVE_STATUS}
                          onChange={() => handleToggleStatus(method)}
                        />
                        <Typography>{method.status === ACTIVE_STATUS ? "Ativo" : "Inativo"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenEdit(method)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(method)}>
                        <DeleteIcon sx={{ color: "error.main" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMethods.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box p={3}>
                        <Typography>Nenhum método de pagamento encontrado.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingMethod ? "Editar Método de Pagamento" : "Novo Método de Pagamento"}
            <IconButton
              onClick={handleCloseModal}
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                select
                label="Nome do Método"
                fullWidth
                value={methodCode}
                onChange={e => setMethodCode(e.target.value)}
              >
                {METHOD_OPTIONS.map(option => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Taxa (%)"
                type="number"
                fullWidth
                value={fee}
                onChange={e => setFee(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingMethod ? "Salvar" : "Adicionar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default PaymentMethodsList
