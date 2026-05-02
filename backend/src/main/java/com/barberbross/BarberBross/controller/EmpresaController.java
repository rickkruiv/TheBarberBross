package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOEmpresaRequest;
import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.dto.response.DTOEmpresaResponse;
import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioResponse;
import com.barberbross.BarberBross.service.EmpresaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DTOEmpresaResponse> salvarEmpresa(@RequestBody @Valid DTOEmpresaRequest novaEmpresa){
        return ResponseEntity.status(HttpStatus.CREATED).body(empresaService.salvarEmpresa(novaEmpresa));
    }

    @GetMapping("{idEmpresa}/endereco")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<DTOEnderecoResponse> buscarEnderecoEmpresa(@PathVariable Long idEmpresa){
        return ResponseEntity.ok(empresaService.buscarEnderecoEmpresa(idEmpresa));
    }

    @GetMapping("{idEmpresa}/funcionarios")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<DTOFuncionarioResponse>> buscarFuncionariosDaEmpresa(@PathVariable Long idEmpresa){
        return ResponseEntity.ok(empresaService.buscarFuncionariosDaEmpresa(idEmpresa));
    }

    @PutMapping("{idEmpresa}/endereco")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> editarEnderecoEmpresa(@PathVariable Long idEmpresa,
                                                            @RequestBody @Valid DTOEnderecoRequest endereco){
        empresaService.editarEnderecoEmpresa(idEmpresa, endereco);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<DTOEmpresaResponse>> listarEmpresas(){
        return ResponseEntity.ok(empresaService.listarEmpresas());
    }

    @GetMapping("/{idEmpresa}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<DTOEmpresaResponse> buscarEmpresaPorId(@PathVariable Long idEmpresa){
        return ResponseEntity.ok(empresaService.buscarEmpresaPorId(idEmpresa));
    }

    @PutMapping("/{idEmpresa}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DTOEmpresaResponse> editarEmpresa(@PathVariable Long idEmpresa,
                                                                   @RequestBody @Valid DTOEmpresaRequest dto){
        return ResponseEntity.ok(empresaService.editarEmpresa(idEmpresa, dto));
    }

    @DeleteMapping("/{idEmpresa}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deletarEmpresa(@PathVariable Long idEmpresa){
        empresaService.deletarEmpresa(idEmpresa);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{idEmpresa}")
    @PreAuthorize("hasRole('ADMIN')") //só pra dev (temporario)
    public ResponseEntity<HttpStatus> ativarEmpresa(@PathVariable Long idEmpresa){
        empresaService.ativarEmpresa(idEmpresa);
        return ResponseEntity.ok().build();
    }

}