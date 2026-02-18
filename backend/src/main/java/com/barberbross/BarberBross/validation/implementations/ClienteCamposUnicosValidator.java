package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.ClienteRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClienteCamposUnicosValidator implements Validator<DTOClienteRequest> {

    @Autowired
    private ClienteRepository repository;

    @Override
    public void validar(DTOClienteRequest dto) {
        boolean jaExiste = repository.existsByEmailOrTelefone(dto.email(), dto.telefone());

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outro Cliente");
        }
    }

    public void validar(DTOClienteRequest dto, Long id) {
        boolean jaExiste = repository.existeDuplicado(dto.email(), dto.telefone(), id);

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outro Cliente");
        }
    }
}