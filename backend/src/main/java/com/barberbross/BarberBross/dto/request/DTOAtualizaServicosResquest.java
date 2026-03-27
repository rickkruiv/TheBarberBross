package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record DTOAtualizaServicosResquest(
        @NotEmpty
        List<Long> servicos) {
}
