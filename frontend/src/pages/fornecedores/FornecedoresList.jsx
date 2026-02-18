import React, { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/EditOutlined"
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listFornecedores, deleteFornecedor } from "../../services/fornecedores"
import { toastError, toastSuccess } from "../../services/toast"
import StatCard from "../../components/StatCard/StatCard"
import DefaultLoading from "../../components/loading/DefaultLoading"

export default function FornecedoresList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [q, setQ] = useState("")

  const {
    data: dataFornecedores,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: listFornecedores,
    staleTime: 300000
  })

  if (isError) {
    toastError("Falha ao carregar fornecedores")
  }

  const list = Array.isArray(dataFornecedores) ? dataFornecedores : dataFornecedores?.data || []

  const filtered = list.filter(f => {
    if (!q) return true
    const texto = `${f.razaoSocial || f.nome || ""} ${f.nomeFantasia || ""} ${f.cnpj || ""}`.toLowerCase()
    return texto.includes(q.toLowerCase())
  })

  const isAtivo = status =>
    status === "Ativo" || status === "ATIVO" || status === "EM_ANDAMENTO"

  const total = list.length
  const ativos = list.filter(f => isAtivo(f.status)).length
  const inativos = total - ativos

  const deleteMutation = useMutation({
    mutationFn: deleteFornecedor,
    onSuccess: () => {
      toastSuccess("Fornecedor excluído com sucesso")
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
    },
    onError: () => toastError("Erro ao excluir fornecedor")
  })

  const handleDelete = row => {
    const id = row.fornecedorId || row.id
    if (!id) return
    if (window.confirm(`Deseja realmente excluir o fornecedor "${row.razaoSocial || row.nome}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Box width="100%" maxWidth={1200}>
        <Box
          mb={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <TextField
            fullWidth
            placeholder="Buscar fornecedores..."
            value={q}
            onChange={e => setQ(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
            onClick={() => navigate("/fornecedores/cadastrar")}
          >
            Novo Fornecedor
          </Button>
        </Box>

        <Box mb={3}>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
            gap={2}
          >
            <StatCard
              title="Total de Fornecedores"
              value={total}
              icon={<LocalShippingIcon />}
            />
            <StatCard
              title="Fornecedores Ativos"
              value={ativos}
              icon={<LocalShippingIcon />}
            />
            <StatCard
              title="Fornecedores Inativos"
              value={inativos}
              icon={<LocalShippingIcon />}
            />
          </Box>
        </Box>

        <Paper
          sx={{
            borderRadius: 2,
            border: "1px solid #1E2733",
            bgcolor: "#0C1116"
          }}
        >
          {isLoading ? (
            <DefaultLoading loadMessage="Carregando fornecedores..."/>
          ) : filtered.length === 0 ? (
            <Box p={3}>
              <Typography color="text.secondary">
                Nenhum fornecedor encontrado
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fornecedor</TableCell>
                  <TableCell>CNPJ</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(row => {
                  const id = row.fornecedorId || row.id
                  const razao = row.razaoSocial || row.nome || "-"
                  const fantasia = row.nomeFantasia || ""
                  const categoria =
                    row.categoriaNome || row.categoriaProdutos || "-"
                  const telefone =
                    row.telefonePrincipal || row.telefone || "-"
                  const email = row.email || "-"
                  const status = row.status || "Ativo"
                  const ativo = isAtivo(status)

                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <Box>
                          <Typography fontWeight={600}>{razao}</Typography>
                          {fantasia && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {fantasia}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{row.cnpj || "-"}</TableCell>
                      <TableCell>{categoria}</TableCell>
                      <TableCell>{telefone}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>
                        <Box
                          px={1.5}
                          py={0.5}
                          borderRadius={999}
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            fontSize: 12,
                            bgcolor: ativo ? "success.main" : "#1E2733",
                            color: ativo ? "#0B1117" : "#CDD5DF",
                            fontWeight: 600
                          }}
                        >
                          {ativo ? "Ativo" : "Inativo"}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/fornecedores/${id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/fornecedores/${id}/editar`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(row)}
                          sx={{ color: "#ff4d4f" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </Box>
  )
}
