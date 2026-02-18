
import React, { useState } from "react";
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Menu, MenuItem, Snackbar, Alert, Stack, Button, CircularProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/index.jsx";
import ModalCadastro from "../../components/modalCadastro/index.jsx";

function digits(s) { return String(s ?? "").replace(/\D/g, ""); }
function fmt(s) { const d = digits(s); if (d.length >= 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`; if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6,10)}`; return d; }
function normalizar(l) { const id = l.id_cliente ?? l.id ?? l.clienteId ?? l.codigo ?? null; const nome = l.nome ?? ""; const email = l.email ?? ""; const telefone = l.telefone ?? ""; return { id, nome, email, telefone, raw: l }; }

export default function Users() {
  const qc = useQueryClient();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selected, setSelected] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const [openModal, setOpenModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalKey, setModalKey] = useState(0);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/clientes")).data,
    select: (res) => { const arr = Array.isArray(res) ? res : (res?.content ?? []); return arr.map(normalizar); }
  });

  const mCreate = useMutation({
    mutationFn: async (body) => (await api.post("/clientes", body)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); setSnack({ open: true, msg: "Cliente criado", sev: "success" }); setOpenModal(false); setEditando(null); },
  });

  const mEdit = useMutation({
    mutationFn: async ({ id, body }) => (await api.put(`/clientes/${id}`, body)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); setSnack({ open: true, msg: "Cliente atualizado", sev: "success" }); setOpenModal(false); setEditando(null); },
  });

  const mDelete = useMutation({
    mutationFn: async (id) => (await api.delete(`/clientes/${id}`)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); setSnack({ open: true, msg: "Cliente excluído", sev: "success" }); },
  });

  const openMenu = Boolean(menuAnchor);
  const handleMenu = (evt, row) => { setMenuAnchor(evt.currentTarget); setSelected(row); };
  const closeMenu = () => setMenuAnchor(null);

  const handleNovo = () => { setEditando(null); setModalKey(k => k + 1); setOpenModal(true); };

  const onEditar = () => {
    closeMenu();
    if (!selected) return;
    setEditando(selected);
    setModalKey(k => k + 1);
    setOpenModal(true);
    if (!selected.telefone && selected.id) {
      api.get(`/clientes/${selected.id}`)
        .then(({ data }) => { const row = normalizar(data); setEditando(row); setModalKey(k => k + 1); })
        .catch(() => { setSnack({ open: true, msg: "Não foi possível carregar dados completos para edição.", sev: "warning" }); });
    }
  };

  const onExcluir = () => { closeMenu(); if (selected?.id) mDelete.mutate(selected.id); };

  const salvarModal = async (payload) => { if (editando?.id) mEdit.mutate({ id: editando.id, body: payload }); else mCreate.mutate(payload); };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h5">Cliente</Typography>
          <Button variant="contained" onClick={handleNovo} disabled={mCreate.isPending || mEdit.isPending}>Novo</Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id ?? row.email} hover>
                    <TableCell>{row.id ?? "-"}</TableCell>
                    <TableCell>{row.nome}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.telefone ? fmt(row.telefone) : "-"}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenu(e, row)} aria-label="mais ações"><MoreVertIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Sem Clientes</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Menu anchorEl={menuAnchor} open={openMenu} onClose={closeMenu} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
        <MenuItem onClick={onEditar} disabled={mEdit.isPending}>Editar</MenuItem>
        <MenuItem onClick={onExcluir} disabled={mDelete.isPending}>Excluir</MenuItem>
      </Menu>

      <ModalCadastro key={modalKey} open={openModal} onClose={() => { setOpenModal(false); setEditando(null); }} initialData={editando} onSubmit={salvarModal} loading={mCreate.isPending || mEdit.isPending} />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
