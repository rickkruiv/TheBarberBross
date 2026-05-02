import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from "@mui/material"
import Search from "@mui/icons-material/Search"
import Add from "@mui/icons-material/Add"
import Edit from "@mui/icons-material/Edit"
import Delete from "@mui/icons-material/Delete"
import LocalOffer from "@mui/icons-material/LocalOffer"
import StatCard from "../../components/StatCard/StatCard"
import useDebounce from "../../hooks/useDebounce"
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  TIPO_OPTIONS,
  tipoToLabel
} from "../../services/categories"
import { toastError, toastSuccess } from "../../services/toast"
import DefaultLoading from "../../shared/Loading/DefaultLoading"

function CategoryModal({ open, onClose, category, onSaved }) {
  const isEdit = !!category
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const [nome, setNome] = useState("")
  const [tipo, setTipo] = useState(TIPO_OPTIONS[0].value)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (category) {
      setNome(category.nome || "")
      setTipo(category.tipo || TIPO_OPTIONS[0].value)
    } else {
      setNome("")
      setTipo(TIPO_OPTIONS[0].value)
    }
  }, [category, open])

  const handleSubmit = async () => {
    if (!nome.trim()) {
      toastError("Informe o nome da categoria")
      return
    }
    try {
      setSaving(true)
      const payload = { nome: nome.trim(), tipo, descricao: "" }
      if (isEdit) {
        await updateMutation.mutateAsync({ id: category.categoriaId || category.id, values: payload })
        toastSuccess("Categoria atualizada com sucesso")
      } else {
        await createMutation.mutateAsync(payload)
        toastSuccess("Categoria criada com sucesso")
      }
      onSaved()
      onClose()
    } catch (e) {
      toastError(e, isEdit ? "Falha ao atualizar categoria" : "Falha ao criar categoria")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Nova Categoria</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Nome da Categoria"
            placeholder="Ex: Coloração"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
          <TextField
            fullWidth
            select
            label="Tipo"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          >
            {TIPO_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          sx={{ bgcolor: "primary.main", color: "background.default", "&:hover": { bgcolor: "text.tertiary" } }}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function SettingsCategories() {
  const [q, setQ] = useState("")
  const dq = useDebounce(q, 300)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading, isError } = useCategories()
  const deleteMutation = useDeleteCategory()

  useEffect(() => {
    if (isError) toastError("Falha ao carregar categorias")
  }, [isError])

  const list = Array.isArray(data) ? data : data?.data || []

  const filtered = list.filter(cat => {
    if (!dq) return true
    const texto = `${cat.nome || ""} ${tipoToLabel(cat.tipo)}`.toLowerCase()
    return texto.includes(dq.toLowerCase())
  })

  const total = list.length
  const servicos = list.filter(c => c.tipo === "SERVICO").length
  const produtos = list.filter(c => c.tipo === "PRODUTO").length

  const handleNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = row => {
    setEditing(row)
    setModalOpen(true)
  }

  const handleDelete = async row => {
    if (!window.confirm(`Excluir a categoria "${row.nome}"?`)) return
    deleteMutation.mutate(row.categoriaId || row.id, {
      onSuccess: () => toastSuccess("Categoria excluída com sucesso"),
      onError: (e) => toastError(e, "Falha ao excluir categoria")
    })
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 2,
          border: 1, borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <LocalOffer fontSize="small" />
            <Typography variant="h6" fontWeight={800}>Categorias</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Gerencie as categorias de serviços e produtos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNew}
          sx={{ bgcolor: "primary.main", color: "background.default", "&:hover": { bgcolor: "text.tertiary" } }}
        >
          Nova Categoria
        </Button>
      </Paper>


      <Box
        sx={{
          mb: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2
        }}
      >
        <StatCard title="Total de Categorias" value={total} icon={<LocalOffer />} />
        <StatCard title="Categorias de Serviços" value={servicos} icon={<LocalOffer />} />
        <StatCard title="Categorias de Produtos" value={produtos} icon={<LocalOffer />} />
      </Box>


      <Paper sx={{ p: 3, borderRadius: 2, border: 1, borderColor: "divider", bgcolor: "background.paper" }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por nome ou tipo..."
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {isLoading ? (
          <DefaultLoading />
        ) : filtered.length === 0 ? (
          <Box sx={{ height: 240, display: "grid", placeItems: "center" }}>
            <Typography color="text.secondary">Nenhuma categoria encontrada</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome da Categoria</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Itens Associados</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(row => {
                const itens = row.servicos?.length ?? 0
                return (
                  <TableRow key={row.categoriaId || row.id}>
                    <TableCell>{row.nome}</TableCell>
                    <TableCell>{tipoToLabel(row.tipo)}</TableCell>
                    <TableCell>
                      {itens} {itens === 1 ? "item" : "itens"}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => handleEdit(row)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        category={editing}
        onSaved={() => { }}
      />
    </Container>
  )
}
