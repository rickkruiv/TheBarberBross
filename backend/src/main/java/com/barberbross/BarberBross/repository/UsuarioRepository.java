package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Usuario;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByUsername(@NotBlank String username);

    UserDetails findByUsername(@NotBlank String username);

    Usuario findByUsuarioId(@NotBlank Long id);
}
