package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOFuncionarioPerfilRequest;
import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioSimplesResponse;
import com.barberbross.BarberBross.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<DTOFuncionarioSimplesResponse>> listarFuncionariosDaEmpresa(@PathVariable Long empresaId){
        return  ResponseEntity.ok(funcionarioService.listarFuncionario(empresaId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<DTOFuncionarioResponse> buscarFuncionarioPorId(@PathVariable Long id){
        return  ResponseEntity.ok(funcionarioService.buscarFuncionarioPorId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DTOFuncionarioSimplesResponse> editarFuncionario(@PathVariable Long id,
                                                                    @RequestBody @Valid DTOFuncionarioRequest funcionario){
        return ResponseEntity.ok(funcionarioService.editarFuncionario(id, funcionario));
    }

    @PutMapping("/perfil/{id}")
    @PreAuthorize("hasRole('COLABORADOR')")
    public ResponseEntity<DTOFuncionarioSimplesResponse> editarPerfilFuncionario(@PathVariable Long id,
                                                                           @RequestBody @Valid DTOFuncionarioPerfilRequest funcionario){
        return ResponseEntity.ok(funcionarioService.editarPerfilFuncionario(id, funcionario));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deletarFuncionario(@PathVariable Long id){
        funcionarioService.deletarFuncionario(id);
        return ResponseEntity.noContent().build();
    }
}
