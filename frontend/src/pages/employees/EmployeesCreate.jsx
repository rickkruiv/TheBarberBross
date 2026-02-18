import React from "react"
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  InputAdornment,
  IconButton,
  Collapse
} from "@mui/material"
import PersonOutline from "@mui/icons-material/PersonOutline"
import WorkOutline from "@mui/icons-material/WorkOutline"
import PaidOutlined from "@mui/icons-material/PaidOutlined"
import SecurityOutlined from "@mui/icons-material/SecurityOutlined"
import EmailOutlined from "@mui/icons-material/EmailOutlined"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import MaskedTextField from "../../components/MaskedTextField/MaskedTextField"
import CurrencyField from "../../components/CurrencyField/CurrencyField"
import DateField from "../../components/DateField/DateField"
import SectionCard from "../../components/SectionCard/SectionCard"
import { BenefitSwitchRow, BenefitCheckRow } from "../../components/BenefitRow/BenefitRow"
import AvatarUpload from "../../components/AvatarUpload/AvatarUpload"
import ActionBar from "../../components/ActionBar/ActionBar"
import { createEmployee, updateEmployee, fetchEmployeeById, mapEstadoCivilEnumToLabel } from "../../services/employees"
import { toastSuccess, toastError } from "../../services/toast"
import DefaultLoading from "../../components/loading/DefaultLoading"

const schema = Yup.object({
  nome: Yup.string().required("Informe o nome"),
  cpf: Yup.string().required("CPF obrigatório"),
  email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
  telefone: Yup.string().required("Informe o telefone"),
  usuario: Yup.string().email("E-mail inválido").required("Informe o usuário"),
  senha: Yup.string().min(8).required("Informe a senha"),
  confirmarSenha: Yup.string().oneOf([Yup.ref("senha")]).required("Confirme a senha"),
  salario: Yup.string().required("Informe o salário base")
})

const estadosCivis = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"]
const departamentos = ["Atendimento", "Operações", "Compras", "Administrativo"]
const locais = ["Unidade Centro", "Unidade Norte", "Unidade Sul"]
const horarios = ["08:00 - 17:00", "09:00 - 18:00", "10:00 - 19:00"]

const defaultInitialValues = {
  nome: "",
  cpf: "",
  rg: "",
  nascimento: "",
  estadoCivil: "",
  telefone: "",
  email: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  cargo: "",
  departamento: "",
  regime: "CLT",
  admissao: "",
  supervisor: "",
  local: "",
  horario: "",
  observacoes: "",
  salario: "R$ 0,00",
  vtAtivo: false,
  vr: false,
  va: false,
  planoSaude: "",
  beneficios: [],
  novoBeneficio: "",
  usuario: "",
  senha: "",
  confirmarSenha: "",
  nivelAcesso: "Barbeiro"
}

const fieldCol = {
  flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" }
}

const smallFieldCol = {
  flex: { xs: "1 1 100%", md: "1 1 180px" }
}

function formatDateFromApi(iso) {
  if (!iso) return ""
  const [ano, mes, dia] = iso.split("-")
  if (!ano || !mes || !dia) return ""
  return `${dia}/${mes}/${ano}`
}

export default function EmployeesCreate() {
  const [showPass, setShowPass] = React.useState(false)
  const [showPass2, setShowPass2] = React.useState(false)

  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isEdit = !!id && location.pathname.endsWith("/editar")

  const [initialValues, setInitialValues] = React.useState(defaultInitialValues)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchEmployeeById(id)
      .then(emp => {
        setInitialValues({
          ...defaultInitialValues,
          nome: emp.nome || "",
          cpf: emp.cpf || "",
          rg: emp.rg || "",
          nascimento: emp.nascimento ? formatDateFromApi(emp.nascimento) : "",
          estadoCivil: mapEstadoCivilEnumToLabel(emp.estadoCivil),
          telefone: emp.telefone || "",
          email: emp.email || ""
        })
      })
      .catch(() => {
        toastError("Falha ao carregar funcionário")
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      
      <DefaultLoading loadMessage="Carregando funcionário..."/>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { resetForm }) => {
          try {
            if (isEdit) {
              await updateEmployee(id, values)
              toastSuccess("Funcionário atualizado com sucesso")
              navigate("/funcionarios/visualizar")
            } else {
              await createEmployee(values)
              toastSuccess("Funcionário salvo com sucesso")
              resetForm()
            }
          } catch (e) {
            toastError(e, isEdit ? "Falha ao atualizar funcionário" : "Falha ao salvar funcionário")
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => (
          <Form noValidate>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <SectionCard icon={<PersonOutline fontSize="small" />} title="Dados Pessoais">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      justifyItems: "center",
                      alignItems: "center",
                      width: { xs: "100%", md: 260 }
                    }}
                  >
                    <AvatarUpload />
                  </Box>
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={fieldCol}>
                        <TextField
                          fullWidth
                          label="Nome Completo"
                          name="nome"
                          value={values.nome}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.nome && Boolean(errors.nome)}
                          helperText={touched.nome && errors.nome}
                        />
                      </Box>
                      <Box sx={fieldCol}>
                        <MaskedTextField
                          fullWidth
                          label="CPF"
                          name="cpf"
                          mask="000.000.000-00"
                          value={values.cpf}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.cpf && Boolean(errors.cpf)}
                          helperText={touched.cpf && errors.cpf}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={fieldCol}>
                        <MaskedTextField
                          fullWidth
                          label="RG"
                          name="rg"
                          mask="00.000.000-0"
                          value={values.rg}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                      <Box sx={fieldCol}>
                        <DateField
                          label="Data de Nascimento"
                          name="nascimento"
                          value={values.nascimento}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={fieldCol}>
                        <TextField
                          select
                          fullWidth
                          label="Estado Civil"
                          name="estadoCivil"
                          value={values.estadoCivil}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {estadosCivis.map(e => (
                            <MenuItem key={e} value={e}>
                              {e}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                      <Box sx={fieldCol}>
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
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <TextField
                        fullWidth
                        type="email"
                        label="E-mail"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Box>

                    <Box sx={{ my: 2, borderBottom: "1px solid #1E2733" }} />

                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
                      Endereço
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={smallFieldCol}>
                        <MaskedTextField
                          fullWidth
                          label="CEP"
                          name="cep"
                          mask="00000-000"
                          value={values.cep}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                      <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(100% - 200px)" } }}>
                        <TextField
                          fullWidth
                          label="Rua/Avenida"
                          name="rua"
                          value={values.rua}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={smallFieldCol}>
                        <TextField
                          fullWidth
                          label="Número"
                          name="numero"
                          value={values.numero}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                      <Box sx={fieldCol}>
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

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={fieldCol}>
                        <TextField
                          fullWidth
                          label="Bairro"
                          name="bairro"
                          value={values.bairro}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                      <Box sx={fieldCol}>
                        <TextField
                          fullWidth
                          label="Cidade"
                          name="cidade"
                          value={values.cidade}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                      <Box sx={smallFieldCol}>
                        <TextField
                          fullWidth
                          label="UF"
                          name="uf"
                          value={values.uf}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </SectionCard>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <SectionCard icon={<WorkOutline fontSize="small" />} title="Dados Profissionais">
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Box sx={fieldCol}>
                          <TextField
                            fullWidth
                            label="Cargo"
                            name="cargo"
                            value={values.cargo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Box>
                        <Box sx={fieldCol}>
                          <TextField
                            select
                            fullWidth
                            label="Setor/Departamento"
                            name="departamento"
                            value={values.departamento}
                            onChange={handleChange}
                          >
                            {departamentos.map(d => (
                              <MenuItem key={d} value={d}>
                                {d}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      </Box>

                      <Box>
                        <ToggleButtonGroup
                          exclusive
                          fullWidth
                          value={values.regime}
                          onChange={(_, v) => v && setFieldValue("regime", v)}
                        >
                          <ToggleButton value="CLT">
                            <Box sx={{ textAlign: "left" }}>
                              <Typography>CLT</Typography>
                              <Collapse in={values.regime === "CLT"} timeout="auto" unmountOnExit>
                                <Typography variant="caption">Consolidação das Leis do Trabalho</Typography>
                              </Collapse>
                            </Box>
                          </ToggleButton>
                          <ToggleButton value="ESTAGIO">
                            <Box sx={{ textAlign: "left" }}>
                              <Typography>Estágio</Typography>
                              <Collapse in={values.regime === "ESTAGIO"} timeout="auto" unmountOnExit>
                                <Typography variant="caption">Contrato de estágio</Typography>
                              </Collapse>
                            </Box>
                          </ToggleButton>
                          <ToggleButton value="PJ">
                            <Box sx={{ textAlign: "left" }}>
                              <Typography>PJ</Typography>
                              <Collapse in={values.regime === "PJ"} timeout="auto" unmountOnExit>
                                <Typography variant="caption">Pessoa Jurídica</Typography>
                              </Collapse>
                            </Box>
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Box sx={fieldCol}>
                          <DateField
                            label="Data de Admissão"
                            name="admissao"
                            value={values.admissao}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            withAttach
                          />
                        </Box>
                        <Box sx={fieldCol}>
                          <TextField
                            fullWidth
                            label="Supervisor Responsável"
                            name="supervisor"
                            value={values.supervisor}
                            onChange={handleChange}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Box sx={fieldCol}>
                          <TextField
                            select
                            fullWidth
                            label="Local de Trabalho"
                            name="local"
                            value={values.local}
                            onChange={handleChange}
                          >
                            {locais.map(l => (
                              <MenuItem key={l} value={l}>
                                {l}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                        <Box sx={fieldCol}>
                          <TextField
                            select
                            fullWidth
                            label="Horário de Trabalho"
                            name="horario"
                            value={values.horario}
                            onChange={handleChange}
                          >
                            {horarios.map(h => (
                              <MenuItem key={h} value={h}>
                                {h}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      </Box>

                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          minRows={3}
                          label="Observações Profissionais"
                          name="observacoes"
                          value={values.observacoes}
                          onChange={handleChange}
                        />
                      </Box>
                    </Box>
                  </SectionCard>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <SectionCard icon={<PaidOutlined fontSize="small" />} title="Benefícios & Salário">
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box>
                        <CurrencyField
                          fullWidth
                          label="Salário Base *"
                          value={values.salario}
                          onChange={v => setFieldValue("salario", v)}
                          error={touched.salario && Boolean(errors.salario)}
                          helperText={touched.salario && errors.salario}
                        />
                      </Box>
                      <Box>
                        <BenefitSwitchRow
                          title="Vale-Transporte"
                          subtitle="Auxílio para deslocamento casa-trabalho"
                          checked={values.vtAtivo}
                          onChange={e => setFieldValue("vtAtivo", e.target.checked)}
                        />
                      </Box>
                      <Box>
                        <BenefitCheckRow
                          title="Vale-Refeição"
                          subtitle="Para refeições em restaurantes"
                          checked={values.vr}
                          onChange={e => setFieldValue("vr", e.target.checked)}
                        />
                      </Box>
                      <Box>
                        <BenefitCheckRow
                          title="Vale-Alimentação"
                          subtitle="Para compras em supermercados"
                          checked={values.va}
                          onChange={e => setFieldValue("va", e.target.checked)}
                        />
                      </Box>
                      <Box>
                        <TextField
                          select
                          fullWidth
                          label="Plano de Saúde"
                          name="planoSaude"
                          value={values.planoSaude}
                          onChange={handleChange}
                        >
                          <MenuItem value="">Selecione o plano de saúde</MenuItem>
                          <MenuItem value="Unimed">Unimed</MenuItem>
                          <MenuItem value="Amil">Amil</MenuItem>
                          <MenuItem value="Hapvida">Hapvida</MenuItem>
                        </TextField>
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            fullWidth
                            label="Outros Benefícios"
                            name="novoBeneficio"
                            value={values.novoBeneficio}
                            onChange={handleChange}
                          />
                          <Box
                            component="button"
                            onClick={() => {
                              if (values.novoBeneficio?.trim()) {
                                setFieldValue("beneficios", [...values.beneficios, values.novoBeneficio.trim()])
                                setFieldValue("novoBeneficio", "")
                              }
                            }}
                            style={{
                              border: 0,
                              borderRadius: 12,
                              padding: "0 16px",
                              background: "#62B6A5",
                              color: "#0B1117",
                              fontWeight: 700,
                              cursor: "pointer"
                            }}
                          >
                            +
                          </Box>
                        </Box>
                        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {values.beneficios.map((b, i) => (
                            <Chip
                              key={i}
                              label={b}
                              onDelete={() => {
                                const c = [...values.beneficios]
                                c.splice(i, 1)
                                setFieldValue("beneficios", c)
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                          Exemplos: Gympass, Seguro de vida, Auxílio creche, Participação nos lucros
                        </Typography>
                      </Box>
                    </Box>
                  </SectionCard>
                </Box>
              </Box>

              <SectionCard icon={<SecurityOutlined fontSize="small" />} title="Credenciais de Acesso ao Sistema">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Nome de Usuário ou E-mail"
                      name="usuario"
                      value={values.usuario}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.usuario && Boolean(errors.usuario)}
                      helperText={touched.usuario && errors.usuario}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined />
                          </InputAdornment>
                        )
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Este será o login para acessar o sistema
                    </Typography>
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="Senha"
                      type={showPass ? "text" : "password"}
                      name="senha"
                      value={values.senha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.senha && Boolean(errors.senha)}
                      helperText={touched.senha && errors.senha}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPass(s => !s)} edge="end">
                              {showPass ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="Confirmar Senha"
                      type={showPass2 ? "text" : "password"}
                      name="confirmarSenha"
                      value={values.confirmarSenha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmarSenha && Boolean(errors.confirmarSenha)}
                      helperText={touched.confirmarSenha && errors.confirmarSenha}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPass2(s => !s)} edge="end">
                              {showPass2 ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>
                  <Box>
                    <TextField
                      select
                      fullWidth
                      label="Nível de Acesso"
                      name="nivelAcesso"
                      value={values.nivelAcesso}
                      onChange={handleChange}
                    >
                      <MenuItem value="Barbeiro">Barbeiro</MenuItem>
                      <MenuItem value="Gerente">Gerente</MenuItem>
                      <MenuItem value="Administrador">Administrador</MenuItem>
                    </TextField>
                    <Box
                      sx={{
                        mt: 1,
                        pl: 2,
                        borderLeft: "4px solid #62B6A5",
                        color: "text.secondary"
                      }}
                    >
                      Acesso aos próprios agendamentos
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        border: "1px solid #1E2733",
                        bgcolor: "#141B24",
                        p: 2,
                        borderRadius: 2
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, mb: 1 }}>Dicas de Segurança</Typography>
                      <Box sx={{ display: "grid", gap: 0.5 }}>
                        <Typography variant="body2">Use no mínimo 8 caracteres</Typography>
                        <Typography variant="body2">Combine letras maiúsculas e minúsculas</Typography>
                        <Typography variant="body2">Adicione números e símbolos especiais</Typography>
                        <Typography variant="body2">Evite informações pessoais óbvias</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </SectionCard>

              <Box>
                <ActionBar
                  onCancel={() => toastError("Cadastro cancelado")}
                  onSubmit={submitForm}
                  onPreview={() => toastSuccess("Pré-visualização gerada")}
                />
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
