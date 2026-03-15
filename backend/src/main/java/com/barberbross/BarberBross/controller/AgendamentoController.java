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
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(agendamentoService.salvarAgendamento(agendamento));
    }

    @GetMapping("/{agendamentoId}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<DTOAgendamentoResponse> buscarAgendamento(@PathVariable Long agendamentoId) {
        return ResponseEntity.ok(agendamentoService.buscarAgendamentoPorId(agendamentoId));
    }

    @GetMapping("/empresas/{empresaId}/{data}")
    @PreAuthorize("hasRole('COLABORADOR')")
    public ResponseEntity<List<DTOAgendamentoResponse>> listarAgendamentosPorDia(@PathVariable Long empresaId,
                                                                                 @PathVariable LocalDate data) {
        return ResponseEntity.ok(agendamentoService.listarAgendamentosPorDia(empresaId, data));
    }

    @GetMapping("/empresas/{empresaId}/")
    @PreAuthorize("hasRole('COLABORADOR')")
    public ResponseEntity<List<DTOAgendamentoResponse>> listarAgendamentosPorPeriodo(@PathVariable Long empresaId,
                                                                                @RequestParam LocalDate inicio,
                                                                                @RequestParam LocalDate fim) {
        return ResponseEntity.ok(agendamentoService.listarAgendamentosPorPeriodo(empresaId, inicio, fim));
    }

    @PatchMapping("/{agendamentoId}")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deletarAgendamento(@PathVariable Long agendamentoId) {
        agendamentoService.deletarAgendamento(agendamentoId);
        return ResponseEntity.noContent().build();
    }
}
