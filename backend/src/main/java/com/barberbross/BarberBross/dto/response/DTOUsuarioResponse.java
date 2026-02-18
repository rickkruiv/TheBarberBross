package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.NivelAcesso;
import com.barberbross.BarberBross.model.Usuario;

public record DTOUsuarioResponse(
        Long usuarioId,
        String username,
        Long funcionarioId,
        NivelAcesso nivelAcesso) {

    public DTOUsuarioResponse(Usuario u) {
        this(u.getUsuarioId(), u.getUsername(), u.getFuncionario().getFuncionarioId(), u.getNivelAcesso());
    }
}
