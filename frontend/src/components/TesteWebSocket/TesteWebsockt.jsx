import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function TesteWebSocket() {
  const [client, setClient] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [resposta, setResposta] = useState("");

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket,

      onConnect: () => {
        console.log("Conectado!");

        stompClient.subscribe("/topic/mensagem", (msg) => {
          setResposta(msg.body);
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const enviarMensagem = () => {
    if (client && client.connected) {
      client.publish({
        destination: "/app/mensagem",
        body: mensagem,
      });
      console.log(mensagem);
    }
  };

  return (
    <div>
      <h2>Teste WebSocket</h2>

      <input
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
      />

      <button onClick={enviarMensagem}>Enviar</button>

      <p>Resposta: {resposta}</p>
    </div>
  );
}