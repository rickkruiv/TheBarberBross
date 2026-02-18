package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOFornecedorRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.FornecedorRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FornecedorCamposUnicosValidator implements Validator<DTOFornecedorRequest> {

    @Autowired
    private FornecedorRepository repository;

    @Override
    public void validar(DTOFornecedorRequest dto) {
        boolean jaExiste = repository.existsByCnpjOrTelefoneOrEmail(dto.cnpj(), dto.telefone(), dto.email());

        if (jaExiste) {
            throw new ConflictException("Dados já cadastrados para outro Fornecedor.");
        }
    }

    public void validar(DTOFornecedorRequest dto, Long id) {
        boolean jaExiste = repository.existeDuplicado(dto.cnpj(), dto.telefone(),
                dto.email(), id);

        if (jaExiste) {
            throw new ConflictException("Dados já cadastrados para outro Fornecedor.");
        }
    }
}