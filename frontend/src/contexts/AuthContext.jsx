import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import api from "../services/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("@app:token");
    localStorage.removeItem("@app:name");
    localStorage.removeItem("@app:userId");
    localStorage.removeItem("@app:nivelAcesso");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  }, []);

  const login = useCallback(async ({ username, senha }) => {
    const response = await api.post("/auth/login", {
      username,
      senha
    });

    const { token, name, userId, nivelAcesso } = response.data;

    localStorage.setItem("@app:token", token);
    localStorage.setItem("@app:name", name);
    localStorage.setItem("@app:userId", userId);
    localStorage.setItem("@app:nivelAcesso", nivelAcesso);

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    const userData = {
      name,
      userId,
      nivelAcesso
    };

    setUser(userData);

    return {
      token,
      name,
      userId,
      nivelAcesso
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("@app:token");
    const name = localStorage.getItem("@app:name");
    const userId = localStorage.getItem("@app:userId");
    const nivelAcesso = localStorage.getItem("@app:nivelAcesso");

    if (token && name && userId && nivelAcesso) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setUser({
        name,
        userId,
        nivelAcesso
      });
    }

    setLoading(false);
  }, []);

  const value = useMemo(() => {
    return {
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout
    };
  }, [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}