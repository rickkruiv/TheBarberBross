package com.barberbross.BarberBross.dto.request;

import com.barberbross.BarberBross.enums.TipoProdServ;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DTOCategoriaRequest(
        @NotBlank
        @Size(max = 50)
        String nome,

        @Size(max = 100)
        String descricao,

        @NotNull
        TipoProdServ tipo) {}
