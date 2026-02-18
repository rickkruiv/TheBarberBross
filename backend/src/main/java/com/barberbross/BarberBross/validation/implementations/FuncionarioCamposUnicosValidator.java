package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.FuncionarioRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FuncionarioCamposUnicosValidator implements Validator<DTOFuncionarioRequest> {

    @Autowired
    private FuncionarioRepository funcionarioRepository;


    @Override
    public void validar(DTOFuncionarioRequest dto) {
        boolean jaExiste = funcionarioRepository.existsByCpfOrEmailOrTelefone(dto.cpf(), dto.email(), dto.telefone());

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outro Funcionário.");
        }
    }

    public void validar(DTOFuncionarioRequest dto, Long id){
        boolean jaExiste = funcionarioRepository.existeDuplicado(dto.cpf(),
                dto.email(), dto.telefone(), id);

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outro Funcionário.");
        }
    }
}