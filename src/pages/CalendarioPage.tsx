// Substitua TODO o conteúdo de: src/pages/CalendarioPage.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Phone, Mail, Accessibility } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  local: string;
  tipoDeficiencia: string[];
  contato: {
    nome: string;
    telefone: string;
    email: string;
  };
  acessibilidade: {
    rampas: boolean;
    banheirosAdaptados: boolean;
    estacionamento: boolean;
    interprete: boolean;
    audioDescricao: boolean;
  };
}

const eventosSimulados: Evento[] = [
  {
    id: 1,
    titulo: "Workshop de Informática Inclusiva",
    descricao: "Aprenda a usar tecnologias assistivas para navegação na internet e uso de computadores",
    data: "2025-10-15",
    horario: "14:00",
    local: "Centro Comunitário Portão",
    tipoDeficiencia: ["Deficiência Visual", "Deficiência Auditiva"],
    contato: { nome: "Maria Silva", telefone: "(51) 9999-1234", email: "maria@centroportao.org.br" },
    acessibilidade: { rampas: true, banheirosAdaptados: true, estacionamento: true, interprete: true, audioDescricao: true }
  },
  {
    id: 2,
    titulo: "Grupo de Apoio - Mobilidade Reduzida",
    descricao: "Encontro mensal para troca de experiências e apoio mútuo entre pessoas com mobilidade reduzida",
    data: "2025-10-20",
    horario: "10:00",
    local: "UBS Portão - Sala de Reuniões",
    tipoDeficiencia: ["Mobilidade Reduzida", "Cadeirantes"],
    contato: { nome: "João Santos", telefone: "(51) 8888-5678", email: "joao.santos@saude.rs.gov.br" },
    acessibilidade: { rampas: true, banheirosAdaptados: true, estacionamento: true, interprete: false, audioDescricao: false }
  },
  {
    id: 3,
    titulo: "Aula de Libras para Iniciantes",
    descricao: "Curso básico de Língua Brasileira de Sinais aberto para toda a comunidade",
    data: "2025-11-05",
    horario: "19:00",
    local: "Escola Municipal João da Silva",
    tipoDeficiencia: ["Deficiência Auditiva", "Comunidade em Geral"],
    contato: { nome: "Ana Oliveira", telefone: "(51) 7777-9012", email: "ana.libras@educacao.portao.rs.gov.br" },
    acessibilidade: { rampas: true, banheirosAdaptados: true, estacionamento: false, interprete: true, audioDescricao: false }
  },
];

const CalendarioPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

  useEffect(() => {
    // A trava de login foi removida daqui. Agora a página é pública.
    setEventos(eventosSimulados);
    toast({
      title: "Calendário Carregado! 📅",
      description: "Explore os eventos inclusivos de Portão/RS.",
    });
  }, [toast]);

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const getEventosPorMes = () => {
    return eventos.filter(evento => {
      const dataEvento = new Date(evento.data + 'T00:00:00');
      return dataEvento.getMonth() === mesSelecionado && dataEvento.getFullYear() === anoSelecionado;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/')} variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-conecta-blue">Calendário de Eventos Inclusivos</h1>
                <p className="text-gray-600">Eventos acessíveis em Portão/RS</p>
              </div>
            </div>
            {user && ( // Mostra o "Bem-vindo" apenas se o usuário estiver logado
              <div className="text-sm text-gray-600">
                Bem-vindo, <span className="font-semibold text-conecta-blue">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {meses[mesSelecionado]} {anoSelecionado}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (mesSelecionado === 0) {
                          setMesSelecionado(11);
                          setAnoSelecionado(anoSelecionado - 1);
                        } else {
                          setMesSelecionado(mesSelecionado - 1);
                        }
                      }}
                    >
                      ←
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (mesSelecionado === 11) {
                          setMesSelecionado(0);
                          setAnoSelecionado(anoSelecionado + 1);
                        } else {
                          setMesSelecionado(mesSelecionado + 1);
                        }
                      }}
                    >
                      →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getEventosPorMes().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum evento programado para este mês</p>
                    </div>
                  ) : (
                    getEventosPorMes().map((evento) => (
                      <Card 
                        key={evento.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-conecta-blue"
                        onClick={() => setEventoSelecionado(evento)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-conecta-blue">{evento.titulo}</h3>
                              <p className="text-gray-600 text-sm mb-2">{evento.descricao}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatarData(evento.data)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {evento.horario}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {evento.local}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                              <Accessibility className="h-5 w-5" />
                              <span className="text-xs font-medium">Acessível</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {eventoSelecionado ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-conecta-blue">{eventoSelecionado.titulo}</CardTitle>
                  <CardDescription>{eventoSelecionado.descricao}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">📅 Data e Horário</h4>
                    <p className="text-sm">{formatarData(eventoSelecionado.data)} às {eventoSelecionado.horario}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">📍 Local</h4>
                    <p className="text-sm">{eventoSelecionado.local}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">👥 Público-Alvo</h4>
                    <div className="flex flex-wrap gap-2">
                      {eventoSelecionado.tipoDeficiencia.map((tipo, index) => (
                        <span key={index} className="bg-conecta-blue/10 text-conecta-blue px-2 py-1 rounded-full text-xs">
                          {tipo}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">♿ Recursos de Acessibilidade</h4>
                    <div className="space-y-2 text-sm">
                      <div className={`flex items-center gap-2 ${eventoSelecionado.acessibilidade.rampas ? 'text-green-600' : 'text-red-500'}`}><span>{eventoSelecionado.acessibilidade.rampas ? '✓' : '✗'}</span> Rampas de acesso</div>
                      <div className={`flex items-center gap-2 ${eventoSelecionado.acessibilidade.banheirosAdaptados ? 'text-green-600' : 'text-red-500'}`}><span>{eventoSelecionado.acessibilidade.banheirosAdaptados ? '✓' : '✗'}</span> Banheiros adaptados</div>
                      <div className={`flex items-center gap-2 ${eventoSelecionado.acessibilidade.estacionamento ? 'text-green-600' : 'text-red-500'}`}><span>{eventoSelecionado.acessibilidade.estacionamento ? '✓' : '✗'}</span> Estacionamento reservado</div>
                      <div className={`flex items-center gap-2 ${eventoSelecionado.acessibilidade.interprete ? 'text-green-600' : 'text-red-500'}`}><span>{eventoSelecionado.acessibilidade.interprete ? '✓' : '✗'}</span> Intérprete de Libras</div>
                      <div className={`flex items-center gap-2 ${eventoSelecionado.acessibilidade.audioDescricao ? 'text-green-600' : 'text-red-500'}`}><span>{eventoSelecionado.acessibilidade.audioDescricao ? '✓' : '✗'}</span> Audiodescrição</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">📞 Contato</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {eventoSelecionado.contato.nome}</div>
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> <a href={`tel:${eventoSelecionado.contato.telefone}`} className="text-conecta-blue hover:underline">{eventoSelecionado.contato.telefone}</a></div>
                      <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href={`mailto:${eventoSelecionado.contato.email}`} className="text-conecta-blue hover:underline">{eventoSelecionado.contato.email}</a></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Clique em um evento para ver os detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioPage;