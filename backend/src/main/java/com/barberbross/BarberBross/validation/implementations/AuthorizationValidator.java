package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.exceptions.AccessDeniedException;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.*;
import com.barberbross.BarberBross.repository.AvaliacaoRepository;
import com.barberbross.BarberBross.repository.CategoriaRepository;
import com.barberbross.BarberBross.repository.ClienteRepository;
import com.barberbross.BarberBross.service.EmpresaService;
import com.barberbross.BarberBross.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationValidator {

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private FuncionarioService funcionarioService;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public void validarAcessoEmpresa(CustomUserPrincipal user, Long empresaId){
        if (!user.getEmpresaId().equals(empresaId)){
            throw new AccessDeniedException("Acesso negado: você não tem permissão para acessar recursos desta empresa.");
        }
    }

    public boolean funcionarioPertenceEmpresa(Long funcionarioId, Long empresaId){
        Empresa e = empresaService.buscarEmpresa(empresaId);
        Funcionario f = funcionarioService.buscarFuncionario(funcionarioId);
        return e.getFuncionarios().contains(f);
    }

    public void validarClienteNoAgendamento(CustomUserPrincipal user, Long clienteId){
        Cliente c = clienteRepository.findByUsuarioUsuarioId(user.getUserId()).
                orElseThrow(() -> new NotFoundException("Nenhum cliente encontrado com userId: " + user.getUserId()));
        if(!c.getClienteId().equals(clienteId)){
            throw new AccessDeniedException("Acesso negado: usuário não possui permissão para acessar este agendamento.");
        }
    }

    public void validarFuncionarioNoAgendamento(CustomUserPrincipal user, Long funcionarioId){
        Funcionario f = funcionarioService.buscarFuncionario(user.getFuncionarioId());
        if(!f.getFuncionarioId().equals(funcionarioId)){
            throw new AccessDeniedException("Acesso negado: funcionário não possui permissão para acessar este agendamento.");
        }
    }

    public void validarClienteNaAvaliacao(CustomUserPrincipal user, Long avaliacaoId){
        Cliente c = clienteRepository.findByUsuarioUsuarioId(user.getUserId()).
                orElseThrow(() -> new NotFoundException("Nenhum cliente encontrado com userId: " + user.getUserId()));
        Avaliacao a = avaliacaoRepository.findById(avaliacaoId)
                .orElseThrow(() -> new NotFoundException("Nenhuma Avaliação encontrada"));
        if(!a.getCliente().getClienteId().equals(c.getClienteId())){
            throw new AccessDeniedException("Acesso negado: usuário não possui permissão para alterar esta avaliação.");
        }
    }

    public void validarCategoriaEmpresa(CustomUserPrincipal user, Long categoriaId){
        Categoria c = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new NotFoundException("Nenhuma Categoria encontrada"));
        if (!c.getEmpresa().getEmpresaId().equals(user.getEmpresaId())){
            throw new AccessDeniedException("Acesso negado: usuário não possui permissão para alterar esta categoria.");
        }
    }

    public void validarClienteUsuario(CustomUserPrincipal user, Long clienteId){
        Cliente c = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new NotFoundException("Nenhum Cliente encontrado"));
        if (!c.getUsuario().getUsuarioId().equals(user.getUserId())){
            throw new AccessDeniedException("Acesso negado: usuário não possui permissão para visualizar dados deste cliente.");
        }
    }

}