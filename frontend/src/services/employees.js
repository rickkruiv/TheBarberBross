import api from "./api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

function normalizeDate(dateLike) {
  if (!dateLike) return null

  if (typeof dateLike === "string") {
    const parts = dateLike.split("/")
    if (parts.length === 3) {
      const [dia, mes, ano] = parts
      return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`
    }
    return dateLike
  }

  if (dateLike instanceof Date && !isNaN(dateLike)) {
    return dateLike.toISOString().slice(0, 10)
  }

  return null
}

export function parseCurrency(val) {
  const numStr = val.replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(numStr) || 0;
}

export async function fetchEmployees(empresaId) {
  if (!empresaId) return []
  const { data } = await api.get(`/funcionarios/empresa/${empresaId}`)
  return data
}

export async function fetchEmployeeById(id) {
  const { data } = await api.get(`/funcionarios/${id}`)
  return data
}

export async function createEmployee(values) {
  const payload = {
    nome: values.nome,
    cpf: values.cpf,
    telefone: values.telefone,
    email: values.email,
    senha: values.senha,
    nascimento: normalizeDate(values.nascimento),
    empresaId: Number(values.empresaId),
    dataContratacao: normalizeDate(values.dataContratacao),
    salarioBase: parseCurrency(values.salarioBase),
    percentualComissao: Number(values.percentualComissao),
    nivelAcesso: values.nivelAcesso || "COLABORADOR"
  }

  const { data } = await api.post("/auth/admin/registrar/funcionario", payload)
  return data
}

export async function updateEmployee(id, values) {
  const payload = {
    nome: values.nome,
    cpf: values.cpf,
    telefone: values.telefone,
    email: values.email,
    senha: values.senha,
    nascimento: normalizeDate(values.nascimento),
    empresaId: Number(values.empresaId),
    dataContratacao: normalizeDate(values.dataContratacao),
    salarioBase: parseCurrency(values.salarioBase),
    percentualComissao: Number(values.percentualComissao),
    nivelAcesso: values.nivelAcesso || "COLABORADOR"
  }

  const { data } = await api.put(`/funcionarios/${id}`, payload)
  return data
}

export async function updateEmployeeProfile(id, values) {
  const payload = {
    nome: values.nome,
    cpf: values.cpf,
    telefone: values.telefone,
    email: values.email,
    senha: values.senha,
    nascimento: normalizeDate(values.nascimento),
    nivelAcesso: values.nivelAcesso || "COLABORADOR"
  }

  const { data } = await api.patch(`/funcionarios/perfil/${id}`, payload)
  return data
}

export async function exportEmployees(params) {
  const res = await api.get("/funcionarios/export", {
    params,
    responseType: "blob"
  })

  const url = window.URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement("a")
  a.href = url
  a.download = "funcionarios.csv"
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export const useEmployees = (empresaId) => {
  return useQuery({
    queryKey: ["employees", empresaId],
    queryFn: () => fetchEmployees(empresaId),
    staleTime: 30000
  })
}

export const useEmployee = (id) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => fetchEmployeeById(id),
    enabled: !!id,
    staleTime: 30000
  })
}

export const useCreateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    }
  })
}

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }) => updateEmployee(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      queryClient.invalidateQueries({ queryKey: ["employee", variables.id] })
    }
  })
}

export const useUpdateEmployeeProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }) => updateEmployeeProfile(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      queryClient.invalidateQueries({ queryKey: ["employee", variables.id] })
    }
  })
}

export async function deleteEmployee(id) {
  const { data } = await api.delete(`/funcionarios/${id}`)
  return data
}

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    }
  })
}
