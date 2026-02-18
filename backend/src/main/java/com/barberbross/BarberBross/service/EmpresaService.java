package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOEmpresaRequest;
import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.dto.response.DTOEmpresaSimplesResponse;
import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Empresa;
import com.barberbross.BarberBross.repository.EmpresaRepository;
import com.barberbross.BarberBross.validation.implementations.EmpresaCamposUnicosValidator;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private EnderecoService enderecoService;

    @Autowired
    private EmpresaCamposUnicosValidator validator;

    public DTOEmpresaSimplesResponse salvarEmpresa(DTOEmpresaRequest dto) {
        validator.validar(dto);
        Empresa e = new Empresa(dto);
        empresaRepository.save(e);
        return new DTOEmpresaSimplesResponse(e);
    }

    @Transactional
    public void salvarEnderecoEmpresa(Long id, DTOEnderecoRequest endereco) {
        Empresa empresa = buscarEmpresa(id);
        if (empresa.getEndereco() == null) {
            enderecoService.salvarEndereco(endereco, empresa);
        } else {
            throw new ConflictException("Empresa já tem Endereço cadastrado.");
        }
    }

    @Transactional
    public void editarEnderecoEmpresa(Long id, @Valid DTOEnderecoRequest endereco) {
        Empresa empresa = buscarEmpresa(id);
        enderecoService.editarEndereco(endereco, empresa, empresa.getEndereco().getEnderecoId());
    }

    public DTOEnderecoResponse buscarEnderecoEmpresa(Long id) {
        Empresa empresa = buscarEmpresa(id);
        if (empresa.getEndereco() != null) {
            return enderecoService.buscarEnderecoPorId(empresa.getEndereco().getEnderecoId());
        } else {
            throw new NotFoundException("Empresa não tem Endereço cadastrado");
        }
    }

    public List<DTOEmpresaSimplesResponse> listarEmpresas() {
        return empresaRepository.findAll()
                .stream()
                .map(DTOEmpresaSimplesResponse::new)
                .toList();
    }

    public DTOEmpresaSimplesResponse buscarEmpresaPorId(Long id) {
        Empresa e = buscarEmpresa(id);
        return new DTOEmpresaSimplesResponse(e);
    }

    public DTOEmpresaSimplesResponse editarEmpresa(Long id, DTOEmpresaRequest empresaEditada) {
        Empresa empresaAtual = buscarEmpresa(id);

        if (!empresaAtual.getCnpj().equals(empresaEditada.cnpj())) {
            validator.validar(empresaEditada, id);
        }

        empresaAtual.atualizarDados(empresaEditada);
        empresaRepository.save(empresaAtual);

        return new DTOEmpresaSimplesResponse(empresaAtual);
    }

    public void deletarEmpresa(Long id) {
        Empresa e = buscarEmpresa(id);
        empresaRepository.delete(e);
    }

    public Empresa buscarEmpresa(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nenhuma empresa encontrada com id: " + id));
    }

}