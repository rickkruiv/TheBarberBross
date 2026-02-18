import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Typography, 
    Box, 
    Button,
    Avatar,
    Paper,
    Divider
 } from "@mui/material";
 import DoubleArrowOutlinedIcon from "@mui/icons-material/DoubleArrowOutlined";

const getInitials = (fullName = "") => {
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

 
export default function AgendamentoModal({
    open,
    onClose,
    agendamentoSelecionado,
    formatBRL,
    formatDate,
    formatTime
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                sx: {borderRadius: 4}
            }}
        >
        <DialogTitle sx={{fontWeight: 700, fontSize: "1.4rem"}}>Detalhes do Agendamento</DialogTitle>
        <DialogContent sx={{ mt: 0.5 }}>
            <Typography variant="body2"  sx={{ mb: 2, opacity: 0.8 }}>
                Informações completas sobre o agendamento selecionado
            </Typography>
            {agendamentoSelecionado && (
                <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
                    <Box sx={{display: "flex", flexDirection: "row", gap: 3, alignItems: "center"}}>
                        <Avatar sx={{ width: 64, height: 64 }}>{getInitials(agendamentoSelecionado.cliente?.nome)}</Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600}}>{agendamentoSelecionado.cliente?.nome}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>Cliente</Typography>
                        </Box>
                    </Box>
                    <Divider orientation="horizontal" flexItem />
                    <Box>
                        <Typography variant="h6"  sx={{ mb: 2, opacity: 0.8 }} color="text.tertiary" >
                            Informações de contato
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3}}> {/* Linha 1 */}
                            <Paper sx={{ p: 1 }}>
                                <Box>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Telefone</Typography>
                                <Typography sx={{ fontWeight: 600}}>{agendamentoSelecionado.cliente?.telefone}</Typography>
                            </Box>
                            </Paper>
                            <Paper  sx={{ p: 1 }}>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>E-mail</Typography>
                                    <Typography sx={{ fontWeight: 600}}>{agendamentoSelecionado.cliente?.email || "-"}</Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="h6"  sx={{ mb: 2, opacity: 0.8 }} color="text.tertiary" >
                            Detalhes do agendamento
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3}}> {/* Linha 2 */}
                            <Paper sx={{ p: 1 }}>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>{agendamentoSelecionado.servicos?.length > 1 ? "Serviços" : "Serviço"}</Typography>
                                    {/* <Typography sx={{ fontWeight: 600}}>{agendamentoSelecionado.servicos?.map(servico => servico.nome).join(", ")}</Typography> */}
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5 }}>
                                        {agendamentoSelecionado.servicos?.map(servico => (
                                            <Typography key={servico.servicoId} sx={{ fontWeight: 600 }}>
                                            <DoubleArrowOutlinedIcon sx={{ fontSize: ".8rem" }} /> {servico.nome}
                                            </Typography>
                                        ))}
                                    </Box>

                                </Box>
                            </Paper>
                            <Paper sx={{ p: 1 }}>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>Profissional</Typography>
                                    <Typography sx={{ fontWeight: 600}}>{agendamentoSelecionado.funcionario?.nome || "-"}</Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3}}> {/* Linha 3 */}
                        <Paper sx={{ p: 1 }}>
                            <Box>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Data</Typography>
                                <Typography sx={{ fontWeight: 600}}>{formatDate(agendamentoSelecionado.dataHorario)}</Typography>
                            </Box>
                        </Paper>                    
                        <Paper sx={{ p: 1 }}>
                            <Box>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Horário</Typography>
                                <Typography sx={{ fontWeight: 600}}>{formatTime(agendamentoSelecionado.dataHorario)}</Typography>
                            </Box>
                        </Paper>
                    </Box>
                    <Box>
                        <Typography variant="h6" color="text.tertiary">Pagamento</Typography>
                        <Paper sx={{ p: 1 }}>
                            <Box>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Valor</Typography>
                                <Typography sx={{ fontWeight: 600}}>{formatBRL(agendamentoSelecionado.valorTotal)}</Typography>
                            </Box>
                        </Paper>
                    </Box>
                    
                    {agendamentoSelecionado?.observacao?.trim() && (
                        <Box>
                            <Typography variant="h6" color="text.tertiary">Observação</Typography>
                            <Paper sx={{ p: 1, minHeight: "100px" }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                    {agendamentoSelecionado.observacao}
                                </Typography>
                            </Paper>
                        </Box>
                    )}

                </Box>
            )}
        </DialogContent>
        <DialogActions sx={{p: 4}}>
            <Button onClick={onClose} variant="contained">Fechar</Button>
        </DialogActions>
        </Dialog>
    );
}