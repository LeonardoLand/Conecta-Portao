import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

// O signup foi removido daqui porque o AuthModal já chama a API de cadastro diretamente
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Efeito que carrega o usuário do localStorage quando o site abre
  useEffect(() => {
    const storedUser = localStorage.getItem('conecta-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ===== FUNÇÃO DE LOGIN 100% CORRIGIDA =====
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Chama a nossa nova API de login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a API retornar um erro (usuário não encontrado, senha errada), o login falha
        throw new Error(data.error || 'Falha no login');
      }

      // Se o login deu certo, a API retorna os dados do usuário
      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.name,
      };

      setUser(userData);
      localStorage.setItem('conecta-user', JSON.stringify(userData));
      return true;

    } catch (error) {
      console.error("Erro de login:", error);
      logout(); // Garante que o usuário seja deslogado em caso de falha
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('conecta-user');
  };

  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
