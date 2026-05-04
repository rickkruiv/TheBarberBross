import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './WebSocketContext';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext({
  notifications: [],
  addNotification: () => {},
  clearNotifications: () => {}
});

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const { client, isConnected } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (isConnected && client && user?.empresaId) {
      const topic = `/topic/empresa/${user.empresaId}/notificacoes`;
      
      const subscription = client.subscribe(topic, (message) => {
        const newNotification = JSON.parse(message.body);
        setNotifications(prev => [newNotification, ...prev].slice(0, 50));
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isConnected, client, user?.empresaId]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
