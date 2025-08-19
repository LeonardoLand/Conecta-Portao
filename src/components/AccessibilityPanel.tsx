
import { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Eye, Type, Keyboard, Mouse, Mic, MicOff, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityPanel = ({ isOpen, onClose }: AccessibilityPanelProps) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    voiceNavigation: false,
    keyboardNavigation: false,
    screenReader: false,
    reducedMotion: false,
    fontSize: 100,
    voiceEnabled: false
  });

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isReading, setIsReading] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = 'pt-BR';
      
      newRecognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase();
        
        handleVoiceCommand(command);
      };

      newRecognition.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
      };
      
      setRecognition(newRecognition);
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log('Comando de voz:', command);
    
    if (command.includes('ir para home') || command.includes('ir para início') || command.includes('página inicial')) {
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navegando para a página inicial');
    } else if (command.includes('ir para sobre') || command.includes('sobre nós')) {
      document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navegando para a seção sobre');
    } else if (command.includes('ir para plataforma') || command.includes('plataforma')) {
      document.getElementById('plataforma')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navegando para a seção plataforma');
    } else if (command.includes('ir para contato') || command.includes('contato')) {
      document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navegando para a seção contato');
    } else if (command.includes('ir para mapa') || command.includes('mapa')) {
      window.location.href = '/mapa';
      speak('Navegando para o mapa interativo');
    } else if (command.includes('fechar painel') || command.includes('fechar')) {
      onClose();
      speak('Fechando painel de acessibilidade');
    } else if (command.includes('alto contraste') || command.includes('contraste')) {
      toggleSetting('highContrast');
      speak('Alternando alto contraste');
    } else if (command.includes('texto grande') || command.includes('aumentar fonte')) {
      adjustFontSize(10);
      speak('Aumentando tamanho da fonte');
    } else if (command.includes('texto pequeno') || command.includes('diminuir fonte')) {
      adjustFontSize(-10);
      speak('Diminuindo tamanho da fonte');
    } else if (command.includes('ler página') || command.includes('leitor de tela')) {
      toggleScreenReader();
    } else if (command.includes('rolar para cima') || command.includes('subir')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      speak('Rolando para o topo da página');
    } else if (command.includes('rolar para baixo') || command.includes('descer')) {
      window.scrollBy({ top: 500, behavior: 'smooth' });
      speak('Rolando para baixo');
    } else if (command.includes('parar voz') || command.includes('silêncio')) {
      if (recognition) {
        recognition.stop();
        setIsListening(false);
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
      speak('Parando navegação por voz');
    } else if (command.includes('calendário') || command.includes('eventos')) {
      window.location.href = '/calendario';
      speak('Navegando para o calendário de eventos');
    } else if (command.includes('entrar') || command.includes('login')) {
      const loginButton = document.querySelector('[aria-label*="entrar"], [aria-label*="login"], button:contains("Entrar")') as HTMLElement;
      if (loginButton) {
        loginButton.click();
        speak('Abrindo tela de login');
      } else {
        speak('Botão de login não encontrado');
      }
    } else if (command.includes('menu') || command.includes('abrir menu')) {
      const menuButton = document.querySelector('[aria-label*="menu"], button[aria-expanded]') as HTMLElement;
      if (menuButton) {
        menuButton.click();
        speak('Abrindo menu de navegação');
      } else {
        speak('Menu não encontrado');
      }
    } else if (command.includes('voltar') || command.includes('página anterior')) {
      window.history.back();
      speak('Voltando para página anterior');
    } else if (command.includes('próxima') || command.includes('página seguinte')) {
      window.history.forward();
      speak('Avançando para próxima página');
    } else if (command.includes('zoom in') || command.includes('ampliar')) {
      document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') + 0.1).toString();
      speak('Ampliando a página');
    } else if (command.includes('zoom out') || command.includes('reduzir zoom')) {
      document.body.style.zoom = Math.max(0.5, parseFloat(document.body.style.zoom || '1') - 0.1).toString();
      speak('Reduzindo zoom da página');
    } else if (command.includes('pesquisar') || command.includes('buscar')) {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="pesquis"], input[placeholder*="buscar"]') as HTMLElement;
      if (searchInput) {
        searchInput.focus();
        speak('Campo de pesquisa selecionado');
      } else {
        speak('Campo de pesquisa não encontrado');
      }
    } else if (command.includes('ajuda') || command.includes('comandos')) {
      speak('Comandos disponíveis: ir para home, sobre, plataforma, contato, mapa, calendário, entrar, menu, voltar, próxima, ampliar, reduzir zoom, pesquisar, aumentar fonte, diminuir fonte, alto contraste, ler página, rolar para cima, rolar para baixo, fechar painel, parar voz');
    } else {
      speak('Comando não reconhecido. Diga ajuda para ver os comandos disponíveis');
    }
  };

  const speak = (text: string) => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.volume = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceNavigation = () => {
    if (!recognition) {
      alert('Navegação por voz não é suportada neste navegador');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      speak('Navegação por voz desativada');
    } else {
      recognition.start();
      setIsListening(true);
      speak('Navegação por voz ativada. Diga comandos como: ir para home, ir para sobre, alto contraste');
    }
    
    setSettings(prev => ({ ...prev, voiceNavigation: !prev.voiceNavigation }));
  };

  const toggleScreenReader = () => {
    const newScreenReaderState = !settings.screenReader;
    setSettings(prev => ({ ...prev, screenReader: newScreenReaderState }));
    
    if (newScreenReaderState) {
      speak('Leitor de tela ativado. Posso ler o conteúdo da página para você.');
      
      // Add focus and hover listeners to all interactive elements
      const elements = document.querySelectorAll('button, a, input, h1, h2, h3, h4, h5, h6, [role="button"], [tabindex]');
      elements.forEach(element => {
        const handleFocus = () => {
          if (settings.screenReader) {
            const text = element.textContent || 
                        element.getAttribute('aria-label') || 
                        element.getAttribute('title') || 
                        element.getAttribute('alt') ||
                        'Elemento interativo';
            speak(text);
          }
        };
        
        element.addEventListener('focus', handleFocus);
        element.addEventListener('mouseenter', handleFocus);
      });
      
      // Automatically read page content
      setTimeout(() => {
        const titleElement = document.querySelector('h1');
        const mainContent = titleElement?.textContent || 'Conecta Portão - Plataforma de Acessibilidade';
        speak(mainContent + '. Use Tab para navegar pelos elementos da página.');
      }, 1500);
    } else {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
      speak('Leitor de tela desativado');
    }
  };

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    
    // Provide audio feedback
    if (settings.screenReader) {
      const settingNames = {
        highContrast: 'Alto contraste',
        largeText: 'Texto grande',
        keyboardNavigation: 'Navegação por teclado',
        reducedMotion: 'Animações reduzidas'
      };
      const name = settingNames[setting as keyof typeof settingNames];
      if (name) {
        speak(`${name} ${!settings[setting] ? 'ativado' : 'desativado'}`);
      }
    }
  };

  const adjustFontSize = (increment: number) => {
    const newSize = Math.max(80, Math.min(150, settings.fontSize + increment));
    setSettings(prev => ({ ...prev, fontSize: newSize }));
    
    if (settings.screenReader) {
      speak(`Tamanho da fonte alterado para ${newSize} por cento`);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply settings
    if (settings.highContrast) {
      root.style.filter = 'contrast(200%) brightness(150%) saturate(150%)';
      root.style.setProperty('--high-contrast', '1');
    } else {
      root.style.filter = 'none';
      root.style.removeProperty('--high-contrast');
    }
    
    root.style.fontSize = `${settings.fontSize}%`;
    
    // Enhanced reduced motion implementation
    if (settings.reducedMotion) {
      const style = document.createElement('style');
      style.id = 'reduced-motion-style';
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        .animate-pulse { animation: none !important; }
        .animate-bounce { animation: none !important; }
        .animate-spin { animation: none !important; }
        .animate-slide-up { animation: none !important; }
        .animate-fade-in { animation: none !important; }
      `;
      document.head.appendChild(style);
    } else {
      const existingStyle = document.getElementById('reduced-motion-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    }

    // Enhanced keyboard navigation
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
      
      const keyboardStyle = document.createElement('style');
      keyboardStyle.id = 'keyboard-navigation-style';
      keyboardStyle.textContent = `
        .keyboard-navigation *:focus {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.3) !important;
          transform: scale(1.02) !important;
          z-index: 1000 !important;
          position: relative !important;
        }
        .keyboard-navigation button:focus,
        .keyboard-navigation a:focus,
        .keyboard-navigation input:focus {
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
      `;
      document.head.appendChild(keyboardStyle);
      
      // Add keyboard event listeners
      const handleKeydown = (e: KeyboardEvent) => {
        switch(e.key) {
          case 'ArrowDown':
            e.preventDefault();
            window.scrollBy({ top: 100, behavior: 'smooth' });
            break;
          case 'ArrowUp':
            e.preventDefault();
            window.scrollBy({ top: -100, behavior: 'smooth' });
            break;
          case 'Home':
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
          case 'End':
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            break;
        }
      };
      
      document.addEventListener('keydown', handleKeydown);
      
      return () => {
        document.removeEventListener('keydown', handleKeydown);
      };
    } else {
      root.classList.remove('keyboard-navigation');
      const keyboardStyle = document.getElementById('keyboard-navigation-style');
      if (keyboardStyle) {
        keyboardStyle.remove();
      }
    }
    
    return () => {
      root.style.filter = 'none';
      root.style.fontSize = '100%';
      root.classList.remove('keyboard-navigation');
      const reducedMotionStyle = document.getElementById('reduced-motion-style');
      const keyboardStyle = document.getElementById('keyboard-navigation-style');
      if (reducedMotionStyle) reducedMotionStyle.remove();
      if (keyboardStyle) keyboardStyle.remove();
    };
  }, [settings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md">
      <div className="fixed left-0 top-0 h-full w-96 bg-white shadow-2xl overflow-y-auto animate-slide-in-left">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-conecta-blue">
              Painel de Acessibilidade
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-red-100 hover:text-red-600 transition-all duration-300 rounded-full"
              aria-label="Fechar painel"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Navegação por Voz - Melhorada */}
            <div className={`border-2 rounded-xl p-5 transition-all duration-500 ${
              isListening 
                ? 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg animate-pulse' 
                : 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {isListening ? (
                    <Mic className="h-6 w-6 text-red-500 animate-bounce" />
                  ) : (
                    <MicOff className="h-6 w-6 text-gray-500" />
                  )}
                  <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Navegação por Voz
                  </span>
                </div>
                <Button
                  variant={settings.voiceNavigation ? "default" : "outline"}
                  size="sm"
                  onClick={toggleVoiceNavigation}
                  className={`transition-all duration-300 ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white animate-pulse' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                  }`}
                >
                  {isListening ? 'Parar 🛑' : 'Ativar 🎤'}
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-2 bg-white/50 p-3 rounded-lg">
                {isListening ? (
                  <span className="text-red-600 font-medium">🔴 Escutando comandos... Fale agora!</span>
                ) : (
                  'Comandos: "ir para home/sobre/plataforma/contato/mapa", "aumentar/diminuir fonte", "alto contraste", "ler página", "rolar para cima/baixo", "ajuda"'
                )}
              </p>
            </div>

            {/* Leitor de Tela - Melhorado */}
            <div className="border-2 border-green-200 rounded-xl p-5 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-6 w-6 text-green-600" />
                  <span className="font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Leitor de Tela
                  </span>
                </div>
                <Button
                  variant={settings.screenReader ? "default" : "outline"}
                  size="sm"
                  onClick={toggleScreenReader}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300"
                >
                  {settings.screenReader ? '🔊 Ativo' : '🔇 Inativo'}
                </Button>
              </div>
              <p className="text-sm text-gray-600 bg-white/50 p-3 rounded-lg">
                {settings.screenReader ? 
                  '🎯 Lendo conteúdo automaticamente' : 
                  'Ativa a leitura automática do conteúdo da página'
                }
              </p>
            </div>

            {/* Contraste - Melhorado */}
            <div className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-r from-purple-50 to-violet-50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-purple-600" />
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Alto Contraste
                  </span>
                </div>
                <Button
                  variant={settings.highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('highContrast')}
                  className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white transition-all duration-300"
                >
                  {settings.highContrast ? '👁️ Ativo' : '👁️ Inativo'}
                </Button>
              </div>
              <p className="text-sm text-gray-600 bg-white/50 p-3 rounded-lg">
                Melhora a visibilidade do conteúdo para baixa visão
              </p>
            </div>

            {/* Tamanho da Fonte - Melhorado */}
            <div className="border-2 border-orange-200 rounded-xl p-5 bg-gradient-to-r from-orange-50 to-yellow-50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Type className="h-6 w-6 text-orange-600" />
                <span className="font-semibold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Tamanho da Fonte
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustFontSize(-10)}
                  disabled={settings.fontSize <= 80}
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white border-0 transition-all duration-300 disabled:opacity-50"
                >
                  A- 🔽
                </Button>
                <span className="text-lg font-bold px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg min-w-[80px] text-center">
                  {settings.fontSize}%
                </span>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => adjustFontSize(10)}
                  disabled={settings.fontSize >= 150}
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white border-0 transition-all duration-300 disabled:opacity-50"
                >
                  A+ 🔼
                </Button>
              </div>
            </div>

            {/* Navegação por Teclado - Melhorado */}
            <div className="border-2 border-teal-200 rounded-xl p-5 bg-gradient-to-r from-teal-50 to-cyan-50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Keyboard className="h-6 w-6 text-teal-600" />
                  <span className="font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Navegação por Teclado
                  </span>
                </div>
                <Button
                  variant={settings.keyboardNavigation ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('keyboardNavigation')}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white transition-all duration-300"
                >
                  {settings.keyboardNavigation ? '⌨️ Ativo' : '⌨️ Inativo'}
                </Button>
              </div>
              <p className="text-sm text-gray-600 bg-white/50 p-3 rounded-lg">
                Tab, Enter, Setas para navegar sem mouse
              </p>
            </div>

            {/* Reduzir Movimento - Melhorado */}
            <div className="border-2 border-pink-200 rounded-xl p-5 bg-gradient-to-r from-pink-50 to-rose-50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Mouse className="h-6 w-6 text-pink-600" />
                  <span className="font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    Reduzir Animações
                  </span>
                </div>
                <Button
                  variant={settings.reducedMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('reducedMotion')}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white transition-all duration-300"
                >
                  {settings.reducedMotion ? '🚫 Ativo' : '✨ Inativo'}
                </Button>
              </div>
              <p className="text-sm text-gray-600 bg-white/50 p-3 rounded-lg">
                Remove animações para sensibilidade ao movimento
              </p>
            </div>
          </div>

          <div className="mt-8 p-5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border-2 border-blue-200">
            <h3 className="font-bold text-conecta-blue mb-3 text-lg">✨ Dicas de Acessibilidade:</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">🔹</span>
                Use Tab para navegar entre elementos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">🔹</span>
                Pressione Enter para ativar botões
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">🔹</span>
                Use as setas para navegar em menus
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">🔹</span>
                Pressione Esc para fechar modais
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">🔹</span>
                Ative o leitor de tela para navegação por áudio
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;
