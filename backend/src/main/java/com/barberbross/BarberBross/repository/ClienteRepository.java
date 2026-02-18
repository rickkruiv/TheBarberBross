package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    boolean existsByEmailOrTelefone(String email, String telefone);

    @Query("""
            SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
            FROM Cliente c
            WHERE (c.email = :email
                  OR c.telefone = :telefone)
                  AND c.id <> :id""")
    boolean existeDuplicado(@Param("email") String email,
                            @Param("telefone") String telefone,
                            @Param("id") Long id);
}
