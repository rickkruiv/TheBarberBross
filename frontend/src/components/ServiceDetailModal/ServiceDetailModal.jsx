import React from "react"
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip
} from "@mui/material"

export default function ServiceDetailModal({
  open,
  onClose,
  service,
  categoryName
}) {
  if (!service) return null

  const formatCurrency = (value) => {
    if (value == null) return "R$ 0,00"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  const formatDuration = (minutes) => {
    if (!minutes) return "-"
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h > 0) return `${h}h ${m > 0 ? `${m}min` : ""}`
    return `${m}min`
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, textAlign: "center" }}>
        Detalhes do Serviço
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            py: 1
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography variant="caption" color="text.secondary">
              Nome do Serviço
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {service.nome || "-"}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" color="text.secondary">
              Categoria
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={categoryName || "Geral"}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, borderRadius: 1 }}
              />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Duração
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatDuration(service.duracao)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" color="text.secondary">
                  Preço
                </Typography>
                <Typography variant="body1" fontWeight={800} color="primary.main">
                  {formatCurrency(service.preco)}
                </Typography>
              </Box>
            </Box>

            {service.descricao && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Descrição
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.descricao}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
