package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Avaliacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DTOAvaliacaoResponse(
        Long avaliacaoId,
        Long clienteId,
        Long empresaId,
        Long agendamentoId,
        BigDecimal nota,
        String comentario,
        LocalDateTime data) {

    public DTOAvaliacaoResponse(Avaliacao a){
        this(a.getAvaliacaoId(), a.getCliente().getClienteId(), a.getEmpresa().getEmpresaId(),
                a.getAgendamento().getAgendamentoId(), a.getNota(), a.getComentario(), a.getData());
    }
}
