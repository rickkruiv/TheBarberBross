import api from "./api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

function buildDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null
  return `${dateStr}T${timeStr.padStart(5, "0")}:00`
}

const STATUS_DEFAULT = "PENDENTE"

function buildPayload(values) {
  const dataHorario = buildDateTime(values.data, values.hora)

  return {
    dataHorario,
    status: values.status || STATUS_DEFAULT,
    observacao: values.observacao || "",
    valorTotal: values.valorTotal ?? 0,
    servicos: values.servicoIds?.map(id => ({ servicoId: Number(id) })) || [],
    funcionario: values.funcionarioId
      ? { funcionarioId: Number(values.funcionarioId) }
      : null,
    cliente: values.clienteId ? { clienteId: Number(values.clienteId) } : null,
    empresa: values.empresaId ? { empresaId: Number(values.empresaId) } : null
  }
}

export async function fetchAgendamentos(params) {
  const config = params;
  const { data } = await api.get(`/agendamentos?empresaId=7`, config) // fazer por passagem de parametros dps
  return data
}

export async function fetchAgendamentoById(agendaemntoId, empresaId) {
  const { data } = await api.get(`/agendamentos?agendamentoId=${agendaemntoId}&empresaId=${empresaId}`)
  return data
}

export async function createAgendamento(values) {
  const payload = buildPayload(values)
  const { data } = await api.post("/agendamentos", payload)

  return data
}

export async function updateAgendamento(agendaemntoId, values) {
  const payload = buildPayload(values)
  const { data } = await api.put(`/agendamentos?agendamentoId=${agendaemntoId}&empresaId=7`, payload)
  return data
}

export async function deleteAgendamento(agendaemntoId, empresaId) {
  await api.delete(`/agendamentos?agendamentoId=${agendaemntoId}&empresaId=${empresaId}`)
}

export async function updateStatusAgendamento(agendaemntoId, empresaId, novoStatus) {
  const { data } = await api.put(`/agendamentos/status?agendamentoId=${agendaemntoId}&empresaId=${empresaId}&status=${novoStatus}`, null)
  return data
}

export const useAgendamentos = (params) => {
  return useQuery({
    queryKey: ["agendamentos", params],
    queryFn: () => fetchAgendamentos(params),
    staleTime: 30000
  })
}

export const useAgendamento = (agendamentoId, empresaId = 7) => {
  return useQuery({
    queryKey: ["agendamento", agendamentoId, empresaId],
    queryFn: () => fetchAgendamentoById(agendamentoId, empresaId),
    enabled: !!agendamentoId,
    staleTime: 30000
  })
}

export const useCreateAgendamento = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAgendamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] })
    }
  })
}

export const useUpdateAgendamento = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ agendamentoId, values }) => updateAgendamento(agendamentoId, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] })
      queryClient.invalidateQueries({ queryKey: ["agendamento", variables.agendamentoId] })
    }
  })
}

export const useDeleteAgendamento = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ agendamentoId, empresaId }) => deleteAgendamento(agendamentoId, empresaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] })
    }
  })
}

export const useUpdateStatusAgendamento = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ agendamentoId, empresaId, novoStatus }) => updateStatusAgendamento(agendamentoId, empresaId, novoStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] })
      queryClient.invalidateQueries({ queryKey: ["agendamento", variables.agendamentoId] })
    }
  })
}