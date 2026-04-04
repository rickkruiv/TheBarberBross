package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOCategoriaRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.model.Categoria;
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
        //se pa n vai mais existir
    }

    public void validar(DTOCategoriaRequest dto, Long empresaId) {
        boolean jaExiste = repository.existsByNomeAndEmpresaEmpresaId(dto.nome(), empresaId);

        if (jaExiste){
            throw new ConflictException("Já existe uma Categoria cadastrada com esse nome.");
        }
    }

    public void validarFornecedor(DTOCategoriaRequest dto, Long fornecedorId) {
        boolean jaExiste = repository.existsByNomeAndFornecedorFornecedorId(dto.nome(), fornecedorId);

        if (jaExiste){
            throw new ConflictException("Já existe uma Categoria cadastrada com esse nome.");
        }
    }

    public void validarCategoriaEditada(DTOCategoriaRequest dto, Long id) {
        boolean jaExiste = repository.existeDuplicado(dto.nome(), dto.descricao(), id);

        if (jaExiste){
            throw new ConflictException("Dados já cadastrados para outra Categoria.");
        }
    }

    //melhorar as exceptions
    public void validarDono(Categoria c){
        if (c.getEmpresa() != null && c.getFornecedor() != null){
            throw new RuntimeException("Categoria não pode ter Empresa e Fornecedor ao mesmo tempo.");
        }

        if (c.getEmpresa() == null && c.getFornecedor() == null){
            throw new RuntimeException("Categoria deve ter um dono");
        }
    }
}