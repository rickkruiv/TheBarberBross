package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.StatusCargo;
import com.barberbross.BarberBross.model.Cargo;
import com.barberbross.BarberBross.model.CargoFuncionario;
import com.barberbross.BarberBross.model.Funcionario;

import java.time.LocalDate;

public record DTOCargoFuncionarioResponse(
        Long cargoFuncionarioId,
        Funcionario funcionario,
        Cargo cargo,
        LocalDate dataInicio,
        LocalDate dataFim,
        StatusCargo status) {

    public static DTOCargoFuncionarioResponse fromEntity(CargoFuncionario c){
        return new DTOCargoFuncionarioResponse(
                c.getCargoFuncionarioId(),
                c.getFuncionario(),
                c.getCargo(),
                c.getDataInicio(),
                c.getDataFim(),
                c.getStatus()
        );
    }
}
