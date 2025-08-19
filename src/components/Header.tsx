
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';
import { User, LogOut } from 'lucide-react';

const Header = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });
  
  const { user, logout } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-conecta-blue/95 backdrop-blur-sm shadow-lg border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="text-white font-bold text-xl">
            Conecta <span className="font-light">Portão</span>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`text-white hover:text-blue-200 transition-all duration-300 font-medium ${
                activeSection === 'home' ? 'border-b-2 border-white pb-1' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              className={`text-white hover:text-blue-200 transition-all duration-300 font-medium ${
                activeSection === 'sobre' ? 'border-b-2 border-white pb-1' : ''
              }`}
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection('plataforma')}
              className={`text-white hover:text-blue-200 transition-all duration-300 font-medium ${
                activeSection === 'plataforma' ? 'border-b-2 border-white pb-1' : ''
              }`}
            >
              A Plataforma
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className={`text-white hover:text-blue-200 transition-all duration-300 font-medium ${
                activeSection === 'contato' ? 'border-b-2 border-white pb-1' : ''
              }`}
            >
              Contato
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <User className="h-5 w-5" aria-label="Conta" />
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  onClick={() => openAuthModal('login')}
                  variant="outline" 
                  size="sm"
                  className="bg-white text-conecta-blue hover:bg-gray-100 border-white font-medium"
                >
                  Entrar
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
      />
    </>
  );
};

export default Header;
