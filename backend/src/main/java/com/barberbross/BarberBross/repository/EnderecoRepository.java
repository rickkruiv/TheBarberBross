package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
    boolean existsByCepAndLogradouroAndNumeroAndCidadeAndBairroAndUf(String cep, String logradouro, String numero,
                                                                     String cidade, String bairro, String uf);


    @Query("""
            SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END
            FROM Endereco e
            WHERE (e.cep = :cep
                  AND e.logradouro = :logradouro
                  AND e.numero = :numero
                  AND e.cidade = :cidade
                  AND e.bairro = :bairro
                  AND e.uf = :uf)
                 AND e.id <> :id
           """)
    boolean existeDuplicado(@Param("cep") String cep,
                            @Param("logradouro") String logradouro,
                            @Param("numero") String numero,
                            @Param("cidade") String cidade,
                            @Param("bairro") String bairro,
                            @Param("uf") String uf,
                            @Param("id") Long idEndereco);
}
