package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.dto.request.DTOFornecedorRequest;
import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.dto.response.DTOFornecedorResponse;
import com.barberbross.BarberBross.dto.response.DTOFornecedorSimplesResponse;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Endereco;
import com.barberbross.BarberBross.model.Fornecedor;
import com.barberbross.BarberBross.repository.FornecedorRepository;
import com.barberbross.BarberBross.validation.implementations.FornecedorCamposUnicosValidator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @Autowired
    private EnderecoService enderecoService;

    @Autowired
    private FornecedorCamposUnicosValidator validator;


    public DTOFornecedorSimplesResponse salvarFornecedor(DTOFornecedorRequest dto) {
        validator.validar(dto);
        Fornecedor f = new Fornecedor(dto);
        fornecedorRepository.save(f);
        return new DTOFornecedorSimplesResponse(f);
    }

    @Transactional
    public void salvarEnderecoFornecedor(Long id, DTOEnderecoRequest endereco){
        Fornecedor fornecedor = buscarFornecedor(id);
        if (fornecedor.getEndereco() == null){
            enderecoService.salvarEndereco(endereco, fornecedor);
        } else {
            throw new ConflictException("Fornecedor já tem Endereço cadastrado.");
        }
    }

    public DTOEnderecoResponse buscarEnderecoFornecedor(Long id) {
        Fornecedor fornecedor = buscarFornecedor(id);
        if (fornecedor.getEndereco() != null){
            return enderecoService.buscarEnderecoPorId(fornecedor.getEndereco().getEnderecoId());
        } else {
            throw new NotFoundException("Fornecedor não tem Endereço cadastrado.");
        }
    }

    @Transactional
    public void editarEnderecoFornecedor(Long id, DTOEnderecoRequest endereco) {
        Fornecedor fornecedor = buscarFornecedor(id);
        enderecoService.editarEndereco(endereco, fornecedor, fornecedor.getEndereco().getEnderecoId());
    }

    public List<DTOFornecedorSimplesResponse> listarFornecedores() {
        return fornecedorRepository.findAll()
                .stream()
                .map(DTOFornecedorSimplesResponse::new)
                .toList();
    }

    public DTOFornecedorResponse buscarFornecedorPorId(Long id) {
        Fornecedor f = buscarFornecedor(id);
        return new DTOFornecedorResponse(f);
    }

    public DTOFornecedorResponse editarFornecedor(Long id, DTOFornecedorRequest dto) {
        validator.validar(dto, id);
        Endereco e = enderecoService.buscarEndereco(id);
        Fornecedor f = buscarFornecedor(id);
        f.atualizarDado(dto, e);
        fornecedorRepository.save(f);
        return new DTOFornecedorResponse(f);
    }

    public void deletarFornecedor(Long id) {
        Fornecedor f = buscarFornecedor(id);
        fornecedorRepository.delete(f);
    }

    protected Fornecedor buscarFornecedor(Long id){
        return fornecedorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nenhum Fornecedor encontrado com id: " + id));
    }

}