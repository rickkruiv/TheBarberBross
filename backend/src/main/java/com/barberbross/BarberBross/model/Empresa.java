package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOEmpresaRequest;
import com.barberbross.BarberBross.enums.TipoAssinatura;
import com.barberbross.BarberBross.interfaces.TemEndereco;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "empresas")
public class Empresa implements TemEndereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long empresaId;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false)
    private String nomeFantasia;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(nullable = false, length = 15)
    private String telefone;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAssinatura tipoAssinatura;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos;

    public Empresa(DTOEmpresaRequest dto) {
        this.razaoSocial = dto.razaoSocial();
        this.nomeFantasia = dto.nomeFantasia();
        this.cnpj = dto.cnpj();
        this.telefone = dto.telefone();
        this.email = dto.email();
        this.tipoAssinatura = dto.tipoAssinatura();
        this.agendamentos = new ArrayList<>();
    }

    public Empresa() {}
    
    public Long getEmpresaId() { return empresaId; }

    public String getRazaoSocial() { return razaoSocial; }

    public String getNomeFantasia() { return nomeFantasia; }

    public Endereco getEndereco() { return endereco; }

    public String getCnpj() { return cnpj; }

    public String getTelefone() { return telefone; }

    public String getEmail() { return email; }

    public TipoAssinatura getTipoAssinatura() { return tipoAssinatura; }

    public List<Agendamento> getAgendamentos() { return agendamentos; }

    public void atualizarDados(DTOEmpresaRequest dto) {
        this.razaoSocial = dto.razaoSocial();
        this.nomeFantasia = dto.nomeFantasia();
        this.cnpj = dto.cnpj();
        this.email = dto.email();
        this.telefone = dto.telefone();
        this.tipoAssinatura = dto.tipoAssinatura();
    }

    @Override
    public void atualizarEndereco(Endereco e) { this.endereco = e; }

}