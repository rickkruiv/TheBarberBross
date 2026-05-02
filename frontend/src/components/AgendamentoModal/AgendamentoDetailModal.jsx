import React from "react"
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Chip
} from "@mui/material"

export default function AgendamentoDetailModal({
  open,
  onClose,
  agendamento,
  formatBRL,
  formatDate,
  formatTime
}) {
  if (!agendamento) return null

  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Calculate total duration if services have it
  const totalDuration = agendamento.servicos?.reduce(
    (acc, s) => acc + (s.duracao || 0),
    0
  )

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
        Detalhes do Agendamento
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
              Cliente
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {agendamento.cliente?.nome || "-"}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" color="text.secondary">
              Telefone do Cliente
            </Typography>
            <Typography variant="body1">
              {agendamento.cliente?.telefone || "-"}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" color="text.secondary">
              Serviço
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {agendamento.servicos?.map((s) => s.nome).join(", ") || "-"}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tempo do Serviço
                </Typography>
                <Typography variant="body1">
                  {formatDuration(totalDuration)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" color="text.secondary">
                  Custo Total
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary.main">
                  {formatBRL(agendamento.valorTotal)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" color="text.secondary">
              Profissional
            </Typography>
            <Typography variant="body1">
              {agendamento.funcionario?.nome || "-"}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" color="text.secondary">
              Data e Hora
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
              <Chip
                label={formatDate(agendamento.dataHorario)}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
              <Chip
                label={formatTime(agendamento.dataHorario)}
                size="small"
                color="primary"
                sx={{ borderRadius: 1 }}
              />
            </Box>

            {agendamento.observacao && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Observação
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  "{agendamento.observacao}"
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
