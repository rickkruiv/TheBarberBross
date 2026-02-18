import api from "./api"

export async function fetchEmpresaAtual() {
  const { data } = await api.get("/empresas")
  if (Array.isArray(data) && data.length > 0) return data[0]
  return null
}

function buildEnderecoFromValues(values) {
  return {
    enderecoid: values.enderecoid || undefined,
    cep: values.cep || "",
    logradouro: values.logradouro || "",
    complemento: values.complemento || "",
    numero: values.numero ? Number(values.numero) : 0,
    bairro: values.bairro || "",
    cidade: values.cidade || "",
    uf: values.uf || ""
  }
}

export async function salvarEmpresa(values) {
  const payload = {
    empresaId: values.empresaId || undefined,
    razaoSocial: values.razaoSocial,
    nomeFantasia: values.nomeFantasia,
    cnpj: values.cnpj,
    telefone: values.telefonePrincipal,
    email: values.email,
    tipoAssinatura: values.tipoAssinatura || "BASICO",
    endereco: buildEnderecoFromValues(values)
  }

  if (values.empresaId) {
    const { data } = await api.put(`/empresas/${values.empresaId}`, payload)
    return data
  }

  const { data } = await api.post("/empresas", payload)
  return data
}
