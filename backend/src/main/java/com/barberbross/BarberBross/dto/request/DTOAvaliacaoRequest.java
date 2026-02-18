package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DTOAvaliacaoRequest(
        @NotNull
        Long clienteId,

        @NotNull
        Long empresaId,

        @NotNull
        Long servicoId,

        @NotNull
        Integer avaliacao,

        @NotBlank
        String comentario) {}