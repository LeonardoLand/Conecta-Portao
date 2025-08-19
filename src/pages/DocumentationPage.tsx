
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, Book, Users, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DocumentationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const documents = [
    {
      id: 1,
      title: "Plano de Pesquisa 2024",
      description: "Diretrizes, objetivos e cronograma da pesquisa de 2024.",
      icon: <Book className="h-8 w-8 text-conecta-blue" />,
      category: "Planejamento",
      formats: [
        { type: "PDF", size: "—" },
        { type: "DOCX", size: "—" }
      ]
    },
    {
      id: 2,
      title: "Relatório Final 2024",
      description: "Resultados, análises e conclusões do ciclo 2024.",
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      category: "Relatório",
      formats: [
        { type: "PDF", size: "—" },
        { type: "DOCX", size: "—" }
      ]
    },
    {
      id: 3,
      title: "Plano de Pesquisa 2025",
      description: "Planejamento atualizado e metas para 2025.",
      icon: <Book className="h-8 w-8 text-green-600" />,
      category: "Planejamento",
      formats: [
        { type: "PDF", size: "—" },
        { type: "DOCX", size: "—" }
      ]
    },
    {
      id: 4,
      title: "Relatório Final 2025",
      description: "Relatório consolidado com resultados de 2025.",
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      category: "Relatório",
      formats: [
        { type: "PDF", size: "—" },
        { type: "DOCX", size: "—" }
      ]
    }
  ];

  const handleDownload = (docTitle: string, format: string) => {
    const slugify = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const ext = format.toLowerCase() === 'pdf' ? 'pdf' : 'docx';
    const url = `/docs/${slugify(docTitle)}.${ext}`;

    toast({
      title: 'Download Iniciado',
      description: `Baixando ${docTitle} (${format})...`,
    });

    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-conecta-blue">Conecta Portão</h1>
                <p className="text-gray-600">Documentação Completa</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Introdução */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Documentação <span className="text-conecta-blue">Completa</span>
          </h2>
          <div className="w-24 h-1 bg-conecta-blue mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acesse todos os documentos, relatórios e materiais relacionados ao projeto de acessibilidade em Portão/RS
          </p>
        </div>

        {/* Grid de Documentos */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {documents.map((doc) => (
            <Card key={doc.id} className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
                    {doc.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-conecta-blue transition-colors">
                        {doc.title}
                      </CardTitle>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {doc.category}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 mb-6 text-base leading-relaxed">
                  {doc.description}
                </CardDescription>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Formatos Disponíveis:</h4>
                  {doc.formats.map((format, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <span className="font-medium text-gray-900">{format.type}</span>
                          <span className="text-sm text-gray-500 ml-2">({format.size})</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(doc.title, format.type)}
                        size="sm"
                        className="bg-conecta-blue hover:bg-conecta-blue/90"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seção Adicional */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-conecta-blue to-blue-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Precisa de Mais Informações?</h3>
              <p className="text-blue-100 mb-6">
                Entre em contato conosco para obter documentos adicionais ou esclarecimentos sobre o projeto.
              </p>
              <Button
                onClick={() => navigate('/#contato')}
                variant="outline"
                className="bg-white text-conecta-blue hover:bg-gray-100 border-white"
              >
                Entrar em Contato
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;
