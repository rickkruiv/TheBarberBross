package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {
    boolean existsByCnpjOrTelefoneOrEmail(String cnpj, String telefone, String email);

    @Query("""
            SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END
            FROM Fornecedor f
            WHERE (f.cnpj = :cnpj
                  OR f.telefone = :telefone
                  OR f.email = :email)
                  AND f.id <> :id
            """)
    boolean existeDuplicado(@Param("cnpj") String cnpj,
                            @Param("telefone") String telefone,
                            @Param("email") String email,
                            @Param("id") Long id);
}
