package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    boolean existsByNome(String nome);
}
