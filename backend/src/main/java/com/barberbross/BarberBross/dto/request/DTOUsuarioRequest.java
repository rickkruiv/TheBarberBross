package com.barberbross.BarberBross.dto.request;

import com.barberbross.BarberBross.enums.NivelAcesso;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DTOUsuarioRequest(
        @NotBlank
        String username,

        @NotBlank
        String senha,

        @NotNull
        Long funcionarioId,

        @NotNull
        NivelAcesso nivelAcesso) {}