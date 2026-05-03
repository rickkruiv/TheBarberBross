import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { useRouter } from "expo-router";
import { buscarClientePorId } from "../services/clienteService";

type LoginRequest = {
  username: string;
  senha: string;
};

type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
};

type AuthContextData = {
  user: User | null;
  cliente: Cliente | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<any>;
  logout: () => Promise<void>;
};

type User = {
  name: string;
  userId: string;
  nivelAcesso: string;
  empresaId: string | null;
  funcionarioId: string | null;
  clienteId: string | null;
};

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([
      "@app:token",
      "@app:name",
      "@app:userId",
      "@app:nivelAcesso",
      "@app:empresaId",
      "@app:funcionarioId",
      "@app:clienteId",
    ])

    delete api.defaults.headers.common.Authorization;

    setUser(null);
    setCliente(null);

    router.replace("/(auth)/login");
  }, []);

  const carregarCliente = useCallback(async (clienteId?: string | null) => {
    if (!clienteId) return;

    try {
      const data = await buscarClientePorId(clienteId);
      setCliente(data);
    } catch (error) {
      console.log("Erro ao buscar cliente:", error);
    }
  }, []);

  const login = useCallback(async ({ username, senha }: { username: string; senha: string }) => {
    const response = await api.post("/auth/login", {
      username,
      senha
    });

    const { token, name, userId, nivelAcesso, empresaId, funcionarioId, clienteId } = response.data;

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    await AsyncStorage.multiSet([
      ["@app:token", token],
      ["@app:name", name],
      ["@app:userId", String(userId)],
      ["@app:nivelAcesso", String(nivelAcesso)],
      ["@app:empresaId", empresaId ? String(empresaId) : ""],
      ["@app:funcionarioId", funcionarioId ? String(funcionarioId) : ""],
      ["@app:clienteId", clienteId ? String(clienteId) : ""],
    ]);

    const userData: User = {
      name,
      userId,
      nivelAcesso,
      empresaId,
      funcionarioId,
      clienteId,
    };

    setUser(userData);
    
    if (clienteId) {
      await carregarCliente(String(clienteId));
    }

    return {
      token,
      name,
      userId,
      nivelAcesso,
      empresaId,
      funcionarioId,
      clienteId,
    };
  }, []);

  useEffect(() => {
    async function loadUserFromStorage() {
      const [
        token,
        name,
        userId,
        nivelAcesso,
        empresaId,
        funcionarioId,
        clienteId,
      ] = await AsyncStorage.multiGet([
        "@app:token",
        "@app:name",
        "@app:userId",
        "@app:nivelAcesso",
        "@app:empresaId",
        "@app:funcionarioId",
        "@app:clienteId",
      ]);

      const storageData = {
        token: token[1],
        name: name[1],
        userId: userId[1],
        nivelAcesso: nivelAcesso[1],
        empresaId: empresaId[1],
        funcionarioId: funcionarioId[1],
        clienteId: clienteId[1],
      };

      if (
        storageData.token &&
        storageData.name &&
        storageData.userId &&
        storageData.nivelAcesso
      ) {
        api.defaults.headers.common.Authorization = `Bearer ${storageData.token}`;

        const userData = {
          name: storageData.name,
          userId: storageData.userId,
          nivelAcesso: storageData.nivelAcesso,
          empresaId: storageData.empresaId,
          funcionarioId: storageData.funcionarioId,
          clienteId: storageData.clienteId,
        };

        setUser(userData);

        if (storageData.clienteId) {
          await carregarCliente(storageData.clienteId);
        }
      }

      setLoading(false);
    }

    loadUserFromStorage();
  }, []);

  const value = useMemo(() => {
    return {
      user,
      cliente,
      loading,
      isAuthenticated: !!user,
      login,
      logout
    };
  }, [user, cliente, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}