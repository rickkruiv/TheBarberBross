package com.barberbross.BarberBross.dto.request;

import com.barberbross.BarberBross.enums.TipoProdServ;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DTOCategoriaRequest(
        @NotBlank
        String nome,

        @NotBlank
        String descricao,

        @NotNull
        TipoProdServ tipo) {}
