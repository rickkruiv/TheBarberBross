package com.barberbross.BarberBross.config.websocket;

import com.barberbross.BarberBross.config.security.TokenService;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Funcionario;
import com.barberbross.BarberBross.model.Usuario;
import com.barberbross.BarberBross.repository.FuncionarioRepository;
import com.barberbross.BarberBross.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        try {
            var accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

            assert accessor != null;
            if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                Usuario usuario = usuarioRepository.findByUsuarioId(tokenService.getUserId(pegaToken(accessor)));
                Funcionario funcionario = funcionarioRepository.findByUsuarioUsuarioId(usuario.getUsuarioId())
                        .orElseThrow(() -> new NotFoundException("Nenhum Funcionário encontrado."));

                Usuario principal = new Usuario(usuario.getUsuarioId(),
                        funcionario, funcionario.getEmpresa(), usuario.getAuthorities(), usuario.getNivelAcesso());

                accessor.setUser(new UsernamePasswordAuthenticationToken(
                        principal, null, principal.getAuthorities()
                ));
                accessor.setLeaveMutable(true);
            }

            if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                String destination = accessor.getDestination();

                if (destination == null) return message;

                Authentication auth = (Authentication) accessor.getUser();

                if (auth == null) {
                    throw new IllegalArgumentException("Usuário não autenticado");
                }

                Usuario principal = (Usuario) auth.getPrincipal();
                Long empresaIdUsuario = principal.getEmpresa().getEmpresaId();

                // EXEMPLO: /topic/empresa/1
                if (destination.startsWith("/topic/empresa/")) {
                    Long empresaIdDestino = extrairId(destination);

                    if (!empresaIdUsuario.equals(empresaIdDestino)) {
                        throw new IllegalArgumentException("Acesso negado ao tópico da empresa");
                    }
                }

                // EXEMPLO: /queue/agenda/5
                if (destination.startsWith("/queue/agenda/")) {
                    Long funcionarioIdDestino = extrairId(destination);

                    if (!principal.getFuncionario().getFuncionarioId().equals(funcionarioIdDestino)) {
                        throw new IllegalArgumentException("Acesso negado à agenda");
                    }
                }
            }
            return message;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

    }

    private Long extrairId(String destination) {
        return Long.parseLong(destination.split("/")[3]);
    }

    public String pegaToken(StompHeaderAccessor accessor) {
        String authHeader = accessor.getFirstNativeHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return accessor.getMessage(); //melhorar essa exceção depois
        }

        return authHeader.substring(7);
    }
}
