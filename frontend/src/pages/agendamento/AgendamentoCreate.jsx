import React from "react"
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Paper
} from "@mui/material"
import ContentCut from "@mui/icons-material/ContentCut"
import PersonOutline from "@mui/icons-material/PersonOutline"
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import EventIcon from "@mui/icons-material/Event"
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline"
import AccessTime from "@mui/icons-material/AccessTime"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import SectionCard from "../../components/SectionCard/SectionCard"
import DefaultLoading from "../../components/loading/DefaultLoading"
import { fetchServices } from "../../services/services"
import { fetchEmployees } from "../../services/employees"
import {
  createAgendamento,
  fetchAgendamentoById,
  updateAgendamento
} from "../../services/agendamentos"
import { createClientFromAppointment } from "../../services/cliente"
import { toastError, toastSuccess } from "../../services/toast"

const schema = Yup.object({
  servicoIds: Yup.array().min(1, "Selecione pelo menos um serviço"),
  funcionarioId: Yup.string().required("Selecione um profissional"),
  nomeCliente: Yup.string().required("Informe o nome do cliente"),
  telefoneCliente: Yup.string().required("Informe o telefone"),
  data: Yup.string().required("Selecione a data"),
  hora: Yup.string().required("Selecione o horário")
})

const initialValues = {
  servicoIds: [],
  funcionarioId: "",
  nomeCliente: "",
  telefoneCliente: "",
  emailCliente: "",
  data: "",
  hora: "",
  observacao: "",
  clienteId: null,
  empresaId: 7,
  status: "PENDENTE",
  valorTotal: 0
}

const horarios = [
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

function formatBRL(value) {
  if (value == null) return "R$ 0,00"
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}

function formatDateInput(date) {
  const y = String(date.getFullYear())
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatTimeInput(date) {
  const h = String(date.getHours()).padStart(2, "0")
  const m = String(date.getMinutes()).padStart(2, "0")
  return `${h}:${m}`
}

export default function AgendamentoCreate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEdit = !!id && location.pathname.endsWith("/editar")

  const [initial, setInitial] = React.useState(initialValues)
  const [loading, setLoading] = React.useState(false)

  const { data: servicesData } = useQuery({
    queryKey: ["services-all"],
    queryFn: () => fetchServices()
  })

  const { data: employeesData } = useQuery({
    queryKey: ["employees-all"],
    queryFn: () => fetchEmployees()
  })

  React.useEffect(() => {
    if (!isEdit || !id) return
    setLoading(true)
    fetchAgendamentoById(id, 7) // add para receber empresaId dinamicamente
      .then(ag => {
        let data = ""
        let hora = ""
        if (ag.dataHorario) {
          const d = new Date(ag.dataHorario)
          if (!Number.isNaN(d.getTime())) {
            data = formatDateInput(d)
            hora = formatTimeInput(d)
          }
        }
        setInitial({
          ...initialValues,
          servicoIds: ag.servicos ? ag.servicos.map(servico => String(servico.servicoId)) : [],
          funcionarioId: ag.funcionario
            ? String(ag.funcionario.funcionarioId ?? ag.funcionario.funcionarioId)
            : "",
          nomeCliente: ag.cliente?.nome || "",
          telefoneCliente: ag.cliente?.telefone || "",
          emailCliente: ag.cliente?.email || "",
          data,
          hora,
          observacao: ag.observacao || "",
          clienteId: ag.cliente?.clienteId || null,
          empresaId: ag.empresa?.empresaId || 1,
          status: ag.status || "PENDENTE",
          valorTotal: ag.valorTotal ?? 0
        })
      })
      .catch(() => {
        toastError("Falha ao carregar agendamento")
      })
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const services = Array.isArray(servicesData) ? servicesData : servicesData?.data || []
  const employees = Array.isArray(employeesData) ? employeesData : employeesData?.data || []

  if (loading) {
    return (
      <DefaultLoading loadMessage="Carregando agendamento..."/>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Formik
        initialValues={initial}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const selectedServices = services.filter(s =>
              values.servicoIds.includes(String(s.servicoId))
            )
            const valorTotal = selectedServices.reduce((sum, s) => sum + (s.preco ?? 0), 0)

            let clienteId = values.clienteId
            if (!clienteId) {
              const novoCliente = await createClientFromAppointment(values)
              clienteId = novoCliente.clienteId
            }

            if (isEdit && id) {
              await updateAgendamento(id, {
                ...values,
                valorTotal,
                clienteId
              })
              toastSuccess("Agendamento atualizado com sucesso")
            } else {
              await createAgendamento({
                ...values,
                valorTotal,
                clienteId
              })
              toastSuccess("Agendamento criado com sucesso")
              resetForm()
            }

            navigate("/agenda/visualizar")
          } catch (e) {
            console.error(e)
            toastError("Falha ao salvar agendamento")
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          submitForm,
          isSubmitting
        }) => {
          const selectedServices = services.find(
            s => String(s.servicoId) === String(values.servicoId)
          )
          const selectedEmployee = employees.find(
            f => String(f.funcionarioId) === String(values.funcionarioId)
          )

          return (
            <Form noValidate>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>

                  {/* COLUNA ESQUERDA */}
                  <Box sx={{ flex: 2, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>

                    {/* SERVIÇO */}
                    <SectionCard icon={<ContentCut fontSize="small" />} title="Serviço Desejado">
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {services.length === 0 ? (
                          <Typography color="text.secondary">
                            Nenhum serviço cadastrado.
                          </Typography>
                        ) : (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {services.map(service => {
                              const selected = values.servicoIds.includes(String(service.servicoId))
                              return (
                                <Paper
                                  key={service.servicoId}
                                  onClick={() =>
                                    selected
                                      ? setFieldValue(
                                          "servicoIds",
                                          values.servicoIds.filter(id => id !== String(service.servicoId))
                                        )
                                      : setFieldValue("servicoIds", [...values.servicoIds, String(service.servicoId)])
                                  }
                                  sx={{
                                    flex: "1 1 260px",
                                    minWidth: 260,
                                    cursor: "pointer",
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: selected ? "#62B6A5" : "rgba(255,255,255,0.06)",
                                    bgcolor: selected ? "#151F2A" : "#0C1116"
                                  }}
                                >
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                    <Typography fontWeight={700}>{service.nome}</Typography>
                                    <Typography sx={{ color: "#62B6A5", fontWeight: 700 }}>
                                      {formatBRL(service.preco)}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Duração: {service.duracao ? `${service.duracao} min` : "-"}
                                  </Typography>
                                </Paper>
                              )
                            })}
                          </Box>
                        )}
                        {touched.servicoIds && errors.servicoIds && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            {errors.servicoIds}
                          </Typography>
                        )}
                      </Box>
                    </SectionCard>

                    {/* CLIENTE */}
                    <SectionCard icon={<PersonOutline fontSize="small" />} title="Informações do Cliente">
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                          <TextField
                            fullWidth
                            label="Nome do Cliente"
                            name="nomeCliente"
                            value={values.nomeCliente}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.nomeCliente && Boolean(errors.nomeCliente)}
                            helperText={touched.nomeCliente && errors.nomeCliente}
                          />
                          <TextField
                            fullWidth
                            label="Telefone"
                            name="telefoneCliente"
                            value={values.telefoneCliente}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.telefoneCliente && Boolean(errors.telefoneCliente)}
                            helperText={touched.telefoneCliente && errors.telefoneCliente}
                          />
                        </Box>
                        <TextField
                          fullWidth
                          label="E-mail (opcional)"
                          name="emailCliente"
                          value={values.emailCliente}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                    </SectionCard>

                    {/* DATA E HORÁRIO */}
                    <SectionCard icon={<EventIcon fontSize="small" />} title="Data e Horário">
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Selecione a Data
                          </Typography>
                          <TextField
                            fullWidth
                            type="date"
                            name="data"
                            value={values.data}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputLabelProps={{ shrink: true }}
                            error={touched.data && Boolean(errors.data)}
                            helperText={touched.data && errors.data}
                          />
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Horário Disponível
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              p: 1,
                              borderRadius: 2,
                              bgcolor: "#0C1116"
                            }}
                          >
                            {horarios.map(h => {
                              const selected = values.hora === h
                              return (
                                <Button
                                  key={h}
                                  variant={selected ? "contained" : "outlined"}
                                  startIcon={<AccessTime />}
                                  onClick={() => setFieldValue("hora", h)}
                                  sx={{
                                    flex: "1 1 110px",
                                    justifyContent: "flex-start",
                                    borderRadius: 999,
                                    borderColor: selected ? "#62B6A5" : "rgba(255,255,255,0.12)",
                                    bgcolor: selected ? "#62B6A5" : "transparent",
                                    color: selected ? "#0B1117" : "inherit",
                                    "&:hover": {
                                      bgcolor: selected ? "#58a897" : "rgba(255,255,255,0.04)"
                                    }
                                  }}
                                >
                                  {h}
                                </Button>
                              )
                            })}
                          </Box>
                          {touched.hora && errors.hora && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                              {errors.hora}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </SectionCard>

                    {/* OBSERVAÇÕES */}
                    <SectionCard icon={<ChatBubbleOutline fontSize="small" />} title="Observações">
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Adicione observações sobre o agendamento (preferências de corte, alergias, etc.)"
                        name="observacao"
                        value={values.observacao}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </SectionCard>

                  </Box>
                  {/* FIM COLUNA ESQUERDA */}

                  {/* COLUNA DIREITA */}
                  <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* PROFISSIONAL */}
                    <SectionCard icon={<PersonOutline fontSize="small" />} title="Profissional">
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                          select
                          fullWidth
                          label="Profissional"
                          name="funcionarioId"
                          value={values.funcionarioId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.funcionarioId && Boolean(errors.funcionarioId)}
                          helperText={touched.funcionarioId && errors.funcionarioId}
                        >
                          {employees.map(emp => (
                            <MenuItem key={emp.funcionarioId} value={String(emp.funcionarioId)}>
                              {emp.nome}
                            </MenuItem>
                          ))}
                        </TextField>

                        <Box
                          sx={{
                            mt: 1,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: "#141B24",
                            fontSize: 13,
                            display: "flex",
                            gap: 1,
                            alignItems: "flex-start"
                          }}
                        >
                          <Typography sx={{ mr: 0.5 }}>💡</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Selecione &quot;Qualquer Disponível&quot; para maior flexibilidade de horários.
                          </Typography>
                        </Box>
                      </Box>
                    </SectionCard>

                    {/* RESUMO */}
                    <Box sx={{position: "sticky",
                              top: 80,
                              height: "fit-content"
                            }}
                    >

                      <SectionCard icon={<CollectionsBookmarkIcon fontSize="small" />} title="Resumo do Agendamento">
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#141B24", display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                              Serviço
                            </Typography>
                            {/* <Typography fontWeight={700}>
                              {values.servicoIds.length > 0
                                ? services.filter(s => values.servicoIds.includes(String(s.servicoId)))
                                    .map(s => s.nome)
                                    .join(", ")
                                : "-"}
                            </Typography> */}
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 0.5 }}>
                              {values.servicoIds.length > 0 ? (
                                services
                                  .filter(s => values.servicoIds.includes(String(s.servicoId)))
                                  .map(servico => (
                                    <Typography key={servico.servicoId} sx={{ fontWeight: 600 }}>
                                      <DoubleArrowOutlinedIcon sx={{ fontSize: ".8rem" }} /> {servico.nome}
                                    </Typography>
                                  ))
                              ) : (
                                <Typography sx={{ fontWeight: 600, opacity: 0.6 }}>Nenhum serviço selecionado</Typography>
                              )}
                            </Box>
                          </Paper>

                          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#141B24", display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                              Profissional
                            </Typography>
                            <Typography fontWeight={700}>
                              {selectedEmployee?.nome || "-"}
                            </Typography>
                          </Paper>

                          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#141B24", display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                              Horário
                            </Typography>
                            <Typography fontWeight={700}>
                              {values.data && values.hora ? `${values.data} - ${values.hora}` : "-"}
                            </Typography>
                          </Paper>
                        </Box>
                      </SectionCard>
                    </Box>
                  </Box>
                  {/*FIM COLUNA DIREITA */}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
                  <Button variant="outlined" onClick={() => navigate("/agenda/visualizar")}>
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={submitForm}
                    sx={{
                      bgcolor: "#62B6A5",
                      color: "#0B1117",
                      px: 4,
                      "&:hover": { bgcolor: "#58a897" }
                    }}
                  >
                    {isEdit ? "Salvar Alterações" : "Confirmar Agendamento"}
                  </Button>
                </Box>

              </Box>
            </Form>

          )
        }}
      </Formik>
    </Box>
  )
}
