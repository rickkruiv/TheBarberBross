import React, { useMemo, useState, Fragment } from "react"
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
  IconButton,
  Tooltip
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useProdutos, useDeleteProduto } from "../../services/produto"
import { useCategories } from "../../services/categories"
import { toastError, toastSuccess } from "../../services/toast"
import DefaultLoading from "../../shared/Loading/DefaultLoading"
import { TableVirtuoso } from "react-virtuoso"
import { useFornecedores } from "../../services/fornecedores"
import ProductDetailModal from "../../components/ProductDetailModal/ProductDetailModal"

export default function ProdutoList() {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const navigate = useNavigate()

  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const { data: produtosData, isLoading } = useProdutos()

  const { data: categoriasData } = useCategories()
  const { data: fornecedoresData } = useFornecedores()

  const deleteMutation = useDeleteProduto()

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toastSuccess("Produto removido com sucesso"),
      onError: () => toastError("Erro ao remover produto")
    })
  }

  const produtos = produtosData
    ? produtosData
    : produtosData?.data || []

  const categoriasList = categoriasData
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

  const fornecedoresList = fornecedoresData ? (Array.isArray(fornecedoresData) ? fornecedoresData : fornecedoresData.data || []) : []
  const fornecedoresMap = useMemo(() => {
    const map = {}
    fornecedoresList.forEach(f => {
      const id = f.fornecedorId || f.id
      map[id] = f
    })
    return map
  }, [fornecedoresList])

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
    const isDark = theme.palette.mode === "dark"
    const qtd = Number(p.quantidadeEstoque ?? 0)
    const min = Number(p.estoqueMinimo ?? 0)
    if (qtd <= 0)
      return {
        label: "Sem estoque",
        color: isDark ? "#3B1618" : "#FEE4E2",
        textColor: isDark ? "#F97066" : "#B42318"
      }
    if (qtd > 0 && qtd <= min)
      return {
        label: "Estoque baixo",
        color: isDark ? "#422A09" : "#FEF0C7",
        textColor: isDark ? "#FDB022" : "#B54708"
      }
    return {
      label: "Estoque OK",
      color: isDark ? "#063A2D" : "#D1FADF",
      textColor: isDark ? "#32D583" : "#027A48"
    }
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
            sx={{ maxWidth: 920, flex: 1, mr: 2 }}
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
              bgcolor: "primary.main",
              color: "background.default",
              "&:hover": { bgcolor: "text.tertiary" }
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
              border: 1, borderColor: "divider",
              bgcolor: "background.paper",
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
                  bgcolor: isDark ? "#07161F" : "rgba(124, 224, 195, 0.14)"
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
              border: 1, borderColor: "divider",
              bgcolor: "background.paper",
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
                  bgcolor: isDark ? "#20120A" : "rgba(253, 176, 34, 0.14)"
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
              border: 1, borderColor: "divider",
              bgcolor: "background.paper",
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
                  bgcolor: isDark ? "#2A1014" : "rgba(249, 112, 102, 0.14)"
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
            border: 1, borderColor: "divider",
            bgcolor: "background.paper"
          }}
        >
          {isLoading ? (
            <DefaultLoading loadMessage="Carregando produtos..." />
          ) : filtrados.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">
                Nenhum produto encontrado
              </Typography>
            </Box>
          ) : (
            <TableVirtuoso
              style={{ height: 500 }}
              data={filtrados}
              components={{
                Scroller: React.forwardRef((props, ref) => <div {...props} ref={ref} />),
                Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
                TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
                TableRow: (props) => <TableRow {...props} hover />,
                TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
              }}
              fixedHeaderContent={() => (
                <TableRow sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
                  <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "20%" }}>Produto</TableCell>
                  <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "15%" }}>Marca</TableCell>
                  <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "15%" }}>Categoria</TableCell>
                  <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "15%" }}>Estoque</TableCell>
                  <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "10%" }}>Custo</TableCell>
                  <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "10%" }}>Preço</TableCell>
                  <TableCell align="center" sx={{ bgcolor: "background.paper", zIndex: 1, width: "15%" }}>Ações</TableCell>
                </TableRow>
              )}
              itemContent={(_index, p) => {
                const id = p.produtoId || p.id
                const categoria = categoriasMap[p.categoriaId]
                const estoqueInfo = getEstoqueInfo(p)
                const qtd = Number(p.quantidadeEstoque ?? 0)
                const custo = p.custoCompra || 0
                const preco = p.precoVenda || 0
                return (
                  <Fragment>
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
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="Visualizar">
                          <IconButton size="small" onClick={() => {
                            setSelectedProduct(p)
                            setModalOpen(true)
                          }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => navigate(`/produtos/${id}/editar`)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton size="small" onClick={() => handleDelete(p)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </Fragment>
                )
              }}
            />
          )}
        </Paper>
      </Box>

      <ProductDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        categoryName={selectedProduct ? categoriasMap[selectedProduct.categoriaId]?.nome : ""}
        supplierName={selectedProduct ? fornecedoresMap[selectedProduct.fornecedorId]?.nomeFantasia || fornecedoresMap[selectedProduct.fornecedorId]?.razaoSocial : ""}
      />
    </Container>
  )
}
