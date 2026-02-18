package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.EnderecoRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EnderecoCamposUnicosValidator implements Validator<DTOEnderecoRequest> {

    @Autowired
    private EnderecoRepository repository;

    @Override
    public void validar(DTOEnderecoRequest dto) {
        boolean jaExiste = repository.existsByCepAndLogradouroAndNumeroAndCidadeAndBairroAndUf(dto.cep(),
                dto.logradouro(), dto.numero(), dto.cidade(), dto.bairro(), dto.uf());

        if (jaExiste){
            throw new ConflictException("Já existe Endereço cadastrado.");
        }
    }

    public void validar(DTOEnderecoRequest dto, Long idEndereco) {
        boolean jaExiste = repository.existeDuplicado(dto.cep(),
                dto.logradouro(), dto.numero(), dto.cidade(), dto.bairro(), dto.uf(), idEndereco);

        if (jaExiste){
            throw new ConflictException("Já existe Endereço cadastrado.");
        }
    }

}