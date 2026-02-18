package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOUsuarioRequest;
import com.barberbross.BarberBross.dto.response.DTOUsuarioResponse;
import com.barberbross.BarberBross.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    public UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<DTOUsuarioResponse> salvarUsuario(@RequestBody @Valid DTOUsuarioRequest novoUsuario){
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.salvarUsuario(novoUsuario));
    }

    @GetMapping
    public ResponseEntity<List<DTOUsuarioResponse>> listarUsuarios(){
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOUsuarioResponse> buscarUsuarioPorId(@PathVariable Long id){
        return ResponseEntity.ok(usuarioService.buscarUsuarioPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTOUsuarioResponse> editarUsuario(@PathVariable Long id, @RequestBody @Valid DTOUsuarioRequest usuario){
        return ResponseEntity.ok(usuarioService.editarUsuario(id, usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarUsuario(@PathVariable Long id){
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}