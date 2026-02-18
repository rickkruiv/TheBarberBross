package com.barberbross.BarberBross.model;

import java.time.LocalDate;

import com.barberbross.BarberBross.enums.StatusCargo;

import jakarta.persistence.*;

@Entity
@Table(name = "cargos_funcionario")
public class CargoFuncionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cargoFuncionarioId;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    @ManyToOne
    @JoinColumn(name = "cargo_id")
    private Cargo cargo;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;
    
    @Column(name = "data_fim", nullable = true)
    private LocalDate dataFim;

    @Enumerated(EnumType.STRING)
    private StatusCargo status;

    public CargoFuncionario() {}

    public Long getCargoFuncionarioId() { return cargoFuncionarioId; }
    public void setCargoFuncionarioId(Long cargoFuncionarioId) { this.cargoFuncionarioId = cargoFuncionarioId; }

    public Funcionario getFuncionario() { return funcionario; }
    public void setFuncionario(Funcionario funcionario) { this.funcionario = funcionario; }

    public Cargo getCargo() { return cargo; }
    public void setCargo(Cargo cargo) { this.cargo = cargo; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public StatusCargo getStatus() { return status; }
    public void setStatus(StatusCargo status) { this.status = status; }
}
