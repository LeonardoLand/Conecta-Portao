
import { Accessibility, Settings, Map } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AccessibilityPanel from './AccessibilityPanel';

const Hero = () => {
  const [showAccessibility, setShowAccessibility] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const sections = document.querySelectorAll('#sobre, #plataforma, #contato');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMapAccess = () => {
    if (user) {
      navigate('/mapa');
    } else {
      scrollToSection('plataforma');
    }
  };

  return (
    <>
      <section id="home" className="min-h-[85vh] bg-gradient-to-br from-conecta-blue via-conecta-blue to-conecta-blue/90 flex items-center justify-center pt-24 pb-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-overlay filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Accessibility Button */}
        <button
          onClick={() => setShowAccessibility(true)}
          className="fixed top-24 right-6 z-50 bg-conecta-blue backdrop-blur-sm text-white p-4 rounded-full hover:bg-conecta-blue/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 group"
          aria-label="Abrir painel de acessibilidade"
        >
          <Accessibility className="h-6 w-6" />
          <span className="hidden md:inline-block text-sm font-medium text-white">
            Acessibilidade
          </span>
        </button>
        
        <div className="text-center text-white max-w-6xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight tracking-tight animate-fade-in">
            <span className="text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Conecta Portão
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed font-light opacity-95 animate-slide-up mb-8" style={{ animationDelay: '0.3s' }}>
            <strong>Mapa interativo de acessibilidade</strong> para Portão/RS - Descubra locais acessíveis com informações detalhadas e confiáveis
          </p>
          
          {/* CTA Principal para o Mapa */}
          <div className="flex flex-col items-center animate-slide-up mb-12" style={{ animationDelay: '0.5s' }}>
            <Button
              onClick={handleMapAccess}
              size="lg"
              className="bg-white text-conecta-blue hover:bg-gray-100 font-bold text-xl px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-4"
            >
              <Map className="h-6 w-6 mr-3" />
              {user ? 'Explorar o Mapa Agora' : 'Ver Mapa de Acessibilidade'}
            </Button>
            <p className="text-sm opacity-75">
              Centro da cidade mapeado com foco em acessibilidade
            </p>
          </div>
          
          {/* Recursos de Acessibilidade do Site */}
          <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent">
              Site com Recursos de Acessibilidade
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-xl p-6 hover:from-white/25 hover:to-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-white/20">
                <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '0.5s' }}>🎙️</div>
                <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Navegação por Voz</h3>
                <p className="text-sm opacity-90">Controle o site usando comandos de voz</p>
              </div>
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-xl p-6 hover:from-white/25 hover:to-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-white/20">
                <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '0.7s' }}>👁️</div>
                <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Alto Contraste</h3>
                <p className="text-sm opacity-90">Opções de contraste e tamanho de fonte</p>
              </div>
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-xl p-6 hover:from-white/25 hover:to-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-white/20">
                <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '0.9s' }}>⌨️</div>
                <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Navegação por Teclado</h3>
                <p className="text-sm opacity-90">Acesso completo usando apenas o teclado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AccessibilityPanel 
        isOpen={showAccessibility} 
        onClose={() => setShowAccessibility(false)} 
      />
    </>
  );
};

export default Hero;
