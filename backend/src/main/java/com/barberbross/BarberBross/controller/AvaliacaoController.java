package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOAvaliacaoRequest;
import com.barberbross.BarberBross.dto.response.DTOAvaliacaoResponse;
import com.barberbross.BarberBross.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @PostMapping
    public ResponseEntity<DTOAvaliacaoResponse> salvarAvaliacao(@RequestBody @Valid DTOAvaliacaoRequest novaAvaliacao){
        return ResponseEntity.status(HttpStatus.CREATED).body(avaliacaoService.salvarAvaliacao(novaAvaliacao));
    }

    @GetMapping
    public ResponseEntity<List<DTOAvaliacaoResponse>> listarAvaliacoes(){
        return ResponseEntity.ok(avaliacaoService.listarAvalicao());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOAvaliacaoResponse> buscarAvaliacaoPorId(@PathVariable Long id){
        return ResponseEntity.ok(avaliacaoService.buscarAvaliacaoPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTOAvaliacaoResponse> editarAvaliacao(@PathVariable Long id,
                                                                @RequestBody @Valid DTOAvaliacaoRequest avaliacao){
        return ResponseEntity.ok(avaliacaoService.editarAvaliacao(id, avaliacao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarAvaliacao(@PathVariable Long id){
        avaliacaoService.deletarAvaliacao(id);
        return ResponseEntity.noContent().build();
    }
}
