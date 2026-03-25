package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.enums.NivelAcesso;
import com.barberbross.BarberBross.model.CustomUserPrincipal;
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

    public CustomUserPrincipal get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            throw new RuntimeException("Usuário não autenticado");
        }

        Usuario u = (Usuario) auth.getPrincipal();

        if (u.getNivelAcesso().equals(NivelAcesso.ADMIN) || u.getNivelAcesso().equals(NivelAcesso.COLABORADOR)){
            Funcionario f = funcionarioRepository.findByUsuarioUsuarioId(u.getUsuarioId());

            return new CustomUserPrincipal(u.getUsuarioId(), f.getFuncionarioId(),
                    f.getEmpresa().getEmpresaId(), u.getAuthorities());
        }

        return new CustomUserPrincipal(u.getUsuarioId(), u.getAuthorities());
    }

    public boolean isColaborador(){
        CustomUserPrincipal principal = get();
        return principal.getAuthorities().stream().
                anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_COLABORADOR"));
    }

    public boolean isAdmin(){
        CustomUserPrincipal principal = get();
        return principal.getAuthorities().stream().
                anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
    }

}
