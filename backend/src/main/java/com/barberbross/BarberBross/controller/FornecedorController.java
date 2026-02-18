package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.dto.request.DTOFornecedorRequest;
import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.dto.response.DTOFornecedorResponse;
import com.barberbross.BarberBross.dto.response.DTOFornecedorSimplesResponse;
import com.barberbross.BarberBross.service.FornecedorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/fornecedores")
public class FornecedorController {

    @Autowired
    private FornecedorService fornecedorService;

    @PostMapping
    public ResponseEntity<DTOFornecedorSimplesResponse> salvarFornecedor(@RequestBody @Valid DTOFornecedorRequest novoFornecedor){
        return ResponseEntity.status(HttpStatus.CREATED).body(fornecedorService.salvarFornecedor(novoFornecedor));
    }

    @PostMapping("{id}/endereco")
    public ResponseEntity<HttpStatus> salvarEnderecoFornecedor(@PathVariable Long id,
                                                               @RequestBody @Valid DTOEnderecoRequest endereco){
        fornecedorService.salvarEnderecoFornecedor(id, endereco);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("{id}/endereco")
    public ResponseEntity<DTOEnderecoResponse> buscarEnderecoFornecedor(@PathVariable Long id){
        return ResponseEntity.ok(fornecedorService.buscarEnderecoFornecedor(id));
    }

    @PutMapping("{id}/endereco")
    public ResponseEntity<HttpStatus> editarEnderecoFornecedor(@PathVariable Long id,
                                                               @RequestBody @Valid DTOEnderecoRequest endereco){
        fornecedorService.editarEnderecoFornecedor(id, endereco);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<DTOFornecedorSimplesResponse>> listarFornecedores(){
        return ResponseEntity.ok(fornecedorService.listarFornecedores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOFornecedorResponse> buscarFornecedorPorId(@PathVariable Long id){
        return ResponseEntity.ok(fornecedorService.buscarFornecedorPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTOFornecedorResponse> editarFornecedor(@PathVariable Long id,
                                                                  @RequestBody @Valid DTOFornecedorRequest fornecedor){
        return ResponseEntity.ok(fornecedorService.editarFornecedor(id, fornecedor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarFornecedor(@PathVariable Long id){
        fornecedorService.deletarFornecedor(id);
        return ResponseEntity.noContent().build();
    }
}