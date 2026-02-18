package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOProdutoRequest;
import com.barberbross.BarberBross.dto.response.DTOProdutoResponse;
import com.barberbross.BarberBross.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<DTOProdutoResponse> salvarProduto(@RequestBody @Valid DTOProdutoRequest novoProduto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.salvarProduto(novoProduto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOProdutoResponse> buscarProduto(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarProdutoPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<DTOProdutoResponse>> listarProdutos() {
        return ResponseEntity.ok(produtoService.listarProdutos());
    }


    @PutMapping("/{id}")
    public ResponseEntity<DTOProdutoResponse> editarProduto(@PathVariable long id, @RequestBody @Valid DTOProdutoRequest produto) {
        return  ResponseEntity.ok(produtoService.editarProduto(id, produto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}