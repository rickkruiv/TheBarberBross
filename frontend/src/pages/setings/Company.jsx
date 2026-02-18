import React from "react"
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  InputAdornment
} from "@mui/material"
import Business from "@mui/icons-material/Business"
import Place from "@mui/icons-material/Place"
import Call from "@mui/icons-material/Call"
import Share from "@mui/icons-material/Share"
import AccessTime from "@mui/icons-material/AccessTime"
import CloudUpload from "@mui/icons-material/CloudUpload"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import SectionCard from "../../components/SectionCard/SectionCard"
import { fetchEmpresaAtual, salvarEmpresa } from "../../services/empresa"
import { fetchSocialMedias, upsertSocialMedia, deleteSocialMedia } from "../../services/socialMedia"
import { toastError, toastSuccess } from "../../services/toast"
import DefaultLoading from "../../components/loading/DefaultLoading"

const schema = Yup.object({
  nomeFantasia: Yup.string().required("Informe o nome fantasia"),
  razaoSocial: Yup.string().required("Informe a razão social"),
  cnpj: Yup.string().required("Informe o CNPJ"),
  telefonePrincipal: Yup.string().required("Informe o telefone"),
  email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
  cep: Yup.string().required("Informe o CEP"),
  logradouro: Yup.string().required("Informe a rua/avenida"),
  numero: Yup.string().required("Informe o número"),
  bairro: Yup.string().required("Informe o bairro"),
  cidade: Yup.string().required("Informe a cidade"),
  uf: Yup.string().required("UF obrigatória")
})

const defaultValues = {
  empresaId: null,
  enderecoid: null,
  nomeFantasia: "",
  razaoSocial: "",
  cnpj: "",
  descricao: "",
  telefonePrincipal: "",
  telefoneSecundario: "",
  email: "",
  website: "",
  tipoAssinatura: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  whatsappBusiness: "",
  segAbertura: "",
  segFechamento: "",
  terAbertura: "",
  terFechamento: "",
  quaAbertura: "",
  quaFechamento: "",
  quiAbertura: "",
  quiFechamento: "",
  sexAbertura: "",
  sexFechamento: "",
  sabAbertura: "",
  sabFechamento: "",
  domAbertura: "",
  domFechamento: ""
}

const colunaMetade = { flex: 1, minWidth: 0 }
const linhaWrap = { display: "flex", flexWrap: "wrap", gap: 2 }
const campoFlex = (min = 220) => ({ flex: `1 1 ${min}px` })
const campoPequeno = { flex: "0 0 120px" }
const horaBox = { flex: "1 1 180px" }

export default function Company() {
  const [initialValues, setInitialValues] = React.useState(defaultValues)
  const [loading, setLoading] = React.useState(true)
  const [logoName, setLogoName] = React.useState("")


  const [socialIds, setSocialIds] = React.useState({
    instagram: null,
    facebook: null,
    tiktok: null,
    whatsappBusiness: null
  })

  React.useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const empresa = await fetchEmpresaAtual()
        if (!empresa || !active) {
          setLoading(false)
          return
        }


        let instagram = ""
        let facebook = ""
        let tiktok = ""
        let whatsappBusiness = ""
        const ids = {
          instagram: null,
          facebook: null,
          tiktok: null,
          whatsappBusiness: null
        }

        try {
          const allSocials = await fetchSocialMedias()
          const empresaSocials = (allSocials || []).filter(
            s => s.empresaId === empresa.empresaId
          )

          const keys = ["instagram", "facebook", "tiktok", "whatsappBusiness"]
          empresaSocials.slice(0, 4).forEach((s, idx) => {
            const key = keys[idx]
            ids[key] = s.socialMediaId
            if (key === "instagram") instagram = s.url || ""
            if (key === "facebook") facebook = s.url || ""
            if (key === "tiktok") tiktok = s.url || ""
            if (key === "whatsappBusiness") whatsappBusiness = s.url || ""
          })
        } catch {

        }

        if (!active) return

        setSocialIds(ids)
        setInitialValues(v => ({
          ...v,
          empresaId: empresa.empresaId,
          nomeFantasia: empresa.nomeFantasia || "",
          razaoSocial: empresa.razaoSocial || "",
          cnpj: empresa.cnpj || "",
          telefonePrincipal: empresa.telefone || "",
          email: empresa.email || "",
          tipoAssinatura: empresa.tipoAssinatura || "",
          cep: empresa.endereco?.cep || "",
          logradouro: empresa.endereco?.logradouro || "",
          numero:
            empresa.endereco?.numero != null
              ? String(empresa.endereco.numero)
              : "",
          complemento: empresa.endereco?.complemento || "",
          bairro: empresa.endereco?.bairro || "",
          cidade: empresa.endereco?.cidade || "",
          uf: empresa.endereco?.uf || "",
          enderecoid: empresa.endereco?.enderecoid || null,
          instagram,
          facebook,
          tiktok,
          whatsappBusiness
        }))
      } catch {
        toastError("Falha ao carregar dados da barbearia")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <DefaultLoading loadMessage="Carregando empresa..."/>
    )
  }

  const handleLogoChange = e => {
    const file = e.target.files?.[0]
    if (file) setLogoName(file.name)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {

            const saved = await salvarEmpresa(values)
            const empresaId = saved.empresaId

   
            const keys = ["instagram", "facebook", "tiktok", "whatsappBusiness"]
            const newIds = { ...socialIds }

            for (const key of keys) {
              const value = (values[key] || "").trim()
              const currentId = socialIds[key]

              if (!value && currentId) {
                await deleteSocialMedia(currentId)
                newIds[key] = null
                continue
              }

              if (value) {
                const savedSm = await upsertSocialMedia({
                  id: currentId,
                  url: value,
                  empresaId
                })
                newIds[key] = savedSm.socialMediaId
              }
            }

            setSocialIds(newIds)
            setInitialValues(prev => ({
              ...prev,
              empresaId: saved.empresaId,
              enderecoid: saved.endereco?.enderecoid || prev.enderecoid
            }))

            toastSuccess("Dados da barbearia salvos com sucesso")
          } catch (e) {
            toastError("Falha ao salvar dados da barbearia")
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, submitForm }) => (
          <Form noValidate>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Empresa + Endereço */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3
                }}
              >
                <Box sx={colunaMetade}>
                  <SectionCard icon={<Business fontSize="small" />} title="Dados da Empresa">
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Paper
                          variant="outlined"
                          sx={{
                            width: 120,
                            height: 120,
                            borderStyle: "dashed",
                            borderRadius: 3,
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "#0C1116"
                          }}
                        >
                          <CloudUpload fontSize="large" />
                        </Paper>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Button
                            variant="contained"
                            component="label"
                            sx={{
                              bgcolor: "#62B6A5",
                              color: "#0B1117",
                              alignSelf: "flex-start",
                              "&:hover": { bgcolor: "#58a897" }
                            }}
                          >
                            Escolher arquivo
                            <input
                              type="file"
                              hidden
                              accept="image/png,image/jpeg,image/svg+xml"
                              onChange={handleLogoChange}
                            />
                          </Button>
                          <Typography variant="caption" color="text.secondary">
                            PNG, JPG ou SVG (máx. 2MB)
                          </Typography>
                          {logoName && (
                            <Typography variant="caption" color="text.secondary">
                              Selecionado: {logoName}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Nome Fantasia"
                            name="nomeFantasia"
                            value={values.nomeFantasia}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.nomeFantasia && Boolean(errors.nomeFantasia)}
                            helperText={touched.nomeFantasia && errors.nomeFantasia}
                          />
                        </Box>
                      </Box>

                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Razão Social"
                            name="razaoSocial"
                            value={values.razaoSocial}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.razaoSocial && Boolean(errors.razaoSocial)}
                            helperText={touched.razaoSocial && errors.razaoSocial}
                          />
                        </Box>
                      </Box>

                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex(220)}>
                          <TextField
                            fullWidth
                            label="CNPJ"
                            name="cnpj"
                            value={values.cnpj}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.cnpj && Boolean(errors.cnpj)}
                            helperText={touched.cnpj && errors.cnpj}
                          />
                        </Box>
                      </Box>

                      <Box sx={linhaWrap}>
                        <Box sx={{ flex: "1 1 260px" }}>
                          <TextField
                            fullWidth
                            label="Descrição / Sobre"
                            name="descricao"
                            value={values.descricao}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            multiline
                            minRows={3}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </SectionCard>
                </Box>

                <Box sx={colunaMetade}>
                  <SectionCard icon={<Place fontSize="small" />} title="Endereço">
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex(160)}>
                          <TextField
                            fullWidth
                            label="CEP"
                            name="cep"
                            value={values.cep}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.cep && Boolean(errors.cep)}
                            helperText={touched.cep && errors.cep}
                          />
                        </Box>
                      </Box>

                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Rua/Avenida"
                            name="logradouro"
                            value={values.logradouro}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.logradouro && Boolean(errors.logradouro)}
                            helperText={touched.logradouro && errors.logradouro}
                          />
                        </Box>
                      </Box>

                      <Box sx={linhaWrap}>
                        <Box sx={campoPequeno}>
                          <TextField
                            fullWidth
                            label="Número"
                            name="numero"
                            value={values.numero}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.numero && Boolean(errors.numero)}
                            helperText={touched.numero && errors.numero}
                          />
                        </Box>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Complemento"
                            name="complemento"
                            value={values.complemento}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Box>
                      </Box>

                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Bairro"
                            name="bairro"
                            value={values.bairro}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.bairro && Boolean(errors.bairro)}
                            helperText={touched.bairro && errors.bairro}
                          />
                        </Box>
                      </Box>

                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Cidade"
                            name="cidade"
                            value={values.cidade}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.cidade && Boolean(errors.cidade)}
                            helperText={touched.cidade && errors.cidade}
                          />
                        </Box>
                        <Box sx={campoPequeno}>
                          <TextField
                            fullWidth
                            label="Estado"
                            name="uf"
                            value={values.uf}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.uf && Boolean(errors.uf)}
                            helperText={touched.uf && errors.uf}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </SectionCard>
                </Box>
              </Box>

              {/* Contatos + Redes sociais */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3
                }}
              >
                <Box sx={colunaMetade}>
                  <SectionCard icon={<Call fontSize="small" />} title="Contatos">
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Telefone Principal"
                            name="telefonePrincipal"
                            value={values.telefonePrincipal}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.telefonePrincipal &&
                              Boolean(errors.telefonePrincipal)
                            }
                            helperText={
                              touched.telefonePrincipal && errors.telefonePrincipal
                            }
                          />
                        </Box>
                      </Box>
                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Telefone Secundário"
                            name="telefoneSecundario"
                            value={values.telefoneSecundario}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Box>
                      </Box>
                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="E-mail"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                          />
                        </Box>
                      </Box>
                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Website"
                            name="website"
                            value={values.website}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Typography variant="body2">https://</Typography>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </SectionCard>
                </Box>

                <Box sx={colunaMetade}>
                  <SectionCard icon={<Share fontSize="small" />} title="Redes Sociais">
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Instagram"
                            name="instagram"
                            value={values.instagram}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="@barberbross"
                          />
                        </Box>
                      </Box>
                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="Facebook"
                            name="facebook"
                            value={values.facebook}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="facebook.com/barberbross"
                          />
                        </Box>
                      </Box>
                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="TikTok"
                            name="tiktok"
                            value={values.tiktok}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="@barberbross"
                          />
                        </Box>
                      </Box>
                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <TextField
                            fullWidth
                            label="WhatsApp Business"
                            name="whatsappBusiness"
                            value={values.whatsappBusiness}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="(11) 98888-8888"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </SectionCard>
                </Box>
              </Box>

              {/* Horário de funcionamento (apenas front) */}
              <Box>
                <SectionCard icon={<AccessTime fontSize="small" />} title="Horário de Funcionamento">
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {[
                      { key: "seg", label: "Segunda-feira" },
                      { key: "ter", label: "Terça-feira" },
                      { key: "qua", label: "Quarta-feira" },
                      { key: "qui", label: "Quinta-feira" },
                      { key: "sex", label: "Sexta-feira" },
                      { key: "sab", label: "Sábado" },
                      { key: "dom", label: "Domingo" }
                    ].map(dia => (
                      <Box key={dia.key} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant="subtitle2">{dia.label}</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                          <Box sx={horaBox}>
                            <TextField
                              fullWidth
                              type="time"
                              label="Abertura"
                              InputLabelProps={{ shrink: true }}
                              name={`${dia.key}Abertura`}
                              value={values[`${dia.key}Abertura`] || ""}
                              onChange={handleChange}
                            />
                          </Box>
                          <Box sx={horaBox}>
                            <TextField
                              fullWidth
                              type="time"
                              label="Fechamento"
                              InputLabelProps={{ shrink: true }}
                              name={`${dia.key}Fechamento`}
                              value={values[`${dia.key}Fechamento`] || ""}
                              onChange={handleChange}
                            />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </SectionCard>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  type="button"
                  onClick={submitForm}
                  disabled={isSubmitting}
                  variant="contained"
                  sx={{
                    bgcolor: "#62B6A5",
                    color: "#0B1117",
                    px: 4,
                    "&:hover": { bgcolor: "#58a897" }
                  }}
                >
                  Salvar alterações
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
