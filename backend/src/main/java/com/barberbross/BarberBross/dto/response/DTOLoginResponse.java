package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.NivelAcesso;

public record DTOLoginResponse(Long userId, String name, NivelAcesso nivelAcesso, String token) {
}
