package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;

public record DTOAutenticacaoRequest(
        @NotBlank
        String username,
        @NotBlank
        String senha) {
}
