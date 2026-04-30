import api from "./api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export async function fetchEmpresaById(empresaId) {
  if (!empresaId) return null;
  const { data } = await api.get(`/empresas/${empresaId}`)
  return data
}

export async function fetchEnderecoEmpresa(empresaId) {
  try {
    const { data } = await api.get(`/empresas/${empresaId}/endereco`)
    return data
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

export async function salvarEmpresa(values) {
  const payload = {
    razaoSocial: values.razaoSocial,
    nomeFantasia: values.nomeFantasia,
    cnpj: values.cnpj,
    telefone: values.telefone,
    email: values.email,
    tipoAssinatura: values.tipoAssinatura || "BASICO"
  }

  let empresaId = values.empresaId;
  let savedEmpresa;

  if (empresaId) {
    const { data } = await api.put(`/empresas/${empresaId}`, payload)
    savedEmpresa = data;
  } else {
    const { data } = await api.post("/empresas", payload)
    savedEmpresa = data;
    empresaId = savedEmpresa.empresaId || savedEmpresa.id; // handle case if returned id is just 'id'
  }

  // Handle Endereço se os campos de endereço foram preenchidos
  if (empresaId && values.cep) {
    const enderecoPayload = {
      cep: values.cep || "",
      logradouro: values.logradouro || "",
      complemento: values.complemento || "",
      numero: values.numero ? String(values.numero) : "S/N",
      bairro: values.bairro || "",
      cidade: values.cidade || "",
      uf: values.uf || ""
    }

    if (values.enderecoid) {
      await api.put(`/empresas/${empresaId}/endereco`, enderecoPayload)
    } else {
      await api.post(`/empresas/${empresaId}/endereco`, enderecoPayload)
    }
  }

  return savedEmpresa;
}

export const useEmpresa = (empresaId) => {
  return useQuery({
    queryKey: ["empresa", empresaId],
    queryFn: async () => {
      if (!empresaId) return null;
      const empresa = await fetchEmpresaById(empresaId)
      if (empresa) {
        const endereco = await fetchEnderecoEmpresa(empresaId)
        if (endereco) {
          empresa.endereco = endereco;
        }
      }
      return empresa;
    },
    enabled: !!empresaId,
    staleTime: 300000
  })
}

export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: salvarEmpresa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresa"] })
    }
  })
}

