package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Cargo;

public record DTOCargoResponse(
        Long categoriaId,
        String nome,
        Double salario,
        boolean ativo) {

    public static DTOCargoResponse fromEntity(Cargo c) {
        return new DTOCargoResponse(
                c.getCargoId(),
                c.getNome(),
                c.getSalario(),
                c.isAtivo()
        );
    }
}
