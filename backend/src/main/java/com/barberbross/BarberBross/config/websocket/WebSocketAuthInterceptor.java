package com.barberbross.BarberBross.config.websocket;

import com.barberbross.BarberBross.config.security.TokenService;
import com.barberbross.BarberBross.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        System.out.println("Entrou no preSend");
        var accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("Conectando sem token (teste)");
                return message;
            }

            String token = authHeader.substring(7);

            String username = tokenService.validarToken(token);

            UserDetails usuario = usuarioRepository.findByUsername(username);

            accessor.setUser(new UsernamePasswordAuthenticationToken(
                    usuario, null, usuario.getAuthorities()
            ));

            System.out.println("Usuário conectado: " + usuario.getUsername());
        }

        return message;

    }
}
