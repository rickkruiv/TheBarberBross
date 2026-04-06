package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.dto.request.DTOAtualizaServicosResquest;
import com.barberbross.BarberBross.dto.response.DTOAgendamentoResponse;
import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<DTOAgendamentoResponse> salvarAgendamento(@RequestBody @Valid DTOAgendamentoRequest agendamento) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agendamentoService.salvar(agendamento));
    }

    @GetMapping("/{agendamentoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COLABORADOR', 'CLIENTE')")
    public ResponseEntity<DTOAgendamentoResponse> buscarAgendamento(@PathVariable Long agendamentoId) {
        return ResponseEntity.ok(agendamentoService.buscarAgendamentoPorId(agendamentoId));
    }

    @GetMapping("/empresa/{data}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COLABORADOR')")
    public ResponseEntity<List<DTOAgendamentoResponse>> listarAgendamentosPorEmpresaDia(@PathVariable LocalDate data) {
        return ResponseEntity.ok(agendamentoService.listarAgendamentosEmpresaPorDia(data));
    }

    @GetMapping("/barbeiro/{funcionarioId}/{data}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COLABORADOR')")
    public ResponseEntity<List<DTOAgendamentoResponse>> listarAgendamentosPorFuncionarioDia(@PathVariable Long funcionarioId,
                                                                                            @PathVariable LocalDate data){
        return ResponseEntity.ok(agendamentoService.listarAgendamentosBarbeiroPorDia(funcionarioId, data));

    }

    @GetMapping("/empresa/")
    @PreAuthorize("hasAnyRole('ADMIN', 'COLABORADOR')")
    public ResponseEntity<List<DTOAgendamentoResponse>> listarAgendamentosEmpresaPorPeriodo(
            @RequestParam(required = false) LocalDate inicio,
            @RequestParam(required = false) LocalDate fim) {
        LocalDate dataInicio = (inicio != null) ? inicio : LocalDate.of(2020, 1, 1);
        LocalDate dataFim = (fim != null) ? fim : LocalDate.of(2050, 1, 1);
        return ResponseEntity.ok(agendamentoService.listarAgendamentosEmpresaPorPeriodo(dataInicio, dataFim));
    }

    @GetMapping("/barbeiro/{funcionarioId}/")
    @PreAuthorize("hasAnyRole('ADMIN', 'COLABORADOR')")
    public ResponseEntity<List<DTOAgendamentoResponse>> listarAgendamentosBarbeiroPorPeriodo(@PathVariable Long funcionarioId,
                                                                                             @RequestParam(required = false) LocalDate inicio,
                                                                                             @RequestParam(required = false) LocalDate fim){
        LocalDate dataInicio = (inicio != null) ? inicio : LocalDate.of(2020, 1, 1);
        LocalDate dataFim = (fim != null) ? fim : LocalDate.of(2050, 1, 1);
        return ResponseEntity.ok(agendamentoService.listarAgendamentosBarbeiroPorPeriodo(funcionarioId, dataInicio, dataFim));
    }

    @PatchMapping("/{agendamentoId}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<DTOAgendamentoResponse> editarServicosAgendamento(@PathVariable Long agendamentoId,
                                                                    @RequestBody @Valid DTOAtualizaServicosResquest servicos) {
        return ResponseEntity.ok(agendamentoService.editarServicosAgendamento(agendamentoId, servicos));
    }

    @PatchMapping("/{agendamentoId}/status")
    @PreAuthorize("hasRole('COLABORADOR')")
    public ResponseEntity<DTOAgendamentoResponse> atualizarStatus(@PathVariable Long agendamentoId,
                                                                  @RequestBody Status status) {
        return ResponseEntity.ok(agendamentoService.atualizarStatus(agendamentoId, status));
    }

    @DeleteMapping("/{agendamentoId}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<HttpStatus> deletarAgendamento(@PathVariable Long agendamentoId) {
        agendamentoService.deletarAgendamento(agendamentoId);
        return ResponseEntity.noContent().build();
    }
}
