package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.dto.response.DTOAgendamentoResponse;
import com.barberbross.BarberBross.dto.response.DTOClienteResponse;
import com.barberbross.BarberBross.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<DTOClienteResponse>> listarClientes() { //método só pra dev
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    @GetMapping("/{clienteNome}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<DTOClienteResponse> buscarClientePorId(@PathVariable String clienteNome){
        return ResponseEntity.ok(clienteService.buscarCliente(clienteNome));
    }

    @GetMapping("/agendamentos/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<DTOAgendamentoResponse>> buscarAgendamentosDoCliente(@PathVariable Long id){
        return ResponseEntity.ok(clienteService.buscarAgendamentos(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<DTOClienteResponse> editarCliente(@PathVariable Long id, @RequestBody @Valid DTOClienteRequest cliente) {
        return  ResponseEntity.ok(clienteService.editarCliente(id, cliente));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<HttpStatus> deletarCliente(@PathVariable Long id) {
        clienteService.deletarCliente(id);
        return ResponseEntity.noContent().build();
    }

}