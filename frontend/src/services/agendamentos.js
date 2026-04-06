import api from "./api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

function buildDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null
  return `${dateStr}T${timeStr.padStart(5, "0")}:00`
}

function buildPayload(values) {
  const dataHorario = buildDateTime(values.data, values.hora)

  return {
    dataHorario,
    observacao: values.observacao || "",
    clienteId: values.clienteId ? Number(values.clienteId) : null,
    empresaId: values.empresaId ? Number(values.empresaId) : null,
    funcionarioId: values.funcionarioId ? Number(values.funcionarioId) : null,
    listaDeServicosId: values.servicoIds?.map(id => Number(id)) || []
  }
}

export async function fetchAgendamentos(params = {}) {
  const nivelAcesso = localStorage.getItem("@app:nivelAcesso");
  const userId = localStorage.getItem("@app:userId");

  let queryStr = "";
  if (params.inicio && params.fim) {
    queryStr = `?inicio=${params.inicio}&fim=${params.fim}`;
  }

  if (nivelAcesso === "ADMIN") {
    const { data } = await api.get(`/agendamentos/empresa/${queryStr}`);
    return data;
  } else if (nivelAcesso === "COLABORADOR") {
    const { data } = await api.get(`/agendamentos/barbeiro/${userId}/${queryStr}`);
    return data;
  }

  return [];
}

export async function fetchAgendamentoById(agendamentoId, empresaId) {
  const { data } = await api.get(`/agendamentos/${agendamentoId}`)
  return data
}

export async function createAgendamento(values) {
  const payload = buildPayload(values)
  const { data } = await api.post("/agendamentos", payload)

  return data
}

export async function updateAgendamento(agendamentoId, values) {
  const payload = {
    servicos: values.servicoIds?.map(id => Number(id)) || []
  }
  const { data } = await api.patch(`/agendamentos/${agendamentoId}`, payload)
  return data
}

export async function deleteAgendamento(agendamentoId, empresaId) {
  await api.delete(`/agendamentos/${agendamentoId}`)
}

export async function updateStatusAgendamento(agendamentoId, empresaId, novoStatus) {
  const { data } = await api.patch(`/agendamentos/${agendamentoId}/status`, `"${novoStatus}"`, {
    headers: { "Content-Type": "application/json" }
  })
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