package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOServicoRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.ServicoRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ServicoCamposUnicosValidator implements Validator<DTOServicoRequest> {

    @Autowired
    private ServicoRepository repository;

    @Override
    public void validar(DTOServicoRequest dto) {
        boolean jaExiste = repository.existsByNome(dto.nome());

        if (jaExiste){
            throw new ConflictException("Nome já cadastrado para outro Serviço.");
        }
    }
}