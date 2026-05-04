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

    @Column(length = 100, unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelAcesso nivelAcesso;

    @OneToOne(mappedBy = "usuario")
    private Fornecedor fornecedor;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Funcionario funcionario;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Cliente cliente;

    @Column
    private boolean ativo;

    private Collection<? extends GrantedAuthority> authorities;

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
        this.nivelAcesso = dto.nivelAcesso();
    }

    public Usuario(DTOFuncionarioRequest dto, String senha, Empresa e) {
        this.username = dto.email();
        this.senha = senha;
        this.nivelAcesso = dto.nivelAcesso();
        this.empresa = e;
    }

    public Usuario(Usuario u) {
        this.usuarioId = u.getUsuarioId();
        this.username = u.getUsername();
        this.senha = u.getPassword();
        this.nivelAcesso = u.getNivelAcesso();
        this.fornecedor = u.getFornecedor();
        this.funcionario = u.getFuncionario();
        this.empresa = u.getEmpresa();
        this.cliente = u.getCliente();
        this.authorities = u.getAuthorities();
    }

    public Usuario() {}

    public Usuario(Long usuarioId, Funcionario funcionario, Empresa empresa, Collection<? extends GrantedAuthority> authorities,
                   NivelAcesso nivelAcesso) {
        this.usuarioId = usuarioId;
        this.funcionario = funcionario;
        this.empresa = empresa;
        this.authorities = authorities;
        this.nivelAcesso = nivelAcesso;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getUsername() { return username; }

    public NivelAcesso getNivelAcesso() {
        return nivelAcesso;
    }

    public Fornecedor getFornecedor() { return fornecedor; }

    public Funcionario getFuncionario() { return funcionario; }

    public Cliente getCliente() { return cliente; }

    public Empresa getEmpresa() { return empresa; }

    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) { this.authorities = authorities; }

    public void atualizarDados(DTOUsuarioRequest dto, String senha) {
        this.username = dto.username();
        this.senha = senha;
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
        } else if (this.nivelAcesso == NivelAcesso.CLIENTE) {
            return List.of(new SimpleGrantedAuthority("ROLE_CLIENTE"));
        } else return List.of(new SimpleGrantedAuthority("ROLE_FORNECEDOR"));
    }

    @Override
    public String getPassword() {
        return senha;
    }
    
}