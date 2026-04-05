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
        boolean jaExiste = repository.existsByNomeAndEmpresaEmpresaId(dto.nome(), dto.empresaId());

        if (jaExiste){
            throw new ConflictException("Nome já cadastrado para outro Serviço.");
        }
    }

    public void validar(DTOServicoRequest dto, Long id) {
        boolean jaExiste = repository.existeDuplicado(dto.nome(), dto.empresaId(), id);

        if (jaExiste){
            throw new ConflictException("Nome já cadastrado para outro Serviço.");
        }
    }
}