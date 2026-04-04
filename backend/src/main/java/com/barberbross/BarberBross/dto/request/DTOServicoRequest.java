package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DTOServicoRequest(
        @NotBlank
        String nome,

        String descricao,

        @NotNull
        Long categoriaId,

        @NotNull
        BigDecimal preco,

        @NotNull
        int duracao) {}