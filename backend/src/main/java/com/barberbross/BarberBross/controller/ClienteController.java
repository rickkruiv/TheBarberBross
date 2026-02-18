package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.dto.response.DTOClienteResponse;
import com.barberbross.BarberBross.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;
    
    @PostMapping
    public ResponseEntity<DTOClienteResponse> salvarCliente(@RequestBody @Valid DTOClienteRequest novoCliente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.salvarCliente(novoCliente));
    }

    @GetMapping
    public ResponseEntity<List<DTOClienteResponse>> listarClientes() {
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOClienteResponse> buscarClientePorId(@PathVariable Long id){
        return ResponseEntity.ok(clienteService.buscarClientePorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTOClienteResponse> editarCliente(@PathVariable Long id, @RequestBody @Valid DTOClienteRequest cliente) {
        return  ResponseEntity.ok(clienteService.editarCliente(id, cliente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarCliente(@PathVariable Long id) {
        clienteService.deletarCliente(id);
        return ResponseEntity.noContent().build();
    }

}