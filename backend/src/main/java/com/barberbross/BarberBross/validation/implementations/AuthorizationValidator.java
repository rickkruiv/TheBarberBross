package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.exceptions.AccessDeniedException;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.*;
import com.barberbross.BarberBross.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationValidator {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public void validarAcessoEmpresa(Usuario user, Long empresaId){
        if (!user.getEmpresa().getEmpresaId().equals(empresaId)){
            throw new AccessDeniedException("Acesso negado: você não tem permissão para acessar recursos desta empresa.");
        }
    }

    public boolean funcionarioPertenceEmpresa(Long funcionarioId, Long empresaId){
        Empresa e = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new NotFoundException("Nenhuma empresa encontrada."));

        Funcionario f = funcionarioRepository.findById(funcionarioId)
                .orElseThrow(() -> new NotFoundException("Nenhum funcionário encontrado."));
        return e.getFuncionarios().contains(f);
    }

    public void validarClienteNoAgendamento(Usuario user, Long clienteId){
        Cliente c = clienteRepository.findByUsuarioUsuarioId(user.getUsuarioId()).
                orElseThrow(() -> new NotFoundException("Nenhum cliente encontrado."));
        if(!c.getClienteId().equals(clienteId)){
            throw new AccessDeniedException("Acesso negado: usuário não possui permissão para acessar este agendamento.");
        }
    }

    public void validarFuncionarioNoAgendamento(Usuario user, Long funcionarioId){
        Funcionario f = funcionarioRepository.findById(user.getFuncionario().getFuncionarioId())
                .orElseThrow(() -> new NotFoundException("Nenhum funcionário encontrado."));
        if(!f.getFuncionarioId().equals(funcionarioId)){
            throw new AccessDeniedException("Acesso negado: funcionário não possui permissão para acessar este agendamento.");
        }
    }

    public void validarClienteNaAvaliacao(Usuario user, Long avaliacaoId){
        Cliente c = clienteRepository.findByUsuarioUsuarioId(user.getUsuarioId()).
                orElseThrow(() -> new NotFoundException("Nenhum cliente encontrado."));
        Avaliacao a = avaliacaoRepository.findById(avaliacaoId)
                .orElseThrow(() -> new NotFoundException("Nenhuma Avaliação encontrada"));
        if(!a.getCliente().getClienteId().equals(c.getClienteId())){
            throw new AccessDeniedException("Acesso negado: usuário não possui permissão para alterar esta avaliação.");
        }
    }

    public void validarCategoriaEmpresa(Usuario user, Long categoriaId){
        Categoria c = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new NotFoundException("Nenhuma Categoria encontrada"));
        if (!c.getEmpresa().getEmpresaId().equals(user.getEmpresa().getEmpresaId())){
            throw new AccessDeniedException("Acesso negado: usuário não possui permissão para alterar esta categoria.");
        }
    }

    public void validarClienteUsuario(Usuario user, Long clienteId){
        Cliente c = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new NotFoundException("Nenhum Cliente encontrado"));
        if (!c.getUsuario().getUsuarioId().equals(user.getUsuarioId())){
            throw new AccessDeniedException("Acesso negado: usuário não possui permissão para visualizar dados deste cliente.");
        }
    }

}