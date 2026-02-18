package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DTOProdutoRequest(
        @NotBlank
        String nome,
        String descricao,

        @NotNull
        Long categoriaId) {}