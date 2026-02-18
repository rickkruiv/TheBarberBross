package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DTOSocialMediaRequest(
        @NotBlank
        String url,

        @NotNull
        Long empresaId) {}
