package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOEmpresaRequest;
import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.dto.response.DTOEmpresaResponse;
import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Empresa;
import com.barberbross.BarberBross.model.Funcionario;
import com.barberbross.BarberBross.model.Usuario;
import com.barberbross.BarberBross.repository.EmpresaRepository;
import com.barberbross.BarberBross.validation.implementations.AuthorizationValidator;
import com.barberbross.BarberBross.validation.implementations.EmpresaCamposUnicosValidator;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private EnderecoService enderecoService;

    @Autowired
    private FuncionarioService funcionarioService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmpresaCamposUnicosValidator validator;

    @Autowired
    private AuthenticatedUserService authUser;

    @Autowired
    private AuthorizationValidator authValidation;

    @Transactional
    public DTOEmpresaResponse salvarEmpresa(DTOEmpresaRequest dto) {
        if(authUser.isAdmin() && authUser.get().getEmpresaId() == null) {
            validator.validar(dto);

            Empresa emp = new Empresa(dto);
            enderecoService.salvarEndereco(dto.endereco(), emp);
            empresaRepository.save(emp);

            Usuario user = usuarioService.buscarUsuario(authUser.get().getUserId());

            Funcionario f = new Funcionario(emp, user);

            //emp.getFuncionarios().add()

            return new DTOEmpresaResponse(emp);
        } else{
            throw new IllegalStateException();
        }
    }

    public DTOEnderecoResponse buscarEnderecoEmpresa(Long id) {
        Empresa empresa = buscarEmpresa(id);
        if (empresa.getEndereco() != null) {
            return enderecoService.buscarEnderecoPorId(empresa.getEndereco().getEnderecoId());
        } else {
            throw new NotFoundException("Empresa não tem Endereço cadastrado");
        }
    }

    @Transactional
    public void editarEnderecoEmpresa(Long id, @Valid DTOEnderecoRequest dto) {
        Empresa empresa = buscarEmpresa(id);
        authValidation.validarAcessoEmpresa(authUser.get(), empresa.getEmpresaId());
        enderecoService.editarEndereco(dto, empresa, empresa.getEndereco().getEnderecoId());
    }


    public List<DTOEmpresaResponse> listarEmpresas() {
        return empresaRepository.findAll()
                .stream()
                .map(DTOEmpresaResponse::new)
                .toList();
    }

    public DTOEmpresaResponse buscarEmpresaPorId(Long id) {
        Empresa e = buscarEmpresa(id);
        return new DTOEmpresaResponse(e);
    }

    @Transactional
    public DTOEmpresaResponse editarEmpresa(Long id, DTOEmpresaRequest dto) {
        Empresa empresaAtual = buscarEmpresa(id);

        authValidation.validarAcessoEmpresa(authUser.get(), empresaAtual.getEmpresaId());

        if (!empresaAtual.getCnpj().equals(dto.cnpj())) {
            validator.validar(dto, id);
        }

        empresaAtual.atualizarDados(dto);
        empresaRepository.save(empresaAtual);

        return new DTOEmpresaResponse(empresaAtual);
    }

    @Transactional
    public void deletarEmpresa(Long id) {
        Empresa e = buscarEmpresa(id);
        if(!e.isAtiva()) {
            throw new IllegalStateException("Empresa já está inativa!");
        }
        authValidation.validarAcessoEmpresa(authUser.get(), e.getEmpresaId());
        e.setAtiva(false);
    }

    public Empresa buscarEmpresa(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nenhuma empresa encontrada"));
    }

    @Transactional
    public void ativarEmpresa(Long id) {
        Empresa e = buscarEmpresa(id);
        if(e.isAtiva()) {
            throw new IllegalStateException("Empresa já está ativa!");
        }
        authValidation.validarAcessoEmpresa(authUser.get(), e.getEmpresaId());
        e.setAtiva(true);
    }
}