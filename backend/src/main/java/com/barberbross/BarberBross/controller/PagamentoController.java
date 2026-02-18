package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOPagamentoRequest;
import com.barberbross.BarberBross.dto.response.DTOPagamentoResponse;
import com.barberbross.BarberBross.service.PagamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/pagamentos")
public class PagamentoController {

    @Autowired
    public PagamentoService pagamentoService;

    @PostMapping
    public ResponseEntity<DTOPagamentoResponse> salvarPagamento(@RequestBody @Valid DTOPagamentoRequest novoPagamento){
        return ResponseEntity.status(HttpStatus.CREATED).body(pagamentoService.salvarPagamento(novoPagamento));
    }

    @GetMapping
    public ResponseEntity<List<DTOPagamentoResponse>> listarPagamentos(){
        return ResponseEntity.ok(pagamentoService.listarPagamentos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOPagamentoResponse> buscarPagamentoPorId(@PathVariable Long id){
        return ResponseEntity.ok(pagamentoService.buscarPagamentoPorId(id));
    }

    @PutMapping("/confirmar/{id}")
    public ResponseEntity<DTOPagamentoResponse> efetuarPagamento(@PathVariable Long id){
        return ResponseEntity.ok(pagamentoService.efetuarPagamento(id));
    }

    @PutMapping("/cancelar/{id}")
    public ResponseEntity<HttpStatus> cancelarPagamento(@PathVariable Long id){
        pagamentoService.cancelarPagamento(id);
        return ResponseEntity.ok().build();
    }

}
