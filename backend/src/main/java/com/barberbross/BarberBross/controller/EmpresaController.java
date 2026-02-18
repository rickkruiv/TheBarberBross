package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOEmpresaRequest;
import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.dto.response.DTOEmpresaSimplesResponse;
import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.service.EmpresaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @PostMapping
    public ResponseEntity<DTOEmpresaSimplesResponse> salvarEmpresa(@RequestBody @Valid DTOEmpresaRequest novaEmpresa){
        return ResponseEntity.status(HttpStatus.CREATED).body(empresaService.salvarEmpresa(novaEmpresa));
    }

    @PostMapping("{id}/endereco")
    public ResponseEntity<HttpStatus> salvarEnderecoEmpresa(@PathVariable Long id,
                                                            @RequestBody @Valid DTOEnderecoRequest endereco){
        empresaService.salvarEnderecoEmpresa(id, endereco);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("{id}/endereco")
    public ResponseEntity<DTOEnderecoResponse> buscarEnderecoEmpresa(@PathVariable Long id){
        return ResponseEntity.ok(empresaService.buscarEnderecoEmpresa(id));
    }


    @PutMapping("{id}/endereco")
    public ResponseEntity<HttpStatus> editarEnderecoEmpresa(@PathVariable Long id,
                                                            @RequestBody @Valid DTOEnderecoRequest endereco){
        empresaService.editarEnderecoEmpresa(id, endereco);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<DTOEmpresaSimplesResponse>> listarEmpresas(){
        return ResponseEntity.ok(empresaService.listarEmpresas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOEmpresaSimplesResponse> buscarEmpresaPorId(@PathVariable Long id){
        return ResponseEntity.ok(empresaService.buscarEmpresaPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTOEmpresaSimplesResponse> editarEmpresa(@PathVariable Long id,
                                                                   @RequestBody @Valid DTOEmpresaRequest empresa){
        return ResponseEntity.ok(empresaService.editarEmpresa(id, empresa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarEmpresa(@PathVariable Long id){
        empresaService.deletarEmpresa(id);
        return ResponseEntity.noContent().build();
    }

}