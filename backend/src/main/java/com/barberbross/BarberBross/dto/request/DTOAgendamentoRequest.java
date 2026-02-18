package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record DTOAgendamentoRequest(
        @NotNull
        LocalDateTime dataHorario,

        String observacao,

        @NotNull
        Long clienteId,

        @NotNull
        Long empresaId,

        @NotNull
        Long funcionarioId,

        @NotNull
        List<Long> listaDeServicosId) {}