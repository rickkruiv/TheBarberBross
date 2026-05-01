import React, { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem
} from "@mui/material"
import Business from "@mui/icons-material/Business"
import Place from "@mui/icons-material/Place"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import SectionCard from "../../shared/SectionCard/SectionCard"
import MaskedTextField from "../../components/MaskedTextField/MaskedTextField"
import { useEmpresa, useUpdateEmpresa } from "../../services/empresa"
import { toastError, toastSuccess } from "../../services/toast"
import DefaultLoading from "../../shared/Loading/DefaultLoading"
import { useAuth } from "../../contexts/AuthContext"

const schema = Yup.object({
  nomeFantasia: Yup.string().required("Informe o nome fantasia"),
  razaoSocial: Yup.string().required("Informe a razão social"),
  cnpj: Yup.string().required("Informe o CNPJ"),
  telefone: Yup.string().required("Informe o telefone"),
  email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
  tipoAssinatura: Yup.string().required("Selecione o tipo de assinatura"),
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
  telefone: "",
  email: "",
  tipoAssinatura: "BASICO",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: ""
}

const colunaMetade = { flex: 1, minWidth: 0 }
const linhaWrap = { display: "flex", flexWrap: "wrap", gap: 2 }
const campoFlex = (min = 220) => ({ flex: `1 1 ${min}px` })
const campoPequeno = { flex: "0 0 120px" }

export default function DadosBarbearia() {
  const { user } = useAuth()
  const [initialValues, setInitialValues] = useState(defaultValues)

  const { data: empresa, isLoading: loadingEmp } = useEmpresa(user?.empresaId)
  const updateMutation = useUpdateEmpresa()

  useEffect(() => {
    if (empresa) {
      setInitialValues({
        empresaId: empresa.empresaId || empresa.id,
        enderecoid: empresa.endereco?.enderecoid || empresa.endereco?.id || null,
        nomeFantasia: empresa.nomeFantasia || "",
        razaoSocial: empresa.razaoSocial || "",
        cnpj: empresa.cnpj || "",
        telefone: empresa.telefone || "",
        email: empresa.email || "",
        tipoAssinatura: empresa.tipoAssinatura || "BASICO",
        cep: empresa.endereco?.cep || "",
        logradouro: empresa.endereco?.logradouro || "",
        numero: empresa.endereco?.numero != null ? String(empresa.endereco.numero) : "",
        complemento: empresa.endereco?.complemento || "",
        bairro: empresa.endereco?.bairro || "",
        cidade: empresa.endereco?.cidade || "",
        uf: empresa.endereco?.uf || ""
      })
    }
  }, [empresa])

  if (loadingEmp) {
    return (
      <DefaultLoading loadMessage="Carregando dados da barbearia..." />
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
        Minha Barbearia
      </Typography>
      
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await updateMutation.mutateAsync(values)
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
                        <Box sx={campoFlex(220)}>
                          <MaskedTextField
                            fullWidth
                            label="CNPJ"
                            name="cnpj"
                            mask="00.000.000/0000-00"
                            value={values.cnpj}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.cnpj && Boolean(errors.cnpj)}
                            helperText={touched.cnpj && errors.cnpj}
                          />
                        </Box>
                      </Box>

                      <Box sx={linhaWrap}>
                        <Box sx={campoFlex()}>
                          <MaskedTextField
                            fullWidth
                            label="Telefone"
                            name="telefone"
                            mask="(00) 00000-0000"
                            value={values.telefone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.telefone && Boolean(errors.telefone)}
                            helperText={touched.telefone && errors.telefone}
                          />
                        </Box>
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
                            select
                            fullWidth
                            label="Tipo de Assinatura"
                            name="tipoAssinatura"
                            value={values.tipoAssinatura}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.tipoAssinatura && Boolean(errors.tipoAssinatura)}
                            helperText={touched.tipoAssinatura && errors.tipoAssinatura}
                          >
                            <MenuItem value="BASICO">Básico</MenuItem>
                            <MenuItem value="PREMIUM">Premium</MenuItem>
                            <MenuItem value="PRO">Pro</MenuItem>
                          </TextField>
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
                          <MaskedTextField
                            fullWidth
                            label="CEP"
                            name="cep"
                            mask="00000-000"
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
                            label="UF"
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

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  type="button"
                  onClick={submitForm}
                  disabled={isSubmitting}
                  variant="contained"
                  sx={{
                    bgcolor: "primary.main",
                    color: "background.default",
                    px: 4,
                    "&:hover": { bgcolor: "text.tertiary" }
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
