package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    boolean existsByNomeAndEmpresaEmpresaId(String nome, Long empresaId);

    List<Servico> findAllByEmpresaEmpresaId(Long empresaId);

    @Query("""
            SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
            FROM Servico s
            WHERE s.nome = :nome
            AND s.empresa.empresaId <> :empresaId
            AND s.servicoId <> :servicoId
            """)
    boolean existeDuplicado(@Param("nome") String nome,
                            @Param("empresaId") Long empresaId,
                            @Param("servicoId") Long servicoId);
}
