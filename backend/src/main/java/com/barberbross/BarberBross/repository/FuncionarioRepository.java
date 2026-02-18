package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    boolean existsByCpfOrEmailOrTelefone(String cpf, String email, String telefone);

    @Query("""
              SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END
              FROM Funcionario f
              WHERE (f.cpf = :cpf
                 OR f.email = :email
                 OR f.telefone = :telefone)
                AND f.id <> :id
            """)
    boolean existeDuplicado(@Param("cpf") String cpf,
                            @Param("email") String email,
                            @Param("telefone") String telefone,
                            @Param("id") Long id);
}
