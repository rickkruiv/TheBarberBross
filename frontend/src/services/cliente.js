import api from "./api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

function generateRandomPassword(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let result = ""
  for (let i = 0; i < length; i += 1) {
    const idx = Math.floor(Math.random() * chars.length)
    result += chars[idx]
  }
  return result
}

export async function createClientFromAppointment(values) {
  const payload = {
    nome: values.nomeCliente,
    telefone: values.telefoneCliente,
    email: values.emailCliente || `convidado_${Date.now()}@barberbross.com`,
    senha: generateRandomPassword(10)
  }

  const { data } = await api.post("/clientes", payload)
  return data
}

export const useCreateClienteFromAppointment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createClientFromAppointment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clientes"] })
  })
}
