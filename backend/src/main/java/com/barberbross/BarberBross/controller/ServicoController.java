package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOServicoRequest;
import com.barberbross.BarberBross.dto.response.DTOServicoResponse;
import com.barberbross.BarberBross.service.ServicoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/servicos")
public class ServicoController {
    
    @Autowired
    private ServicoService servicoService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DTOServicoResponse> salvarServico(@RequestBody @Valid DTOServicoRequest novoServico) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicoService.salvarServico(novoServico));
    }

    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COLABORADOR', 'CLIENTE')")
    public ResponseEntity<List<DTOServicoResponse>> listarServico(@PathVariable Long empresaId) {
        return ResponseEntity.ok(servicoService.listarServicos(empresaId));
    }

    @GetMapping("/{servicoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COLABORADOR', 'CLIENTE')")
    public ResponseEntity<DTOServicoResponse> buscarServicoPorId(@PathVariable Long servicoId) {
        return ResponseEntity.ok(servicoService.buscarServicoPorId(servicoId));
    }

    @PatchMapping("/{servicoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DTOServicoResponse> editarServico(@PathVariable Long servicoId, @RequestBody @Valid DTOServicoRequest servico) {
        return  ResponseEntity.ok(servicoService.editarServico(servicoId, servico));
    }

    @DeleteMapping("/{servicoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deletarServico(@PathVariable Long servicoId) {
        servicoService.deletarServico(servicoId);
        return ResponseEntity.noContent().build();
    }
}
