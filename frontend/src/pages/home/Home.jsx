import React from "react";
import { Box, Typography, Card, CardContent, Avatar, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider, Paper, useTheme } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useRecentRoutes } from "../../hooks/useRecentRoutes";
import { useNotifications } from "../../contexts/NotificationsContext";
import { useNavigate } from "react-router-dom";

import NotificationsIcon from "@mui/icons-material/Notifications";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import LinkIcon from "@mui/icons-material/Link";

const routeLabels = {
  "/": "Início",
  "/dashboard": "Dashboard",
  "/agenda/novo": "Novo Agendamento",
  "/agenda/visualizar": "Visualizar Agendamentos",
  "/agenda/semanal": "Agenda Semanal",
  "/funcionarios/cadastrar": "Cadastrar Funcionário",
  "/funcionarios/visualizar": "Lista de Funcionários",
  "/servicos/cadastrar": "Cadastrar Serviço",
  "/servicos/visualizar": "Lista de Serviços",
  "/produtos/cadastrar": "Cadastrar Produto",
  "/produtos/visualizar": "Lista de Produtos",
  "/fornecedores/cadastrar": "Cadastrar Fornecedor",
  "/fornecedores/visualizar": "Lista de Fornecedores",
  "/configuracoes/dados-barbearia": "Dados da Barbearia",
  "/configuracoes/categorias": "Categorias",
  "/configuracoes/metodos-pagamento": "Métodos de Pagamento",
};

export default function Home() {
  const { user } = useAuth();
  const recentRoutes = useRecentRoutes();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", lg: "row" } }}>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <Card sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ height: 100, bgcolor: "primary.main", opacity: 0.1 }} />
          <CardContent sx={{ mt: -6, textAlign: "center", pb: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                border: "4px solid",
                borderColor: "background.paper",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                bgcolor: "text.tertiary"
              }}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
              {user?.name || "Usuário"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {user?.nivelAcesso === "ADMIN" ? "Administrador" : "Colaborador"}
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{ borderRadius: 3, textTransform: "none", py: 1 }}
              onClick={() => navigate("/configuracoes/dados-barbearia")}
            >
              Gerenciar perfil
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ flex: 2, display: "flex", flexDirection: "column" }}>
        <Card sx={{ borderRadius: 4, height: "100%", border: "1px solid", borderColor: "divider" }}>
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Central de notificações
            </Typography>
          </Box>

          <CardContent sx={{ p: 0 }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 10, textAlign: "center", color: "text.disabled" }}>
                <NotificationsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.2 }} />
                <Typography variant="body1">Sem notificações no momento</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((notif, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start" sx={{ py: 2, px: 3 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                          {notif.icon || <NotificationsIcon sx={{ fontSize: 18 }} />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {notif.titulo || "Notificação"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {notif.data || "Agora"}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {notif.mensagem}
                            </Typography>
                          </Box>
                        }
                      />
                      <Button size="small" sx={{ textTransform: "none", ml: 2, borderRadius: 2 }}>
                        ver mais
                      </Button>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <Card sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid", borderColor: "divider" }}>
            <LinkIcon sx={{ fontSize: 20, color: "text.secondary" }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Acesso rápido
            </Typography>
          </Box>
          <CardContent sx={{ p: 1 }}>
            <List dense>
              {recentRoutes.length === 0 ? (
                <ListItem>
                  <Typography variant="body2" color="text.disabled">Nenhuma rota recente</Typography>
                </ListItem>
              ) : (
                recentRoutes.map((path) => (
                  <ListItemButton
                    key={path}
                    onClick={() => navigate(path)}
                    sx={{ borderRadius: 2, mb: 0.5, "&:hover": { bgcolor: "rgba(255, 20, 87, 0.1)" } }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <HistoryIcon sx={{ fontSize: 18, color: "primary.main" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={routeLabels[path] || path}
                      primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                    />
                  </ListItemButton>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
