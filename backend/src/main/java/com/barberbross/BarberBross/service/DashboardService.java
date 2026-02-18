package com.barberbross.BarberBross.service;

import java.time.Duration;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.model.Agendamento;
import com.barberbross.BarberBross.repository.AgendamentoRepository;

@Service
public class DashboardService {

    @Autowired 
    private AgendamentoRepository agendamentoRepository;

    public double calcularReceitaTotal() {
        List<Agendamento> agendamentos = agendamentoRepository.findAll();

        System.out.println();

        return agendamentos.stream()
                           .filter(agendamento -> agendamento.getStatus() == Status.CONCLUIDO || 
                                                  agendamento.getStatus() == Status.EM_ANDAMENTO)
                           .mapToDouble(Agendamento::getValorTotal)
                           .sum(); 
    }

    public long contarAgendamentos() {
        return agendamentoRepository.count();
    }

    public double calcularTicketMedio() {
        List<Long> clientes = agendamentoRepository.findDistinctClienteIdsByStatusIn(
            List.of(Status.CONCLUIDO, Status.EM_ANDAMENTO)
        );

        if (clientes.isEmpty()) return 0.0;

        return calcularReceitaTotal() / clientes.size();
    }

    public double calcularTaxaOcupacao() {
        List<Agendamento> agendamentos = agendamentoRepository.findByStatusIn(
            List.of(Status.CONCLUIDO, Status.EM_ANDAMENTO)
        );

        long minutosTrabalhados = agendamentos.stream()
                                              .map(Agendamento::getServicos) 
                                              .filter(Objects::nonNull)
                                              .flatMap(List::stream)
                                              .mapToLong(s -> (long) s.getDuracao())
                                              .sum();

        long minutosFuncionamento = Duration.between(LocalTime.of(9, 0), LocalTime.of(19, 0)).toMinutes();
        if (minutosFuncionamento == 0) return 0.0;

        double taxa = (double) minutosTrabalhados / minutosFuncionamento;
        return Math.min(taxa * 100, 100);
    }


    public DashboardResponse gerarDashboard() {
        DashboardResponse dto = new DashboardResponse();
        dto.setReceitaTotal(calcularReceitaTotal());
        dto.setAgendamentos(contarAgendamentos());
        dto.setTicketMedio(calcularTicketMedio());
        dto.setTaxaOcupacao(calcularTaxaOcupacao());
        return dto;
    }

    public static class DashboardResponse {
        private double receitaTotal;
        private long agendamentos;
        private double ticketMedio;
        private double taxaOcupacao;

        public double getReceitaTotal() { return receitaTotal; }
        public void setReceitaTotal(double receitaTotal) { this.receitaTotal = receitaTotal; }

        public long getAgendamentos() { return agendamentos; }
        public void setAgendamentos(long agendamentos) { this.agendamentos = agendamentos; }

        public double getTicketMedio() { return ticketMedio; }
        public void setTicketMedio(double ticketMedio) { this.ticketMedio = ticketMedio; }

        public double getTaxaOcupacao() { return taxaOcupacao; }
        public void setTaxaOcupacao(double taxaOcupacao) { this.taxaOcupacao = taxaOcupacao; }
    }

}

// receita total    -> soma dos valores de serviços + produtos
// agendamento      -> numero de agendamentos
// ticket médio     -> faturamento total / numero de clientes atendidos
// taxa de ocupacao -> horas trabalhadas / horas de funcionamento