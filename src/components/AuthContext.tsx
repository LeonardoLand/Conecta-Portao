import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // A função de signup não precisa mais existir aqui, pois o modal chama a API diretamente
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

  // Efeito para carregar o usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('conecta-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ====================================================================
  // FUNÇÃO DE LOGIN CORRIGIDA
  // Agora ela chama a nossa API para validar o usuário de verdade
  // ====================================================================
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a API retornou um erro (usuário não encontrado, senha errada), lança o erro
        throw new Error(data.error || 'Falha no login');
      }

      // Se o login foi um sucesso, a API retorna os dados do usuário
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
      // Garante que o usuário seja nulo em caso de falha
      setUser(null);
      localStorage.removeItem('conecta-user');
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