import React from "react"
import { styled } from "@mui/material/styles"
import {
  Drawer,
  Toolbar,
  Box,
  Typography,
  List,
  useMediaQuery
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleIcon from "@mui/icons-material/People"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import VisibilityIcon from "@mui/icons-material/Visibility"
import Inventory2Icon from "@mui/icons-material/Inventory2"
import WorkIcon from "@mui/icons-material/Work"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import SettingsIcon from "@mui/icons-material/Settings"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import Abas from "../components/Abas/abas"
import Group from "../components/GrupoAbas/GrupoAbas"

export const drawerWidth = 300
export const miniWidth = 80

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    duration: theme.transitions.duration.shorter
  }),
  overflowX: "hidden",
  borderRight: "1px solid #1E2733",
  backgroundColor: theme.palette.background.default
})

const closedMixin = theme => ({
  width: miniWidth,
  transition: theme.transitions.create("width", {
    duration: theme.transitions.duration.shorter
  }),
  overflowX: "hidden",
  borderRight: "1px solid #1E2733",
  backgroundColor: theme.palette.background.default
})

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  width: open ? drawerWidth : miniWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": 
     open
      ? openedMixin(theme)
      : closedMixin(theme)
}))




export default function Sidebar({ open, onToggle, setSidebarOpen }) {
  const [openGroup, setOpenGroup] = React.useState("Agenda")
  const isMobile = useMediaQuery("(max-width:900px)")
  const variant = isMobile ? "temporary" : "permanent"

  React.useEffect(() => {
    if (!open) {
      setOpenGroup(null)
    }
  }, [open])

  return (
    <DrawerStyled
      variant={variant}
      open={open}
      onClose={onToggle}
      mobile={isMobile}
      sx={{ display: { xs: "block" } }}
    >
      <Toolbar sx={{ gap: 1, borderBottom: "1px solid #1E2733" }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: "#161D27",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900
          }}
        >
          BB
        </Box>

        <Box sx={{ display: { xs: "block", md: open ? "block" : "none" } }}>
          <Typography variant="subtitle1" fontWeight={800}>
            BarberBross
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sistema ERP
          </Typography>
        </Box>
      </Toolbar>

      <List
        sx={{
          "& .MuiListItemText-root": {
            opacity: { md: open ? 1 : 0, xs: 1 },
            transition: "opacity .2s"
          },
          mt: 1
        }}
      >
        {open && (
          <Typography
            variant="caption"
            sx={{
              px: 2,
              pb: 0.5,
              color: "text.secondary",
              textTransform: "uppercase",
              fontWeight: 600
            }}
          >
            Menu Principal
          </Typography>
        )}

        <Abas to="/" icon={<DashboardIcon />} text="Dashboard" />

        <Group
          icon={<EventAvailableIcon />}
          label="Agenda"
          open={openGroup === "Agenda"}
          onToggle={() => setOpenGroup(openGroup === "Agenda" ? null : "Agenda")}
          sidebarOpen={open}
          setSidebarOpen={setSidebarOpen}
        >
          <Abas
            to="/agenda/novo"
            icon={<AddCircleOutlineIcon />}
            text="Novo Agendamento"
          />
          <Abas
            to="/agenda/visualizar"
            icon={<VisibilityIcon />}
            text="Visualizar Agendamentos"
          />
          <Abas
            to="/agenda/semanal"
            icon={<EventAvailableIcon />}
            text="Agenda Semanal"
          />
        </Group>

        <Group
          icon={<PeopleIcon />}
          label="Funcionários"
          open={openGroup === "Funcionários"}
          onToggle={() =>
            setOpenGroup(openGroup === "Funcionários" ? null : "Funcionários")
          }
          sidebarOpen={open}
          setSidebarOpen={setSidebarOpen}
        >
          <Abas
            to="/funcionarios/cadastrar"
            icon={<AddCircleOutlineIcon />}
            text="Cadastrar"
          />
          <Abas
            to="/funcionarios/visualizar"
            icon={<VisibilityIcon />}
            text="Visualizar"
          />
        </Group>

        <Group
          icon={<WorkIcon />}
          label="Serviços"
          open={openGroup === "Serviços"}
          onToggle={() => setOpenGroup(openGroup === "Serviços" ? null : "Serviços")}
          sidebarOpen={open}
          setSidebarOpen={setSidebarOpen}
        >
          <Abas
            to="/servicos/cadastrar"
            icon={<AddCircleOutlineIcon />}
            text="Cadastrar"
          />
          <Abas
            to="/servicos/visualizar"
            icon={<VisibilityIcon />}
            text="Visualizar"
          />
        </Group>

        <Group
          icon={<Inventory2Icon />}
          label="Produtos"
          open={openGroup === "Produtos"}
          onToggle={() => setOpenGroup(openGroup === "Produtos" ? null : "Produtos")}
          sidebarOpen={open}
          setSidebarOpen={setSidebarOpen}
        >
          <Abas
            to="/produtos/cadastrar"
            icon={<AddCircleOutlineIcon />}
            text="Cadastrar"
          />
          <Abas
            to="/produtos/visualizar"
            icon={<VisibilityIcon />}
            text="Visualizar"
          />
        </Group>

        <Group
          icon={<LocalShippingIcon />}
          label="Fornecedores"
          open={openGroup === "Fornecedores"}
          onToggle={() =>
            setOpenGroup(openGroup === "Fornecedores" ? null : "Fornecedores")
          }
          sidebarOpen={open}
          setSidebarOpen={setSidebarOpen}
        >
          <Abas
            to="/fornecedores/cadastrar"
            icon={<AddCircleOutlineIcon />}
            text="Cadastrar"
          />
          <Abas
            to="/fornecedores/visualizar"
            icon={<VisibilityIcon />}
            text="Visualizar"
          />
        </Group>

        <Group
          icon={<SettingsIcon />}
          label="Configurações"
          open={openGroup === "Configurações"}
          onToggle={() =>
            setOpenGroup(openGroup === "Configurações" ? null : "Configurações")
          }
          sidebarOpen={open}
          setSidebarOpen={setSidebarOpen}
        >
          <Abas to="/configuracoes/dados-barbearia" text="Dados da Barbearia" />
          <Abas to="/configuracoes/categorias" text="Categorias" />
          <Abas
            to="/configuracoes/metodos-pagamento"
            text="Métodos de Pagamento"
          />
        </Group>
      </List>
    </DrawerStyled>
  )
}