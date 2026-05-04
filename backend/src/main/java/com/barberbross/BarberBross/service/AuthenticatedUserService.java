package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.enums.NivelAcesso;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Funcionario;
import com.barberbross.BarberBross.model.Usuario;
import com.barberbross.BarberBross.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUserService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public Usuario get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            throw new RuntimeException("Usuário não autenticado");
        }

        Usuario u = (Usuario) auth.getPrincipal();

//        if (u.getNivelAcesso().equals(NivelAcesso.ADMIN) || u.getNivelAcesso().equals(NivelAcesso.COLABORADOR)){
//            if (u.getFuncionario() == null) {
//                return new Usuario(u);
//            }
//
//            Funcionario f = funcionarioRepository.findByUsuarioUsuarioId(u.getUsuarioId())
//                    .orElseThrow(() -> new NotFoundException("Nenhum Funcionario encontrado."));
//
//            return new Usuario(u.getUsuarioId(), f,
//                    f.getEmpresa(), u.getAuthorities(), u.getNivelAcesso());
//        }

        return new Usuario(u);
    }

    public boolean isColaborador(){
        Usuario u = get();
        return u.getAuthorities().stream().
                anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") ||
                        a.getAuthority().equals("ROLE_COLABORADOR"));
    }

    public boolean isAdmin(){
        Usuario u = get();
        return u.getAuthorities().stream().
                anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    public boolean isFornecedor(){
        Usuario u = get();
        return u.getAuthorities().stream().
                anyMatch(a -> a.getAuthority().equals("ROLE_FORNECEDOR"));
    }

}
