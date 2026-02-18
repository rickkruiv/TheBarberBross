package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.AgendamentoRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AgendamentoConflitoHorariosValidator implements Validator<DTOAgendamentoRequest> {

    @Autowired
    private AgendamentoRepository repository;

    @Override
    public void validar(DTOAgendamentoRequest dto) {
        if (dto.dataHorario().isBefore(LocalDateTime.now())){
            throw new ConflictException("Agendamentos não podem ser realizados em horários anteriores ao atual.");
        }

        if (dto.dataHorario().isBefore(LocalDateTime.now().plusMinutes(30))) {
            throw new ConflictException("Agendamentos devem ser feitos com pelo menos 30 minutos de antecedência.");
        }

        boolean conflitoFuncionario = repository.funcionarioPossuiAgendamentoNoHorario(dto.funcionarioId(),
                dto.empresaId(),
                dto.dataHorario(),
                Status.PENDENTE);

        if (conflitoFuncionario){
            throw new ConflictException("Funcionário já possui agendamento neste horário.");
        }

        boolean conflitoCliente = repository.clientePossuiAgendamentoNoHorario(dto.clienteId(),
                dto.dataHorario(), Status.PENDENTE);

        if (conflitoCliente){
            throw new ConflictException("Cliente já possui um agendamento neste horário.");
        }

    }
}
