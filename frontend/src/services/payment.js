import api from "./api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const fetchPayments = async () => {
  const { data } = await api.get("/pagamentos")

  return data.map(p => ({
    id: p.pagamentoId,
    code: p.formaPagamento,
    fee: p.valor,
    status: p.status
  }))
}

export const createPayment = async ({ code, fee, status }) => {
  const payload = {
    formaPagamento: code,
    valor: fee,
    status,
    agendamentoId: null,
    dataPagamento: new Date().toISOString()
  }

  const { data } = await api.post("/pagamentos", payload)

  return {
    id: data.pagamentoId,
    code: data.formaPagamento,
    fee: data.valor,
    status: data.status
  }
}

export const updatePayment = async (id, { code, fee, status }) => {
  const payload = {
    formaPagamento: code,
    valor: fee,
    status,
    agendamentoId: null,
    dataPagamento: new Date().toISOString()
  }

  const { data } = await api.put(`/pagamentos/${id}`, payload)

  return {
    id: data.pagamentoId,
    code: data.formaPagamento,
    fee: data.valor,
    status: data.status
  }
}

export const deletePayment = async id => {
  await api.delete(`/pagamentos/${id}`)
}

export const usePayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
    staleTime: 300000
  })
}

export const useCreatePayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] })
  })
}

export const useUpdatePayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updatePayment(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] })
  })
}

export const useDeletePayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePayment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] })
  })
}
