package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Cliente;

public record DTOClienteResponse(
        Long clienteId,
        String nome,
        String email,
        String telefone) {

   public DTOClienteResponse(Cliente c){
       this(c.getClienteId(), c.getNome(), c.getEmail(), c.getTelefone());
   }
}
