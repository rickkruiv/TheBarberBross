package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.enums.EstadoCivil;
import com.barberbross.BarberBross.interfaces.TemEndereco;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "funcionarios")
public class Funcionario implements TemEndereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long funcionarioId;

    @Column(length = 50, nullable = false)
    private String nome;

    @Column(unique = true, length = 14, nullable = false)
    private String cpf;
    
    @Column(unique = true, length = 12)
    private String rg;
    
    @Column(length = 15, nullable = false)
    private String telefone;
    
    @Column(length = 100, unique = true, nullable = false)
    private String email;

    private LocalDate nascimento;

    @Enumerated(EnumType.STRING)
    private EstadoCivil estadoCivil;

    @OneToOne(mappedBy = "funcionario")
    private Usuario usuario;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @OneToMany(mappedBy = "funcionario", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos = new ArrayList<>();

    @OneToMany(mappedBy = "funcionario")
    private List<CargoFuncionario> cargosFuncionario;

    public Funcionario(DTOFuncionarioRequest dto) {
        this.nome = dto.nome();
        this.cpf = dto.cpf();
        this.rg = dto.rg();
        this.telefone = dto.telefone();
        this.email = dto.email();
        this.nascimento = dto.nascimento();
        this.estadoCivil = dto.estadoCivil();
        this.agendamentos = new ArrayList<>();
        this.cargosFuncionario = new ArrayList<>();
    }

    public Funcionario() {}

    public Long getFuncionarioId() { return funcionarioId; }

    public String getNome() { return nome; }

    public String getCpf() { return cpf; }

    public String getRg() { return rg; }

    public String getTelefone() { return telefone; }

    public String getEmail() { return email; }

    public LocalDate getNascimento() { return nascimento; }

    public EstadoCivil getEstadoCivil() { return estadoCivil; }

    public Endereco getEndereco() { return endereco; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public List<Agendamento> getAgendamentos() { return agendamentos; }

    public List<CargoFuncionario> getCargosFuncionario() { return cargosFuncionario; }

    public void atualizarDados(DTOFuncionarioRequest dto, List<Agendamento> agendamentos
            , List<CargoFuncionario> historicoCargos) {
        this.cpf = dto.cpf();
        this.email = dto.email();
        this.nome = dto.nome();
        this.rg = dto.rg();
        this.estadoCivil = dto.estadoCivil();
        this.nascimento = dto.nascimento();
        this.telefone = dto.telefone();
        this.agendamentos = agendamentos;
        this.cargosFuncionario = historicoCargos;
    }

    @Override
    public void atualizarEndereco(Endereco e) { this.endereco = e; }
}