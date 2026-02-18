package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOCategoriaRequest;
import com.barberbross.BarberBross.dto.response.DTOCategoriaResponse;
// import com.barberbross.BarberBross.model.Categoria;
import com.barberbross.BarberBross.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @PostMapping
    public ResponseEntity<DTOCategoriaResponse> salvarCategoria(@RequestBody @Valid DTOCategoriaRequest novaCategoria) {
        return ResponseEntity.status(HttpStatus.CREATED).
                body(categoriaService.salvarCategoria(novaCategoria));
    }

    @GetMapping
    public ResponseEntity<List<DTOCategoriaResponse>> listarCategorias() {
        return ResponseEntity.ok(categoriaService.listarCategorias());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOCategoriaResponse> buscarCategoriaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.buscarCategoriaPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTOCategoriaResponse> editarCategoria(@PathVariable Long id,
                                                                @RequestBody @Valid DTOCategoriaRequest categoria) {
        return ResponseEntity.ok(categoriaService.editarCategoria(id, categoria));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarCliente(@PathVariable Long id) {
        categoriaService.deletarCategoria(id);
        return ResponseEntity.noContent().build();
    }

}