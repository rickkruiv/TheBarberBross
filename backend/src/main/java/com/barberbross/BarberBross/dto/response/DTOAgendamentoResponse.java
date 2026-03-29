package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.model.Agendamento;
import com.barberbross.BarberBross.model.AgendamentoServico;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record DTOAgendamentoResponse(
        Long agendamentoId,
        LocalDateTime dataHorario,
        Status status,
        String observacao,
        List<Long> servicosIds,
        BigDecimal valorTotal,
        Integer duracaoTotal,
        Long clienteId,
        Long empresaId,
        Long funcionarioId) {


    public DTOAgendamentoResponse(Agendamento a){
        this(a.getAgendamentoId(), a.getDataHorario(), a.getStatus(), a.getObservacao(),
                a.getServicos().stream().map(AgendamentoServico::getServicoId).toList(),
                a.getValorTotal(), a.getDuracaoTotal(), a.getCliente().getClienteId(),
                a.getEmpresa().getEmpresaId(), a.getFuncionario().getFuncionarioId());
    }
}