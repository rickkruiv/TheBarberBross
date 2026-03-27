package com.barberbross.BarberBross.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserPrincipal implements UserDetails {

    private Long userId;
    private Long funcionarioId;
    private Long empresaId;
    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserPrincipal(Long userId, Long userFuncionario, Long empresaId, Collection<? extends GrantedAuthority> authorities) {
        this.userId = userId;
        this.funcionarioId = userFuncionario;
        this.empresaId = empresaId;
        this.authorities = authorities;
    }

    public CustomUserPrincipal(Long userId, Collection<? extends GrantedAuthority> authorities) {
        this.userId = userId;
        this.authorities = authorities;
        this.funcionarioId = null;
        this.empresaId = null;
    }

    public Long getUserId() { return userId; }

    public Long getFuncionarioId() { return funcionarioId; }

    public Long getEmpresaId() { return empresaId; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public String getPassword() { return ""; }

    @Override
    public String getUsername() { return ""; }
}
