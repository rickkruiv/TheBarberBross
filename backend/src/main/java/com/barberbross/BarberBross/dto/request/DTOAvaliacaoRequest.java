package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DTOAvaliacaoRequest(
        @NotNull
        Long clienteId,

        @NotNull
        Long empresaId,

        @NotNull
        Long agendamentoId,

        @NotNull
        BigDecimal avaliacao,

        @NotBlank
        String comentario) {}