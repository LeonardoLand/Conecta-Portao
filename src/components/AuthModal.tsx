import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, mode }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  // A função de login continua vindo do seu AuthContext
  const { login } = useAuth(); 
  const { toast } = useToast();

  // ====================================================================
  // ALTERAÇÃO PRINCIPAL FEITA AQUI
  // A função handleSubmit agora sabe como falar com a nossa API de cadastro
  // ====================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'login') {
      // --- LÓGICA DE LOGIN (continua como antes) ---
      try {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast({
            title: 'Login realizado!',
            description: 'Bem-vindo de volta!',
          });
          onClose();
        } else {
          throw new Error('Credenciais inválidas');
        }
      } catch (error) {
        toast({
          title: 'Erro no login',
          description: 'Verifique seu e-mail e senha e tente novamente.',
          variant: 'destructive',
        });
      }

    } else {
      // --- LÓGICA DE CADASTRO (agora chama nossa nova API) ---
      try {
        const response = await fetch('/api/cadastrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: formData.name,
            email: formData.email,
            senha: formData.password,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast({
            title: 'Conta criada com sucesso! ✅',
            description: 'Agora você já pode fazer o login.',
          });
          onClose(); // Fecha o modal para o usuário poder fazer login
        } else {
          // Mostra o erro específico que a API retornou (ex: email já existe)
          throw new Error(result.error || 'Ocorreu um erro desconhecido.');
        }
      } catch (error: any) {
        toast({
          title: 'Erro no cadastro',
          description: error.message,
          variant: 'destructive',
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-conecta-blue focus:border-transparent"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-conecta-blue focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-conecta-blue focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-conecta-blue hover:bg-conecta-blue/90 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? 'Processando...' : (mode === 'login' ? 'Entrar' : 'Criar Conta')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal; 