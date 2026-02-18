package com.barberbross.BarberBross.exceptions;

import java.time.LocalDateTime;

public record ErrorResponse(
        LocalDateTime data,
        int status,
        String error,
        String mensagem,
        String path) {}