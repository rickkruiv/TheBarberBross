package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioSimplesResponse;
import com.barberbross.BarberBross.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;


    @PostMapping
    public ResponseEntity<DTOFuncionarioSimplesResponse> salvarFuncionario(@RequestBody @Valid DTOFuncionarioRequest novoFuncionario){
        return ResponseEntity.status(HttpStatus.CREATED).body(funcionarioService.salvarFuncionario(novoFuncionario));
    }

    @PostMapping("{id}/endereco")
    public ResponseEntity<HttpStatus> salvarEnderecoFuncionario(@PathVariable Long id,
                                                                @RequestBody @Valid DTOEnderecoRequest endereco){
        funcionarioService.salvarEnderecoFuncionario(id, endereco);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("{id}/endereco")
    public ResponseEntity<DTOEnderecoResponse> buscarEnderecoFuncionario(@PathVariable Long id){
        return ResponseEntity.ok(funcionarioService.buscarEnderecoFuncionario(id));
    }

    @PutMapping("{id}/endereco")
    public ResponseEntity<HttpStatus> editarEnderecoFuncionario(@PathVariable Long id,
                                                                @RequestBody @Valid DTOEnderecoRequest endereco){
        funcionarioService.editarEnderecoFuncionario(id, endereco);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<DTOFuncionarioSimplesResponse>> listarFuncionarios(){
        return  ResponseEntity.ok(funcionarioService.listarFuncionario());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOFuncionarioResponse> buscarFuncionarioPorId(@PathVariable Long id){
        return  ResponseEntity.ok(funcionarioService.buscarFuncionarioPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTOFuncionarioSimplesResponse> editarFuncionario(@PathVariable Long id,
                                                                    @RequestBody @Valid DTOFuncionarioRequest funcionario){
        return ResponseEntity.ok(funcionarioService.editarFuncionario(id, funcionario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarFuncionario(@PathVariable Long id){
        funcionarioService.deletarFuncionario(id);
        return ResponseEntity.noContent().build();
    }
}
