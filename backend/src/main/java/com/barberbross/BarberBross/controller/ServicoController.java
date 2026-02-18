package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOServicoRequest;
import com.barberbross.BarberBross.dto.response.DTOServicoResponse;
import com.barberbross.BarberBross.service.ServicoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/servicos")
public class ServicoController {
    
    @Autowired
    private ServicoService servicoService;

    @PostMapping
    public ResponseEntity<DTOServicoResponse> salvarServico(@RequestBody @Valid DTOServicoRequest novoServico) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicoService.salvarServico(novoServico));
    }

    @GetMapping
    public ResponseEntity<List<DTOServicoResponse>> listarServico() {
        return ResponseEntity.ok(servicoService.listarServicos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOServicoResponse> buscarServicoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicoService.buscarServicoPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTOServicoResponse> editarServico(@PathVariable Long id, @RequestBody @Valid DTOServicoRequest servico) {
        return  ResponseEntity.ok(servicoService.editarServico(id, servico));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarServico(@PathVariable Long id) {
        servicoService.deletarServico(id);
        return ResponseEntity.noContent().build();
    }
}
