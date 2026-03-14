package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;

public record DTORegistroRequest(
        @NotBlank
        String username,
        @NotBlank
        String senha,
        @NotBlank
        String nivelAcesso
) {
}
