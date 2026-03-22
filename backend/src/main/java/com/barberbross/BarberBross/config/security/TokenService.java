package com.barberbross.BarberBross.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.barberbross.BarberBross.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenService {

    @Value("${JWT_SECRET}")
    private String secret;

    public String gerarToken(Usuario u) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("auth-api")
                    .withSubject(u.getUsername())
                    .withClaim("user_id", u.getUsuarioId())
                    .withClaim("nivel_acesso", u.getNivelAcesso().name())
                    .withExpiresAt(Instant.now().plusSeconds(7200))
                    .sign(algorithm);
        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro na criação do token", e); //melhorar essa exceção dps
        }
    }

    public String pegarSubjectDoToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("auth-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e){
            return null;
        }
    }

    public DecodedJWT getDecodedToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("auth-api")
                    .build()
                    .verify(token);
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    public Long getUserId(String token) {
        return getDecodedToken(token).getClaim("user_id").asLong();
    }

    public String getNivelAcesso(String token) {
        return getDecodedToken(token).getClaim("nivel_acesso").asString();
    }


}
