package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.AgendamentoServico;
import com.barberbross.BarberBross.model.Avaliacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record DTOAvaliacaoResponse(
        Long avaliacaoId,
        Long clienteId,
        Long empresaId,
        Long funcionarioId,
        Long agendamentoId,
        List<Long> servicos,
        BigDecimal nota,
        String comentario,
        LocalDateTime data) {

    public DTOAvaliacaoResponse(Avaliacao a) {
        this(a.getAvaliacaoId(), a.getCliente().getClienteId(), a.getEmpresa().getEmpresaId(),
                a.getFuncionario().getFuncionarioId(), a.getAgendamento().getAgendamentoId(),
                a.getAgendamento().getServicos().stream().map(AgendamentoServico::getServicoId).toList(),
                a.getNota(), a.getComentario(), a.getData());
    }

}
