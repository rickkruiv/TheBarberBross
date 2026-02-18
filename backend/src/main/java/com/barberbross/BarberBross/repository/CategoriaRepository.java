package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByNomeOrDescricao(String nome, String descricao);

    @Query("""
            SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
            FROM Categoria c
            WHERE(c.nome = :nome
            OR c.descricao = :descricao)
            AND c.id <> :id""")
    boolean existeDuplicado(@Param("nome") String nome,
                            @Param("descricao") String descricao,
                            @Param("id") Long id);
}
