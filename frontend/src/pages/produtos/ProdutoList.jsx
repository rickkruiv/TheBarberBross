import React, { useMemo, useState } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { listProdutos, deleteProduto } from "../../services/produto"
import { fetchCategories } from "../../services/categories"
import { toastError, toastSuccess } from "../../services/toast"
import DefaultLoading from "../../components/loading/DefaultLoading"

export default function ProdutoList() {
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: produtosData, isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: listProdutos
  })

  const { data: categoriasData } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategories,
    staleTime: 300000
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduto,
    onSuccess: () => {
      toastSuccess("Produto removido com sucesso")
      queryClient.invalidateQueries({ queryKey: ["produtos"] })
    },
    onError: () => toastError("Erro ao remover produto")
  })

  const produtos = Array.isArray(produtosData)
    ? produtosData
    : produtosData?.data || []

  const categoriasList = Array.isArray(categoriasData)
    ? categoriasData
    : categoriasData?.data || []
  const categoriasMap = useMemo(() => {
    const map = {}
    categoriasList.forEach(c => {
      const id = c.categoriaId || c.id
      map[id] = c
    })
    return map
  }, [categoriasList])

  const filtrados = produtos.filter(p => {
    if (!search) return true
    const texto = `${p.nome || ""} ${p.marca || ""}`.toLowerCase()
    return texto.includes(search.toLowerCase())
  })

  const stats = useMemo(() => {
    let total = produtos.length
    let baixo = 0
    let sem = 0
    produtos.forEach(p => {
      const qtd = Number(p.quantidadeEstoque ?? 0)
      const min = Number(p.estoqueMinimo ?? 0)
      if (qtd <= 0) sem += 1
      else if (qtd > 0 && qtd <= min) baixo += 1
    })
    return { total, baixo, sem }
  }, [produtos])

  const getEstoqueInfo = p => {
    const qtd = Number(p.quantidadeEstoque ?? 0)
    const min = Number(p.estoqueMinimo ?? 0)
    if (qtd <= 0)
      return { label: "Sem estoque", color: "#3B1618", textColor: "#F97066" }
    if (qtd > 0 && qtd <= min)
      return { label: "Estoque baixo", color: "#422A09", textColor: "#FDB022" }
    return { label: "Estoque OK", color: "#063A2D", textColor: "#32D583" }
  }

  const handleDelete = produto => {
    if (!window.confirm(`Excluir o produto "${produto.nome}"?`)) return
    deleteMutation.mutate(produto.produtoId || produto.id)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3, display: "flex", justifyContent: "center" }}>
      <Box width="100%" maxWidth={1100}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3
          }}
        >
          <TextField
            placeholder="Buscar produtos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ maxWidth: 520, flex: 1, mr: 2 }}
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
            onClick={() => navigate("/produtos/cadastrar")}
            sx={{
              borderRadius: 20,
              px: 3,
              bgcolor: "#62B6A5",
              color: "#0B1117",
              "&:hover": { bgcolor: "#58a897" }
            }}
          >
            Novo Produto
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3
          }}
        >
          <Paper
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 2,
              border: "1px solid #1E2733",
              bgcolor: "#0C1116",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#07161F"
                }}
              >
                <Inventory2OutlinedIcon />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total de Produtos
                </Typography>
                <Typography variant="h5">{stats.total}</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 2,
              border: "1px solid #1E2733",
              bgcolor: "#0C1116",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#20120A"
                }}
              >
                <Typography>📦</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Estoque Baixo
                </Typography>
                <Typography variant="h5">{stats.baixo}</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 2,
              border: "1px solid #1E2733",
              bgcolor: "#0C1116",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#2A1014"
                }}
              >
                <Typography>📦</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Sem Estoque
                </Typography>
                <Typography variant="h5">{stats.sem}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Paper
          sx={{
            borderRadius: 2,
            border: "1px solid #1E2733",
            bgcolor: "#0C1116"
          }}
        >
          {isLoading ? (
            <DefaultLoading loadMessage="Carregando produtos..."/>
          ) : filtrados.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">
                Nenhum produto encontrado
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Estoque</TableCell>
                  <TableCell>Custo</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtrados.map(p => {
                  const id = p.produtoId || p.id
                  const categoria = categoriasMap[p.categoriaId]
                  const estoqueInfo = getEstoqueInfo(p)
                  const qtd = Number(p.quantidadeEstoque ?? 0)
                  const custo = p.custoCompra || 0
                  const preco = p.precoVenda || 0
                  return (
                    <TableRow key={id}>
                      <TableCell>{p.nome}</TableCell>
                      <TableCell>{p.marca || "-"}</TableCell>
                      <TableCell>{categoria?.nome || "-"}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography>{qtd}</Typography>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.25,
                              borderRadius: 999,
                              bgcolor: estoqueInfo.color
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: estoqueInfo.textColor, fontWeight: 500 }}
                            >
                              {estoqueInfo.label}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>R$ {Number(custo).toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>R$ {Number(preco).toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => navigate(`/produtos/${id}`)}>
                          <VisibilityOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={() => navigate(`/produtos/${id}/editar`)}>
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(p)} sx={{ color: "#ff4d4f" }}>
                          <DeleteOutlineIcon />
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
    </Container>
  )
}
