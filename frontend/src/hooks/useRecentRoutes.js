import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const RECENT_ROUTES_KEY = '@app:recent_routes';

export function useRecentRoutes() {
  const [recentRoutes, setRecentRoutes] = useState([]);

  const loadRoutes = useCallback(() => {
    const stored = JSON.parse(localStorage.getItem(RECENT_ROUTES_KEY) || '[]');
    setRecentRoutes(stored);
  }, []);

  useEffect(() => {
    loadRoutes();
    window.addEventListener('storage', loadRoutes);
    return () => window.removeEventListener('storage', loadRoutes);
  }, [loadRoutes]);

  return recentRoutes;
}

export function useRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login') return;

    const stored = JSON.parse(localStorage.getItem(RECENT_ROUTES_KEY) || '[]');
    const newList = [location.pathname, ...stored.filter(path => path !== location.pathname)];
    const trimmed = newList.slice(0, 5);
    
    localStorage.setItem(RECENT_ROUTES_KEY, JSON.stringify(trimmed));
    
    window.dispatchEvent(new Event('storage'));
  }, [location.pathname]);
}
