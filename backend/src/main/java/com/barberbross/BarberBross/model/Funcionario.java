package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.interfaces.TemEndereco;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "funcionarios")
public class Funcionario  implements TemEndereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long funcionarioId;

    @Column(length = 50, nullable = false)
    private String nome;

    @Column(unique = true, length = 14, nullable = false)
    private String cpf;

    @Column(length = 15, nullable = false)
    private String telefone;

    @Column(length = 100, unique = true, nullable = false)
    private String email;

    private LocalDate nascimento;

    @Column(nullable = false)
    private LocalDate dataContratacao;

    @Column(nullable = false)
    private BigDecimal salarioBase;

    @Column(nullable = false)
    private BigDecimal percentualComissao;

    @Column(nullable = false)
    private Boolean ativo;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true, nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "funcionario", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos = new ArrayList<>();

    @OneToMany(mappedBy = "funcionario")
    private List<CargoFuncionario> cargosFuncionario;

    public Funcionario(DTOFuncionarioRequest dto, Empresa e, Usuario u) {
        this.nome = dto.nome();
        this.cpf = dto.cpf();
        this.telefone = dto.telefone();
        this.email = dto.email();
        this.nascimento = dto.nascimento();
        this.empresa = e;
        this.dataContratacao = dto.dataContratacao();
        this.salarioBase = dto.salarioBase();
        this.percentualComissao = dto.percentualComissao();
        this.ativo = true;
        this.usuario = u;
        this.agendamentos = new ArrayList<>();
        this.cargosFuncionario = new ArrayList<>();
    }

    public Funcionario() {}

    public Long getFuncionarioId() { return funcionarioId; }

    public String getNome() { return nome; }

    public String getCpf() { return cpf; }

    public String getTelefone() { return telefone; }

    public String getEmail() { return email; }

    public LocalDate getNascimento() { return nascimento; }

    public LocalDate getDataContratacao() { return dataContratacao; }

    public BigDecimal getSalarioBase() { return salarioBase; }

    public BigDecimal getPercentualComissao() { return percentualComissao; }

    public Boolean getAtivo() { return ativo; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Empresa getEmpresa() { return empresa; }

    public Endereco getEndereco() { return endereco; }

    public List<Agendamento> getAgendamentos() { return agendamentos; }

    public List<CargoFuncionario> getCargosFuncionario() { return cargosFuncionario; }

    public void atualizarDados(DTOFuncionarioRequest dto, List<Agendamento> agendamentos
            , List<CargoFuncionario> historicoCargos) {
        this.cpf = dto.cpf();
        this.email = dto.email();
        this.nome = dto.nome();
        this.nascimento = dto.nascimento();
        this.telefone = dto.telefone();
        this.agendamentos = agendamentos;
        this.cargosFuncionario = historicoCargos;
    }

    @Override
    public void atualizarEndereco(Endereco e) { this.endereco = e; }
}