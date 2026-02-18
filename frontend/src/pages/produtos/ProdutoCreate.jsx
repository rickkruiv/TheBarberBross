import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  InputAdornment
} from "@mui/material"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import SaveIcon from "@mui/icons-material/Save"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import { useQuery } from "@tanstack/react-query"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { createProduto, getProduto, updateProduto } from "../../services/produto"
import { fetchCategories } from "../../services/categories"
import { listFornecedores } from "../../services/fornecedores"
import { toastError, toastSuccess } from "../../services/toast"

const UNIDADES_MEDIDA = ["Unidade", "Pacote", "Caixa", "Litro", "Quilo"]

const initialForm = {
  nome: "",
  marca: "",
  categoriaId: "",
  fornecedorId: "",
  descricao: "",
  sku: "",
  codigoBarras: "",
  unidadeMedida: "Unidade",
  custoCompra: "",
  precoVenda: "",
  margemLucro: "",
  quantidadeEstoque: "",
  estoqueMinimo: "",
  estoqueMaximo: ""
}

export default function ProdutoCreate() {
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const isEdit = Boolean(id) && location.pathname.includes("/editar")
  const isView = Boolean(id) && !location.pathname.includes("/editar")

  const { data: categoriasData } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategories,
    staleTime: 300000
  })

  const { data: fornecedoresData } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: listFornecedores,
    staleTime: 300000
  })

  const { data: produtoData } = useQuery({
    queryKey: ["produto", id],
    queryFn: () => getProduto(id),
    enabled: !!id
  })

  const categoriasList = Array.isArray(categoriasData)
    ? categoriasData
    : categoriasData?.data || []
  const categoriasProduto = categoriasList.filter(c => c.tipo === "PRODUTO")

  const fornecedoresList = Array.isArray(fornecedoresData)
    ? fornecedoresData
    : fornecedoresData?.data || []

  useEffect(() => {
    if (produtoData) {
      setForm(prev => ({
        ...prev,
        nome: produtoData.nome || "",
        descricao: produtoData.descricao || "",
        categoriaId: produtoData.categoriaId || "",
        marca: produtoData.marca || "",
        fornecedorId: produtoData.fornecedorId || "",
        sku: produtoData.sku || "",
        codigoBarras: produtoData.codigoBarras || "",
        unidadeMedida: produtoData.unidadeMedida || "Unidade",
        custoCompra: produtoData.custoCompra || "",
        precoVenda: produtoData.precoVenda || "",
        margemLucro: produtoData.margemLucro || "",
        quantidadeEstoque: produtoData.quantidadeEstoque || "",
        estoqueMinimo: produtoData.estoqueMinimo || "",
        estoqueMaximo: produtoData.estoqueMaximo || ""
      }))
    }
  }, [produtoData])

  const handleChange = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleClear = () => {
    setForm(initialForm)
  }

  const handleSubmit = async () => {
    if (!form.nome.trim()) {
      toastError("Informe o nome do produto")
      return
    }
    if (!form.categoriaId) {
      toastError("Selecione a categoria")
      return
    }

    const payload = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      categoriaId: form.categoriaId,
      ...form
    }

    try {
      setSaving(true)
      if (isEdit) {
        await updateProduto(id, payload)
        toastSuccess("Produto atualizado com sucesso")
      } else {
        await createProduto(payload)
        toastSuccess("Produto salvo com sucesso")
        handleClear()
      }
    } catch (e) {
      toastError("Erro ao salvar produto")
    } finally {
      setSaving(false)
    }
  }

  const disabled = isView

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 2,
          border: "1px solid #1E2733",
          bgcolor: "#0C1116"
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Inventory2OutlinedIcon fontSize="small" />
          <Typography variant="h6" fontWeight={800}>
            Informações do Produto
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2
            }}
          >
            <TextField
              label="Nome do Produto"
              placeholder="Ex: Pomada Modeladora"
              fullWidth
              value={form.nome}
              onChange={handleChange("nome")}
              disabled={disabled}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Marca"
              placeholder="Ex: American Crew"
              fullWidth
              value={form.marca}
              onChange={handleChange("marca")}
              disabled={disabled}
              sx={{ flex: 1 }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2
            }}
          >
            <TextField
              select
              label="Categoria"
              fullWidth
              value={form.categoriaId}
              onChange={handleChange("categoriaId")}
              disabled={disabled}
              sx={{ flex: 1 }}
            >
              <MenuItem value="">
                <em>Selecione uma categoria</em>
              </MenuItem>
              {categoriasProduto.map(cat => (
                <MenuItem key={cat.categoriaId || cat.id} value={cat.categoriaId || cat.id}>
                  {cat.nome}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Fornecedor"
              fullWidth
              value={form.fornecedorId}
              onChange={handleChange("fornecedorId")}
              disabled={disabled}
              sx={{ flex: 1 }}
            >
              <MenuItem value="">
                <em>Selecione um fornecedor</em>
              </MenuItem>
              {fornecedoresList.map(f => (
                <MenuItem key={f.fornecedorId || f.id} value={f.fornecedorId || f.id}>
                  {f.razaoSocial || f.nome}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Descrição"
            placeholder="Descreva as características do produto..."
            fullWidth
            multiline
            minRows={3}
            value={form.descricao}
            onChange={handleChange("descricao")}
            disabled={disabled}
          />
        </Box>
      </Paper>

      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          gap: 3,
          mb: 3
        }}
      >
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            border: "1px solid #1E2733",
            bgcolor: "#0C1116",
            mb: { xs: 3, md: 0 }
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <ViewWeekOutlinedIcon fontSize="small" />
            <Typography variant="h6" fontWeight={800}>
              Identificação
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="SKU / Código Interno"
              placeholder="Ex: POM-001"
              fullWidth
              value={form.sku}
              onChange={handleChange("sku")}
              disabled={disabled}
            />
            <TextField
              label="Código de Barras (EAN)"
              placeholder="Ex: 7891234567890"
              fullWidth
              value={form.codigoBarras}
              onChange={handleChange("codigoBarras")}
              disabled={disabled}
            />
            <TextField
              select
              label="Unidade de Medida"
              fullWidth
              value={form.unidadeMedida}
              onChange={handleChange("unidadeMedida")}
              disabled={disabled}
            >
              {UNIDADES_MEDIDA.map(u => (
                <MenuItem key={u} value={u}>
                  {u}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Paper>

        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            border: "1px solid #1E2733",
            bgcolor: "#0C1116"
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AttachMoneyIcon fontSize="small" />
            <Typography variant="h6" fontWeight={800}>
              Valores
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Custo de Compra"
              fullWidth
              value={form.custoCompra}
              onChange={handleChange("custoCompra")}
              disabled={disabled}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>
              }}
            />
            <TextField
              label="Preço de Venda"
              fullWidth
              value={form.precoVenda}
              onChange={handleChange("precoVenda")}
              disabled={disabled}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>
              }}
            />
            <TextField
              label="Margem de Lucro (%)"
              fullWidth
              value={form.margemLucro}
              onChange={handleChange("margemLucro")}
              disabled={disabled}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Box>
        </Paper>
      </Box>

      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid #1E2733",
          bgcolor: "#0C1116",
          mb: 8
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LocalOfferIcon fontSize="small" />
          <Typography variant="h6" fontWeight={800}>
            Controle de Estoque
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2
          }}
        >
          <TextField
            label="Quantidade em Estoque"
            type="number"
            fullWidth
            value={form.quantidadeEstoque}
            onChange={handleChange("quantidadeEstoque")}
            disabled={disabled}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Estoque Mínimo"
            type="number"
            fullWidth
            value={form.estoqueMinimo}
            onChange={handleChange("estoqueMinimo")}
            disabled={disabled}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Estoque Máximo"
            type="number"
            fullWidth
            value={form.estoqueMaximo}
            onChange={handleChange("estoqueMaximo")}
            disabled={disabled}
            sx={{ flex: 1 }}
          />
        </Box>
      </Paper>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          py: 2,
          mt: -6,
          bgcolor: "rgba(3,7,12,0.96)",
          borderTop: "1px solid #1E2733",
          display: "flex",
          justifyContent: "flex-end",
          gap: 2
        }}
      >
        {isView ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/produtos/${id}/editar`)}
            sx={{
              bgcolor: "#62B6A5",
              color: "#0B1117",
              "&:hover": { bgcolor: "#58a897" }
            }}
          >
            Editar Produto
          </Button>
        ) : (
          <>
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={handleClear}
              disabled={saving}
              sx={{ color: "#CDD5DF" }}
            >
              Limpar
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={saving}
              sx={{
                bgcolor: "#62B6A5",
                color: "#0B1117",
                "&:hover": { bgcolor: "#58a897" }
              }}
            >
              {isEdit ? "Salvar alterações" : "Salvar Produto"}
            </Button>
          </>
        )}
      </Box>
    </Container>
  )
}
