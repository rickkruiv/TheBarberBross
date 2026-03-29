package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DTOAvaliacaoRequest(
        @NotNull
        Long agendamentoId,

        @NotNull
        BigDecimal nota,

        @NotBlank
        String comentario) {}