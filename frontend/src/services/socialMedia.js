import api from "./api"

export async function fetchSocialMedias() {
  const { data } = await api.get("/socialmedias")
  return data
}

export async function upsertSocialMedia({ id, url, empresaId }) {
  if (id) {
    const { data } = await api.put(`/socialmedias/${id}`, {
      socialMediaId: id,
      url,
      empresaId
    })
    return data
  }

  const { data } = await api.post("/socialmedias", {
    url,
    empresaId
  })
  return data
}

export async function deleteSocialMedia(id) {
  await api.delete(`/socialmedias/${id}`)
}
