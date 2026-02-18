package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.model.Agendamento;
import com.barberbross.BarberBross.model.Servico;

import java.time.LocalDateTime;
import java.util.List;

public record DTOAgendamentoResponse(
        Long agendamentoId,
        LocalDateTime dataHorario,
        Status status,
        String observacao,
        List<Long> servicosIds,
        double valorTotal,
        Long clienteId,
        Long empresaId,
        Long funcionarioId) {


    public DTOAgendamentoResponse(Agendamento a){
        this(a.getAgendamentoId(), a.getDataHorario(), a.getStatus(), a.getObservacao(),
                a.getServicos().stream().map(Servico::getServicoId).toList(),
                a.getValorTotal(), a.getCliente().getClienteId(),
                a.getEmpresa().getEmpresaId(), a.getFuncionario().getFuncionarioId());
    }
}