package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.FormaPagamento;
import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.model.Pagamento;

import java.time.LocalDateTime;

public record DTOPagamentoResponse(
        Long pagamentoId,
        Long agendamentoId,
        double valor,
        LocalDateTime dataPagamento,
        FormaPagamento formaPagamento,
        Status status) {

    public DTOPagamentoResponse(Pagamento p){
        this(p.getPagamentoId(), p.getAgendamento().getAgendamentoId(), p.getValor()
        , p.getDataPagamento(), p.getFormaPagamento(), p.getStatus());
    }
}
