import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from './AuthContext';
// import { useToast } from '@/hooks/use-toast'; // Não é mais necessário aqui
import { Map, FileText, CheckCircle } from 'lucide-react'; // Removido o 'Lock'
import { useNavigate, Link } from 'react-router-dom'; // Adicionado Link

const PlatformSection = () => {
  // A verificação de 'user' não é mais necessária para a lógica desta seção
  // const { user } = useAuth();
  // const { toast } = useToast();
  const navigate = useNavigate();

  // Esta função não é mais necessária, vamos usar o Link direto
  // const handleMapAccess = () => { ... };

  const handleReportAccess = () => {
    navigate('/documentacao');
  };

  return (
    <section id="plataforma" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-slide-up">
            Nossa <span className="text-conecta-blue">Plataforma</span>
          </h2>
          <div className="w-24 h-1 bg-conecta-blue mx-auto rounded-full animate-slide-up" style={{ animationDelay: '0.2s' }}></div>
          <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Descubra locais acessíveis em Portão/RS através do nosso mapa interativo e acesse toda a documentação do projeto
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group animate-slide-in-left">
            <div className="h-2 bg-gradient-to-r from-conecta-blue to-blue-600"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-conecta-blue/10 rounded-xl">
                  <Map className="h-8 w-8 text-conecta-blue" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-conecta-blue transition-colors">
                    Mapa de Acessibilidade
                  </CardTitle>
                  {/* ==================================================================== */}
                  {/* REMOVIDO: A tag "Login necessário" foi apagada daqui */}
                  {/* ==================================================================== */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-gray-600 mb-6 text-lg leading-relaxed">
                <strong>Função principal da plataforma:</strong> Explore o centro de Portão/RS já mapeado com informações sobre acessibilidade, rampas, banheiros adaptados e facilidades especiais.
              </CardDescription>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Mapa interativo com filtros por categoria</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Avaliações detalhadas de acessibilidade</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Localização e navegação otimizada</span>
                </div>
              </div>
              
              {/* ==================================================================== */}
              {/* ALTERADO: O botão agora é um Link direto para /mapa, sem verificação */}
              {/* ==================================================================== */}
              <Button 
                asChild
                className="w-full bg-conecta-blue hover:bg-conecta-blue/90 text-white py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/mapa">
                  Explorar o Mapa Agora
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group animate-slide-in-right">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Documentação Completa
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-gray-600 mb-6 text-lg leading-relaxed">
                Acesse relatórios, metodologia, guias de acessibilidade e dados estatísticos do projeto. Materiais disponíveis em múltiplos formatos para download.
              </CardDescription>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Relatório completo da pesquisa</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Guias práticos de acessibilidade</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Downloads em PDF e DOCX</span>
                </div>
              </div>
              
              <Button 
                onClick={handleReportAccess}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Acessar Documentação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;