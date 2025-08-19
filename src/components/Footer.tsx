
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-conecta-blue/10 to-purple-600/10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Conecta Portão</h3>
            <p className="text-gray-400">Tecnologia para uma cidade mais inclusiva</p>
          </div>
          <div className="mt-6">
            <Button
              onClick={() => (window.location.href = '/calendario')}
              variant="outline"
              className="bg-white text-conecta-blue hover:bg-gray-100"
            >
              Ver Calendário
            </Button>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              © 2025 <span className="text-white font-semibold">Leonardo Land</span> e <span className="text-white font-semibold">Gabriel Henry</span>. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Desenvolvido com ❤️ para promover a inclusão digital
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
