package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {


    @Query("""
                SELECT a
                FROM Avaliacao a
                WHERE a.empresa.empresaId = :empresaId
                ORDER BY a.data DESC
            """)
    List<Avaliacao> listarAvaliacoesPorEmpresa(@Param("empresaId") Long empresaId);


}
