package com.barberbross.BarberBross.dto.request;

import com.barberbross.BarberBross.enums.FormaPagamento;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DTOPagamentoRequest(
        @NotNull
        Long agendamentoId,

        @NotNull
        double valor,

        @NotNull
        LocalDateTime dataPagamento,

        @NotNull
        FormaPagamento formaPagamento) {}
