package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query("SELECT DISTINCT a.cliente.clienteId FROM Agendamento a WHERE a.status IN :status")
    List<Long> findDistinctClienteIdsByStatusIn(List<Status> status);

    List<Agendamento> findByStatusIn(List<Status> status);

    @Query("SELECT a FROM Agendamento a WHERE a.empresa.empresaId = :empresaId")
    List<Agendamento> findByEmpresaId(@Param("empresaId") Long empresaId);

    @Query("""
             SELECT COUNT(a) > 0
             FROM Agendamento a\s
             WHERE a.funcionario.funcionarioId = :funcionarioId
                  AND a.empresa.empresaId = :empresaId\s
                  AND a.dataHorario = :dataHorario\s
                  AND a.status = :status""")
    boolean funcionarioPossuiAgendamentoNoHorario(@Param("funcionarioId") Long funcionarioId,
                                                  @Param("empresaId") Long empresaId,
                                                  @Param("dataHorario") LocalDateTime dataHorario,
                                                  @Param("status") Status status);

    @Query("""
             SELECT COUNT(a) > 0
             FROM Agendamento a WHERE a.cliente.clienteId = :clienteId AND
                                      a.dataHorario = :dataHorario AND
                                      a.status = :status""")
    boolean clientePossuiAgendamentoNoHorario(@Param("clienteId") Long clienteId,
                                              @Param("dataHorario") LocalDateTime dataHorario,
                                              @Param("status") Status status);

}