package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.dto.response.DTOAgendamentoResponse;
import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @PostMapping
    public ResponseEntity<DTOAgendamentoResponse> salvarAgendamento(@RequestBody @Valid DTOAgendamentoRequest agendamento) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(agendamentoService.salvarAgendamento(agendamento));
    }

    @GetMapping
    public ResponseEntity<?> buscarAgendamento(@RequestParam Long empresaId,
                                               @RequestParam(required = false) Long agendamentoId) {
        return agendamentoId != null ? ResponseEntity.ok(agendamentoService.buscarAgendamentoPorId(agendamentoId))
                                     : ResponseEntity.ok(agendamentoService.listarAgendamentos(empresaId));
    }

    @PutMapping
    public ResponseEntity<DTOAgendamentoResponse> editarAgendamento(@RequestParam Long agendamentoId,
                                                         @RequestBody @Valid DTOAgendamentoRequest agendamento) {
        return ResponseEntity.ok(agendamentoService.editarAgendamento(agendamentoId, agendamento));
    }
 
    @PutMapping("/status")
    public ResponseEntity<DTOAgendamentoResponse> atualizarStatus(@RequestParam Long agendamentoId,
                                                       @RequestBody Status status) {
        return ResponseEntity.ok(agendamentoService.atualizarStatus(agendamentoId, status));
    }

    @DeleteMapping
    public ResponseEntity<HttpStatus> deletarAgendamento(@RequestParam Long agendamentoId) {
        agendamentoService.deletarAgendamento(agendamentoId);
        return ResponseEntity.noContent().build();
    }
}
