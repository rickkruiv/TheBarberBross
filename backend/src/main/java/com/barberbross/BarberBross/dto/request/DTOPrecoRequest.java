package com.barberbross.BarberBross.dto.request;

import com.barberbross.BarberBross.enums.TipoProdServ;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DTOPrecoRequest(
        @NotNull
        LocalDateTime dataInicio,

        @NotNull
        LocalDateTime dataFim,

        @NotNull
        double valor,

        @NotNull
        TipoProdServ tipo,
        String descricao) {}
