package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    boolean existsByCnpjOrRazaoSocialOrTelefoneOrEmail(String cnpj, String razao, String telefone, String email);

    @Query("""
            SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END
            FROM Empresa e
            WHERE (e.cnpj = :cnpj
                OR e.razaoSocial = :razao
                OR e.telefone = :telefone
                OR e.email = :email)
            AND e.id <> :id
            """)
    boolean existeDuplicado(@Param("cnpj") String cnpj,
                            @Param("razao") String razao,
                            @Param("telefone") String telefone,
                            @Param("email") String email,
                            @Param("id") Long id);
}
