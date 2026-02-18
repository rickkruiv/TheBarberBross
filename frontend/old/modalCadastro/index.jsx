
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMask } from "@react-input/mask";

function digits(s) { return String(s ?? "").replace(/\D/g, ""); }
function fmt(s) { const d = digits(s); if (d.length >= 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`; if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6,10)}`; return d; }

export default function ModalCadastro({ open, onClose, initialData, onSubmit, loading }) {
  const idReg = initialData?.id_cliente ?? null;
  const criando = !idReg;
  const telRef = useMask({ mask: "(99) 99999-9999", replacement: { 9: /\d/ } });
  const initialTelefone = fmt(initialData?.telefone || "");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      senha: "",
      telefone: initialTelefone
    },
    validationSchema: Yup.object({
      nome: Yup.string().required("Obrigatório"),
      email: Yup.string().email("E-mail inválido").required("Obrigatório"),
      telefone: Yup.string().test("fone", "Telefone inválido", v => { const n = digits(v); return n.length === 11 || n.length === 10; }).required("Obrigatório"),
      senha: criando ? Yup.string().min(6, "Minimo 6").required("Obrigatório") : Yup.string()
    }),
    onSubmit: async (v) => {
      const payload = { nome: v.nome, email: v.email, telefone: digits(v.telefone), ...(criando ? { senha: v.senha } : {}) };
      await onSubmit(payload);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{criando ? "Novo Cliente" : "Editar Cliente"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nome" name="nome" value={formik.values.nome} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.nome && Boolean(formik.errors.nome)} helperText={formik.touched.nome && formik.errors.nome} fullWidth />
          <TextField label="E-mail" name="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} fullWidth />
          {criando && <TextField label="Senha" name="senha" type="password" value={formik.values.senha} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.senha && Boolean(formik.errors.senha)} helperText={formik.touched.senha && formik.errors.senha} fullWidth />}
          <TextField label="Telefone" name="telefone" value={formik.values.telefone} onChange={(e) => formik.setFieldValue("telefone", e.target.value)} onBlur={(e) => formik.setFieldValue("telefone", fmt(e.target.value))} error={formik.touched.telefone && Boolean(formik.errors.telefone)} helperText={formik.touched.telefone && formik.errors.telefone} inputRef={telRef} inputProps={{ inputMode: "numeric" }} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={formik.handleSubmit} variant="contained" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
      </DialogActions>
    </Dialog>
  );
}
