import api from "./api"

function mapEstadoCivilToEnum(label) {
  switch (label) {
    case "Solteiro(a)": return "SOLTEIRO"
    case "Casado(a)": return "CASADO"
    case "Divorciado(a)": return "DIVORCIADO"
    case "Viúvo(a)": return "VIUVO"
    default: return null
  }
}

export function mapEstadoCivilEnumToLabel(value) {
  switch (value) {
    case "SOLTEIRO": return "Solteiro(a)"
    case "CASADO": return "Casado(a)"
    case "DIVORCIADO": return "Divorciado(a)"
    case "VIUVO": return "Viúvo(a)"
    default: return ""
  }
}

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

function buildEnderecoPayload(values) {
  return {
    cep: values.cep || "",
    logradouro: values.rua || "",
    complemento: values.complemento || "",
    numero: values.numero ? Number(values.numero) : 0,
    cidade: values.cidade || "",
    bairro: values.bairro || "",
    uf: values.uf || ""
  }
}

function hasEnderecoData(values) {
  return Boolean(
    values.cep ||
    values.rua ||
    values.numero ||
    values.complemento ||
    values.bairro ||
    values.cidade ||
    values.uf
  )
}

export async function fetchEmployees(params) {
  const config = params ? { params } : undefined
  const { data } = await api.get("/funcionarios", config)
  return data
}

export async function fetchEmployeeById(id) {
  const { data } = await api.get(`/funcionarios/${id}`)
  return data
}

export async function createEmployee(values) {
  let enderecoRef = null

  if (hasEnderecoData(values)) {
    const enderecoPayload = buildEnderecoPayload(values)
    const { data: endereco } = await api.post("/enderecos", enderecoPayload)
    if (endereco && endereco.enderecoid) {
      enderecoRef = { enderecoid: endereco.enderecoid }
    }
  }

  const payload = {
    nome: values.nome,
    cpf: values.cpf || "",
    rg: values.rg || "",
    telefone: values.telefone || "",
    email: values.email || "",
    nascimento: normalizeDate(values.nascimento),
    estadoCivil: mapEstadoCivilToEnum(values.estadoCivil),
    endereco: enderecoRef
  }

  const { data } = await api.post("/funcionarios", payload)
  return data
}

export async function updateEmployee(id, values) {
  let enderecoId = values.enderecoid || null

  if (hasEnderecoData(values)) {
    const enderecoPayload = buildEnderecoPayload(values)

    if (enderecoId) {
      await api.put(`/enderecos/${enderecoId}`, enderecoPayload)
    } else {
      const { data: novoEndereco } = await api.post("/enderecos", enderecoPayload)
      if (novoEndereco && novoEndereco.enderecoid) {
        enderecoId = novoEndereco.enderecoid
      }
    }
  }

  const payload = {
    nome: values.nome,
    cpf: values.cpf || "",
    rg: values.rg || "",
    telefone: values.telefone || "",
    email: values.email || "",
    nascimento: normalizeDate(values.nascimento),
    estadoCivil: mapEstadoCivilToEnum(values.estadoCivil),
    endereco: enderecoId ? { enderecoid: enderecoId } : null
  }

  const { data } = await api.put(`/funcionarios/${id}`, payload)
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
