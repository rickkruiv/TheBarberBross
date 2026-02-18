import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchServices, deleteService } from "../../services/services";
import { toastError, toastSuccess } from "../../services/toast";
import DefaultLoading from "../../components/loading/DefaultLoading";

const formatCurrency = (value) => {
  if (value == null) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
};

const formatDuration = (minutes) => {
  if (!minutes) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h}h`;
  return `${h}h ${m} min`;
};

const ServicesList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      toastSuccess("Serviço excluído com sucesso");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: toastError
  });

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return services;
    return services.filter((servico) => {
      const nome = servico.nome || "";
      const categoriaNome = servico.categoria?.nome || "";
      return (
        nome.toLowerCase().includes(term) ||
        categoriaNome.toLowerCase().includes(term)
      );
    });
  }, [services, search]);

  const handleDelete = (servicoId) => {
    const confirmDelete = window.confirm("Deseja realmente excluir este serviço?");
    if (!confirmDelete) return;
    deleteMutation.mutate(servicoId);
  };

  const handleEdit = (servicoId) => {
    navigate(`/servicos/${servicoId}/editar`);
  };

  const handleView = (servicoId) => {
    navigate(`/servicos/${servicoId}`);
  };

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Box width="100%" maxWidth={1100}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            variant="outlined"
            placeholder="Buscar serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            fullWidth
            sx={{ maxWidth: 600, mr: 2 }}
          />
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/servicos/cadastrar")}
            >
            Novo Serviço
        </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            backgroundColor: "background.paper"
          }}
        >
          {isLoading ? (
                <DefaultLoading loadMessage="Carregando serviços"/>
          ) : (
            <>
              <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Serviço</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading && filteredServices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2">
                        Nenhum serviço encontrado.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  filteredServices.map((servico) => (
                    <TableRow key={servico.servicoId}>
                      <TableCell>{servico.nome}</TableCell>
                      <TableCell>{servico.categoria?.nome || "-"}</TableCell>
                      <TableCell>{formatCurrency(servico.preco)}</TableCell>
                      <TableCell>{formatDuration(servico.duracao)}</TableCell>
                      <TableCell>
                        <Chip
                          label={servico.status === "INATIVO" ? "Inativo" : "Ativo"}
                          size="small"
                          sx={{
                            borderRadius: 999,
                            px: 1.5,
                            fontSize: 12,
                            backgroundColor:
                              servico.status === "INATIVO"
                                ? "error.main"
                                : "success.main",
                            color: "common.white"
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleView(servico.servicoId)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(servico.servicoId)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(servico.servicoId)}
                            sx={{ color: "error.main" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ServicesList;
