package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOProdutoRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.ProdutoRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProdutoCamposUnicosValidator implements Validator<DTOProdutoRequest> {

    @Autowired
    private ProdutoRepository repository;

    @Override
    public void validar(DTOProdutoRequest dto) {
        boolean jaExiste = repository.existsByNome(dto.nome());

        if (jaExiste){
            throw new ConflictException("Nome já cadastrado para outro Produto.");
        }
    }
}