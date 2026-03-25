import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (client) {
        client.deactivate();
        setClient(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem("@app:token");
    if (!token) return;

    const baseUrl = import.meta.env.VITE_API_WEBSOCKET;
    const socketUrl = `${baseUrl}/ws`;

    const stompClient = new Client({
      //webSocketFactory: () => new SockJS(socketUrl),
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log("Conectado", JSON.stringify(frame));
      setIsConnected(true);

      stompClient.subscribe("/topic/empresa/1/agendamentos", (msg) => {
          console.log("Mensagem recebida:", msg.body);
        });

    };

    stompClient.onStompError = (frame) => {
      console.error("qubrou: " + frame.headers["message"]);
      console.error("mais detalhes: " + frame.body);
    };

    stompClient.onWebSocketClose = () => {
      setIsConnected(false);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
      setIsConnected(false);
      setClient(null);
    };
  }, [isAuthenticated]);

  const value = useMemo(() => ({ client, isConnected }), [client, isConnected]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(WebSocketContext);
  if (context === null) {
    throw new Error("deu merda");
  }
  return context;
}
