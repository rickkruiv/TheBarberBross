import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button
} from "@mui/material"
import BusinessIcon from "@mui/icons-material/Business"
import PhoneIcon from "@mui/icons-material/Phone"
import RoomIcon from "@mui/icons-material/Room"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import SaveIcon from "@mui/icons-material/Save"
import ClearIcon from "@mui/icons-material/Clear"
import { useQuery } from "@tanstack/react-query"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import {
  createFornecedor,
  getFornecedor,
  updateFornecedor
} from "../../services/fornecedores"
import { fetchCategories } from "../../services/categories"
import { toastError, toastSuccess } from "../../services/toast"
import DefaultLoading from "../../components/loading/DefaultLoading"

const STATUS_OPTIONS = ["Ativo", "Inativo"]

const PRAZO_PAGAMENTO = ["À vista", "15 dias", "30 dias", "45 dias", "60 dias"]

const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO"
]

const initialForm = {
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  inscricaoEstadual: "",
  categoriaProdutos: "",
  status: "Ativo",
  telefonePrincipal: "",
  telefoneSecundario: "",
  email: "",
  website: "",
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  prazoPagamento: "",
  pedidoMinimo: "",
  prazoEntrega: "",
  observacoes: ""
}

export default function FornecedorCreate() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const isNew = !id
  const isEdit = !!id && location.pathname.endsWith("/editar")
  const isView = !!id && !isEdit
  const isReadOnly = isView

  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  const {
    data: categoriasData,
    isLoading: categoriasLoading
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategories,
    staleTime: 300000
  })

  const {
    data: fornecedorData,
    isLoading: fornecedorLoading
  } = useQuery({
    queryKey: ["fornecedor", id],
    queryFn: () => getFornecedor(id),
    enabled: !!id
  })

  useEffect(() => {
    if (fornecedorData) {
      setForm({
        razaoSocial: fornecedorData.razaoSocial || fornecedorData.nome || "",
        nomeFantasia: fornecedorData.nomeFantasia || "",
        cnpj: fornecedorData.cnpj || "",
        inscricaoEstadual: fornecedorData.inscricaoEstadual || "",
        categoriaProdutos:
          fornecedorData.categoriaId || fornecedorData.categoriaProdutos || "",
        status: fornecedorData.status || "Ativo",
        telefonePrincipal:
          fornecedorData.telefonePrincipal || fornecedorData.telefone || "",
        telefoneSecundario: fornecedorData.telefoneSecundario || "",
        email: fornecedorData.email || "",
        website: fornecedorData.website || "",
        cep: fornecedorData.cep || "",
        logradouro: fornecedorData.logradouro || "",
        numero: fornecedorData.numero || "",
        bairro: fornecedorData.bairro || "",
        cidade: fornecedorData.cidade || "",
        estado: fornecedorData.estado || "",
        prazoPagamento: fornecedorData.prazoPagamento || "",
        pedidoMinimo: fornecedorData.pedidoMinimo || "",
        prazoEntrega: fornecedorData.prazoEntrega || "",
        observacoes: fornecedorData.observacoes || ""
      })
    }
  }, [fornecedorData])

  const categoriasList = Array.isArray(categoriasData)
    ? categoriasData
    : categoriasData?.data || []
  const categoriasProduto = categoriasList.filter(c => c.tipo === "PRODUTO")

  const handleChange = field => e => {
    const value = e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleClear = () => {
    if (isNew) {
      setForm(initialForm)
    } else if (fornecedorData) {
      setForm({
        razaoSocial: fornecedorData.razaoSocial || fornecedorData.nome || "",
        nomeFantasia: fornecedorData.nomeFantasia || "",
        cnpj: fornecedorData.cnpj || "",
        inscricaoEstadual: fornecedorData.inscricaoEstadual || "",
        categoriaProdutos:
          fornecedorData.categoriaId || fornecedorData.categoriaProdutos || "",
        status: fornecedorData.status || "Ativo",
        telefonePrincipal:
          fornecedorData.telefonePrincipal || fornecedorData.telefone || "",
        telefoneSecundario: fornecedorData.telefoneSecundario || "",
        email: fornecedorData.email || "",
        website: fornecedorData.website || "",
        cep: fornecedorData.cep || "",
        logradouro: fornecedorData.logradouro || "",
        numero: fornecedorData.numero || "",
        bairro: fornecedorData.bairro || "",
        cidade: fornecedorData.cidade || "",
        estado: fornecedorData.estado || "",
        prazoPagamento: fornecedorData.prazoPagamento || "",
        pedidoMinimo: fornecedorData.pedidoMinimo || "",
        prazoEntrega: fornecedorData.prazoEntrega || "",
        observacoes: fornecedorData.observacoes || ""
      })
    }
  }

  const handleSubmit = async () => {
    if (isReadOnly) return

    if (!form.razaoSocial.trim()) {
      toastError("Informe a Razão Social")
      return
    }
    if (!form.cnpj.trim()) {
      toastError("Informe o CNPJ")
      return
    }
    if (!form.telefonePrincipal.trim()) {
      toastError("Informe o telefone principal")
      return
    }
    if (!form.email.trim()) {
      toastError("Informe o e-mail")
      return
    }

    const payload = {
      nome: form.razaoSocial.trim(),
      razaoSocial: form.razaoSocial.trim(),
      nomeFantasia: form.nomeFantasia,
      cnpj: form.cnpj.trim(),
      inscricaoEstadual: form.inscricaoEstadual,
      telefone: form.telefonePrincipal.trim(),
      telefonePrincipal: form.telefonePrincipal.trim(),
      telefoneSecundario: form.telefoneSecundario,
      email: form.email.trim(),
      website: form.website,
      enderecoId: 0,
      categoriaId: form.categoriaProdutos || null,
      categoriaProdutos: form.categoriaProdutos,
      status: form.status,
      cep: form.cep,
      logradouro: form.logradouro,
      numero: form.numero,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      prazoPagamento: form.prazoPagamento,
      pedidoMinimo: form.pedidoMinimo,
      prazoEntrega: form.prazoEntrega,
      observacoes: form.observacoes
    }

    try {
      setSaving(true)
      if (isNew) {
        await createFornecedor(payload)
        toastSuccess("Fornecedor salvo com sucesso")
        setForm(initialForm)
      } else {
        await updateFornecedor(id, payload)
        toastSuccess("Fornecedor atualizado com sucesso")
      }
    } catch (e) {
      toastError("Erro ao salvar fornecedor")
    } finally {
      setSaving(false)
    }
  }

  if (fornecedorLoading && !isNew) {
    return (
      <DefaultLoading loadMessage="Carregando fornecedor..."/>
    )
  }

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
          <BusinessIcon fontSize="small" />
          <Typography variant="h6" fontWeight={800}>
            Dados do Fornecedor
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
          >
            <TextField
              label="Razão Social"
              placeholder="Ex: Distribuidora Alpha Ltda"
              fullWidth
              value={form.razaoSocial}
              onChange={handleChange("razaoSocial")}
              sx={{ flex: 1 }}
              disabled={isReadOnly || saving}
            />
            <TextField
              label="Nome Fantasia"
              placeholder="Ex: Alpha Distribuidora"
              fullWidth
              value={form.nomeFantasia}
              onChange={handleChange("nomeFantasia")}
              sx={{ flex: 1 }}
              disabled={isReadOnly || saving}
            />
          </Box>

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
          >
            <TextField
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              fullWidth
              value={form.cnpj}
              onChange={handleChange("cnpj")}
              sx={{ flex: 1 }}
              disabled={isReadOnly || saving}
            />
            <TextField
              label="Inscrição Estadual"
              placeholder="000.000.000.000"
              fullWidth
              value={form.inscricaoEstadual}
              onChange={handleChange("inscricaoEstadual")}
              sx={{ flex: 1 }}
              disabled={isReadOnly || saving}
            />
          </Box>

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
          >
            <TextField
              select
              label="Categoria de Produtos"
              fullWidth
              value={form.categoriaProdutos}
              onChange={handleChange("categoriaProdutos")}
              disabled={categoriasLoading || isReadOnly || saving}
              sx={{ flex: 1 }}
            >
              <MenuItem value="">
                <em>Selecione uma categoria</em>
              </MenuItem>
              {categoriasProduto.map(cat => (
                <MenuItem
                  key={cat.categoriaId || cat.id}
                  value={cat.categoriaId || cat.id}
                >
                  {cat.nome}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Status"
              fullWidth
              value={form.status}
              onChange={handleChange("status")}
              disabled={isReadOnly || saving}
              sx={{ flex: 1 }}
            >
              {STATUS_OPTIONS.map(opt => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 3
        }}
      >
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid #1E2733",
            bgcolor: "#0C1116",
            flex: 1
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PhoneIcon fontSize="small" />
            <Typography variant="h6" fontWeight={800}>
              Informações de Contato
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Telefone Principal"
              placeholder="(11) 3000-0000"
              fullWidth
              value={form.telefonePrincipal}
              onChange={handleChange("telefonePrincipal")}
              disabled={isReadOnly || saving}
            />
            <TextField
              label="Telefone Secundário"
              placeholder="(11) 98000-0000"
              fullWidth
              value={form.telefoneSecundario}
              onChange={handleChange("telefoneSecundario")}
              disabled={isReadOnly || saving}
            />
            <TextField
              label="E-mail"
              placeholder="contato@fornecedor.com.br"
              fullWidth
              value={form.email}
              onChange={handleChange("email")}
              disabled={isReadOnly || saving}
            />
            <TextField
              label="Website"
              placeholder="www.fornecedor.com.br"
              fullWidth
              value={form.website}
              onChange={handleChange("website")}
              disabled={isReadOnly || saving}
            />
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid #1E2733",
            bgcolor: "#0C1116",
            flex: 1
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <RoomIcon fontSize="small" />
            <Typography variant="h6" fontWeight={800}>
              Endereço
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="CEP"
              placeholder="00000-000"
              fullWidth
              value={form.cep}
              onChange={handleChange("cep")}
              disabled={isReadOnly || saving}
            />

            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={2}
            >
              <TextField
                label="Logradouro"
                placeholder="Rua, Avenida..."
                fullWidth
                value={form.logradouro}
                onChange={handleChange("logradouro")}
                sx={{ flex: 2 }}
                disabled={isReadOnly || saving}
              />
              <TextField
                label="Número"
                placeholder="Nº"
                fullWidth
                value={form.numero}
                onChange={handleChange("numero")}
                sx={{ flex: 1 }}
                disabled={isReadOnly || saving}
              />
            </Box>

            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={2}
            >
              <TextField
                label="Bairro"
                fullWidth
                value={form.bairro}
                onChange={handleChange("bairro")}
                sx={{ flex: 1 }}
                disabled={isReadOnly || saving}
              />
              <TextField
                label="Cidade"
                fullWidth
                value={form.cidade}
                onChange={handleChange("cidade")}
                sx={{ flex: 1 }}
                disabled={isReadOnly || saving}
              />
            </Box>

            <TextField
              select
              label="Estado"
              fullWidth
              value={form.estado}
              onChange={handleChange("estado")}
              disabled={isReadOnly || saving}
            >
              <MenuItem value="">
                <em>Selecione</em>
              </MenuItem>
              {ESTADOS.map(uf => (
                <MenuItem key={uf} value={uf}>
                  {uf}
                </MenuItem>
              ))}
            </TextField>
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
          <LocalShippingIcon fontSize="small" />
          <Typography variant="h6" fontWeight={800}>
            Informações Comerciais
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
          >
            <TextField
              select
              label="Prazo de Pagamento"
              fullWidth
              value={form.prazoPagamento}
              onChange={handleChange("prazoPagamento")}
              sx={{ flex: 1 }}
              disabled={isReadOnly || saving}
            >
              <MenuItem value="">
                <em>Selecione</em>
              </MenuItem>
              {PRAZO_PAGAMENTO.map(p => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Pedido Mínimo (R$)"
              type="number"
              fullWidth
              value={form.pedidoMinimo}
              onChange={handleChange("pedidoMinimo")}
              sx={{ flex: 1 }}
              disabled={isReadOnly || saving}
            />
            <TextField
              label="Prazo de Entrega (dias)"
              type="number"
              fullWidth
              value={form.prazoEntrega}
              onChange={handleChange("prazoEntrega")}
              sx={{ flex: 1 }}
              disabled={isReadOnly || saving}
            />
          </Box>

          <TextField
            label="Observações"
            fullWidth
            multiline
            minRows={3}
            value={form.observacoes}
            onChange={handleChange("observacoes")}
            disabled={isReadOnly || saving}
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
          <>
            <Button
              variant="text"
              onClick={() => navigate("/fornecedores/visualizar")}
              sx={{ color: "#CDD5DF" }}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(`/fornecedores/${id}/editar`)}
              sx={{
                bgcolor: "#62B6A5",
                color: "#0B1117",
                "&:hover": { bgcolor: "#58a897" }
              }}
            >
              Editar
            </Button>
          </>
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
              {isNew ? "Salvar Fornecedor" : "Salvar Alterações"}
            </Button>
          </>
        )}
      </Box>
    </Container>
  )
}
