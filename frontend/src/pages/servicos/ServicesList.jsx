import React, { useMemo, useState, Fragment } from "react";
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
  Tooltip,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useServices, useDeleteService } from "../../services/services";
import { useCategories } from "../../services/categories";
import { toastError, toastSuccess } from "../../services/toast";
import DefaultLoading from "../../shared/Loading/DefaultLoading";
import { TableVirtuoso } from "react-virtuoso"
import ServiceDetailModal from "../../components/ServiceDetailModal/ServiceDetailModal";

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
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const { data: services = [], isLoading } = useServices();
  const { data: categoriasData } = useCategories();
  const categoriesList = Array.isArray(categoriasData)
    ? categoriasData
    : categoriasData?.data || [];

  const deleteMutation = useDeleteService();

  const getCategoriaNome = (categoriaId) => {
    if (!categoriaId) return "";
    const cat = categoriesList.find(c => c.id === categoriaId || c.categoriaId === categoriaId);
    return cat ? (cat.nome || cat.name) : "";
  };

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return services;
    return services.filter((servico) => {
      const nome = servico.nome || "";
      const categoriaNome = getCategoriaNome(servico.categoriaId) || "";
      return (
        nome.toLowerCase().includes(term) ||
        categoriaNome.toLowerCase().includes(term)
      );
    });
  }, [services, search, categoriesList]);

  const handleDelete = (servicoId) => {
    const confirmDelete = window.confirm("Deseja realmente excluir este serviço?");
    if (!confirmDelete) return;
    deleteMutation.mutate(servicoId, {
      onSuccess: () => toastSuccess("Serviço excluído com sucesso"),
      onError: toastError
    });
  };

  const handleEdit = (servicoId) => {
    navigate(`/servicos/${servicoId}/editar`);
  };

  const handleView = (servico) => {
    setSelectedService(servico);
    setModalOpen(true);
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
              <TableVirtuoso
                style={{ height: 500 }}
                data={filteredServices}
                components={{
                  Scroller: React.forwardRef((props, ref) => <div {...props} ref={ref} />),
                  Table: (props) => <Table {...props} size="small" sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
                  TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
                  TableRow: (props) => <TableRow {...props} hover />,
                  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
                }}
                fixedHeaderContent={() => (
                  <TableRow sx={{ bgcolor: "background.paper", boxShadow: "0px 2px 4px rgba(0,0,0,0.5)" }}>
                    <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "40%" }}>Serviço</TableCell>
                    <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "20%" }}>Categoria</TableCell>
                    <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "15%" }}>Preço</TableCell>
                    <TableCell sx={{ bgcolor: "background.paper", zIndex: 1, width: "15%" }}>Duração</TableCell>
                    <TableCell align="center" sx={{ bgcolor: "background.paper", zIndex: 1, width: "10%" }}>Ações</TableCell>
                  </TableRow>
                )}
                itemContent={(_index, servico) => (
                  <Fragment>
                    <TableCell>{servico.nome}</TableCell>
                    <TableCell>{getCategoriaNome(servico.categoriaId) || "-"}</TableCell>
                    <TableCell>{formatCurrency(servico.preco)}</TableCell>
                    <TableCell>{formatDuration(servico.duracao)}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="Visualizar">
                          <IconButton
                            size="small"
                            onClick={() => handleView(servico)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(servico.servicoId)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(servico.servicoId)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </Fragment>
                )}
              />
            </>
          )}
        </Paper>
      </Box>

      <ServiceDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        service={selectedService}
        categoryName={selectedService ? getCategoriaNome(selectedService.categoriaId) : ""}
      />
    </Box>
  );
};

export default ServicesList;
