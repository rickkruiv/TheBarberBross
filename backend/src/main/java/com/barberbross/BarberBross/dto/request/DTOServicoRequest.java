package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DTOServicoRequest(
        @NotBlank
        String nome,
        String descricao,

        @NotNull
        Long categoriaId,

        @NotNull
        double preco,

        @NotNull
        int duracao) {}