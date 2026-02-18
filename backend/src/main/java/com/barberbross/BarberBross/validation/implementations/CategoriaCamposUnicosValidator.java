package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOCategoriaRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.CategoriaRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CategoriaCamposUnicosValidator implements Validator<DTOCategoriaRequest> {

    @Autowired
    private CategoriaRepository repository;

    @Override
    public void validar(DTOCategoriaRequest dto) {
        boolean jaExiste = repository.existsByNomeOrDescricao(dto.nome(), dto.descricao());

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outra Categoria.");
        }
    }

    public void validar(DTOCategoriaRequest dto, Long id) {
        boolean jaExiste = repository.existeDuplicado(dto.nome(), dto.descricao(), id);

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outra Categoria.");
        }
    }
}