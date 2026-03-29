package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.exceptions.AccessDeniedException;
import com.barberbross.BarberBross.model.Cliente;
import com.barberbross.BarberBross.model.CustomUserPrincipal;
import com.barberbross.BarberBross.model.Empresa;
import com.barberbross.BarberBross.model.Funcionario;
import com.barberbross.BarberBross.service.ClienteService;
import com.barberbross.BarberBross.service.EmpresaService;
import com.barberbross.BarberBross.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationValidator {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private FuncionarioService funcionarioService;

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
        Cliente c = clienteService.buscarClientePorUsuario(user.getUserId());
        if(!c.getClienteId().equals(clienteId)){
            throw new AccessDeniedException("Acesso negado: cliente não possui permissão para acessar este agendamento.");
        }
    }

    public void validarFuncionarioNoAgendamento(CustomUserPrincipal user, Long funcionarioId){
        Funcionario f = funcionarioService.buscarFuncionario(user.getFuncionarioId());
        if(!f.getFuncionarioId().equals(funcionarioId)){
            throw new AccessDeniedException("Acesso negado: funcionário não possui permissão para acessar este agendamento.");
        }
    }


}
