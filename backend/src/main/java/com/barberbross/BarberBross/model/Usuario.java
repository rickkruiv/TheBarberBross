package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOUsuarioRequest;
import com.barberbross.BarberBross.enums.NivelAcesso;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usuarioId;

    @Column(length = 20, unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String senha;

    @OneToOne
    @JoinColumn(name = "funcionarioId", unique = true, nullable = false)
    private Funcionario funcionario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelAcesso nivelAcesso;

    public Usuario(DTOUsuarioRequest dto, Funcionario f) {
        this.username = dto.username();
        this.senha = dto.senha();
        this.funcionario = f;
        this.nivelAcesso = dto.nivelAcesso();
    }

    public Usuario() {}
    
    public Long getUsuarioId() { return usuarioId; }

    public String getUsername() { return username; }

    public String getSenha() { return senha; }

    public Funcionario getFuncionario() { return funcionario; }

    public NivelAcesso getNivelAcesso() { return nivelAcesso; }

    public void atualizarDados(DTOUsuarioRequest dto){
        this.username = dto.username();
        this.senha = dto.senha();
        this.nivelAcesso = dto.nivelAcesso();
    }

}