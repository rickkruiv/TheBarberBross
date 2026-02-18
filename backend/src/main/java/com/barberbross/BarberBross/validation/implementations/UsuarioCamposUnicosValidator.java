package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOUsuarioRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.UsuarioRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UsuarioCamposUnicosValidator implements Validator<DTOUsuarioRequest> {

    @Autowired
    private UsuarioRepository repository;

    //valida se os campos são repetidos
    @Override
    public void validar(DTOUsuarioRequest dto) {
        boolean jaExiste = repository.existsByUsername(dto.username());

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outro Usuário");
        }
    }
}