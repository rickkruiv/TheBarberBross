package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.request.DTOUsuarioRequest;
import com.barberbross.BarberBross.enums.NivelAcesso;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usuarioId;

    @Column(length = 20, unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelAcesso nivelAcesso;

    public Usuario(DTOUsuarioRequest dto, String senha) {
        this.username = dto.username();
        this.senha = senha;
        this.nivelAcesso = dto.nivelAcesso();
    }

    public Usuario(DTOClienteRequest dto, String senha) {
        this.username = dto.email();
        this.senha = senha;
        this.nivelAcesso = NivelAcesso.CLIENTE;
    }

    public Usuario(DTOFuncionarioRequest dto, String senha) {
        this.username = dto.email();
        this.senha = senha;
        this.nivelAcesso = NivelAcesso.COLABORADOR;
    }

    public Usuario() {
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getUsername() {
        return username;
    }

    public NivelAcesso getNivelAcesso() {
        return nivelAcesso;
    }

    public void atualizarDados(DTOUsuarioRequest dto) {
        this.username = dto.username();
        this.senha = dto.senha();
        this.nivelAcesso = dto.nivelAcesso();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.nivelAcesso == NivelAcesso.ADMIN) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_COLABORADOR"),
                    new SimpleGrantedAuthority("ROLE_CLIENTE"));

        } else if (this.nivelAcesso == NivelAcesso.COLABORADOR) {
            return List.of(new SimpleGrantedAuthority("ROLE_COLABORADOR"), new SimpleGrantedAuthority("ROLE_CLIENTE"));

        } else return List.of(new SimpleGrantedAuthority("ROLE_CLIENTE"));
    }

    @Override
    public String getPassword() {
        return senha;
    }
    
}