package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOEmpresaRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.EmpresaRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmpresaCamposUnicosValidator implements Validator<DTOEmpresaRequest> {

    @Autowired
    private EmpresaRepository repository;

    @Override
    public void validar(DTOEmpresaRequest dto) {
        boolean jaExiste = repository.existsByCnpjOrRazaoSocialOrTelefoneOrEmail(dto.cnpj(), dto.razaoSocial(),
                dto.telefone(), dto.email());

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outra Empresa.");
        }
    }

    public void validar(DTOEmpresaRequest dto, Long id){
        boolean jaExiste = repository.existeDuplicado(dto.cnpj(), dto.razaoSocial(),
                dto.telefone(), dto.email(), id);

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outra Empresa.");
        }
    }
}