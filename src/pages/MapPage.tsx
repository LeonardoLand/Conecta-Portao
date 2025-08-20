import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, X, MapPin, Clock, Heart, School, ShoppingCart, Fuel, Star, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Declaração global para Leaflet e MarkerCluster
declare global {
  interface Window {
    L: any;
  }
}

const MapPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const allPoisRef = useRef<any[]>([]);
  const currentTourPoisRef = useRef<any[]>([]);
  const currentTourIndexRef = useRef(0);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa estar logado para acessar o mapa.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    // Adicione este novo useEffect
useEffect(() => {
  // Este efeito roda toda vez que o painel abre ou fecha
  if (mapRef.current) {
    // Espera um pouco para a animação do painel terminar
    setTimeout(() => {
      mapRef.current.invalidateSize(true); // O 'true' ajuda na animação
    }, 500); // Mesmo tempo da animação (duration-500)
  }
}, [selectedPOI]); // A "mágica": Roda sempre que o estado 'selectedPOI' mudar

    // Carregar Leaflet e plugins dinamicamente
    const loadLeafletAndInitialize = async () => {
      try {
        // Carregar CSS do Leaflet
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(leafletCSS);
        }

        // Carregar CSS do MarkerCluster
        if (!document.querySelector('link[href*="MarkerCluster.css"]')) {
          const clusterCSS = document.createElement('link');
          clusterCSS.rel = 'stylesheet';
          clusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
          document.head.appendChild(clusterCSS);

          const clusterDefaultCSS = document.createElement('link');
          clusterDefaultCSS.rel = 'stylesheet';
          clusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
          document.head.appendChild(clusterDefaultCSS);
        }

        // Carregar scripts se não existirem
        if (!window.L) {
          await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
        }

        if (!window.L.markerClusterGroup) {
          await loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js');
        }

        // Inicializar o mapa após carregar tudo
        // Inicializar o mapa após carregar tudo
        setIsLoading(false);

      } catch (error) {
        console.error('Erro ao carregar Leaflet:', error);
        toast({
          title: "Erro no Mapa",
          description: "Não foi possível carregar os componentes do mapa.",
          variant: "destructive",
        });
      }
    };

    loadLeafletAndInitialize();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [user, navigate, toast]);

  useEffect(() => {
    if (!user) return;
    if (!isLoading && window.L && window.L.markerClusterGroup) {
      initMapPage();
    }
  }, [isLoading, user]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const initMapPage = () => {
    console.log('Iniciando mapa...');
    
    if (!window.L || !window.L.markerClusterGroup) {
      console.error("Leaflet ou MarkerCluster não carregados");
      return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error("Container do mapa não encontrado");
      return;
    }

    // Limpar mapa existente
    if (mapRef.current) {
      mapRef.current.remove();
    }

    const L = window.L;
    const portaoCoords = [-29.701944, -51.241944];
    const initialZoom = 14;
    
    const southWest = L.latLng(-29.77, -51.32); 
    const northEast = L.latLng(-29.65, -51.17); 
    const bounds = L.latLngBounds(southWest, northEast);

    const map = L.map('map', {
      center: portaoCoords,
      zoom: initialZoom,
      minZoom: 12,
      maxBounds: bounds,
      maxBoundsViscosity: 0.9 
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Criar máscara escura ao redor de Portão
    const portaoVisibleArea = [
      [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
      [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
      [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
      [bounds.getSouthEast().lat, bounds.getSouthEast().lng],
      [bounds.getSouthWest().lat, bounds.getSouthWest().lng] 
    ];

    const worldCoverPolygon = [ [-90, -180], [90, -180], [90, 180], [-90, 180] ];
    
    L.polygon([worldCoverPolygon, portaoVisibleArea], {
      stroke: false, 
      fillColor: '#343a40', 
      fillOpacity: 0.9,    
      interactive: false, 
      pane: 'overlayPane'
    }).addTo(map);

    mapRef.current = map;
    markersLayerRef.current = L.markerClusterGroup();
    map.addLayer(markersLayerRef.current);

    // Buscar POIs
    fetchAndDrawPOIs();
  };

  const getAccessibilityInfo = (tags: any) => {
    if (!tags || typeof tags.wheelchair === 'undefined') {
      return { status: 'unknown', text: 'Informação não disponível', score: 0 };
    }
    switch (tags.wheelchair) {
      case 'yes': return { status: 'yes', text: 'Totalmente Acessível', score: 10 };
      case 'limited': return { status: 'limited', text: 'Acesso Limitado', score: 6 };
      case 'no': return { status: 'no', text: 'Não Acessível', score: 2 };
      default: return { status: 'unknown', text: `Informação: ${tags.wheelchair}`, score: 0 };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food': return <Heart className="h-5 w-5" />;
      case 'health': return <Heart className="h-5 w-5 text-red-500" />;
      case 'education': return <School className="h-5 w-5 text-blue-500" />;
      case 'shop': return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case 'service': return <Fuel className="h-5 w-5 text-purple-500" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const fetchAndDrawPOIs = async () => {
    const L = window.L;
    const query = `[out:json][timeout:25]; area[name="Portão"][admin_level="8"]->.a; ( node["amenity"~"restaurant|cafe|pizzeria|fast_food|ice_cream"](area.a); way["amenity"~"restaurant|cafe|pizzeria|fast_food|ice_cream"](area.a); node["amenity"~"pharmacy|hospital|clinic|doctors"](area.a); way["amenity"~"pharmacy|hospital|clinic|doctors"](area.a); node["amenity"~"school|college|university|kindergarten"](area.a); way["amenity"~"school|college|university|kindergarten"](area.a); node["shop"~"supermarket|convenience|hardware|clothes|paint"](area.a); way["shop"~"supermarket|convenience|hardware|clothes|paint"](area.a); node["amenity"~"fuel|post_office|bank|atm"](area.a); way["amenity"~"fuel|post_office|bank|atm"](area.a); ); out center;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro na API Overpass: ${response.statusText} (Status: ${response.status})`);
      const data = await response.json();
      
      const icons = {
        food: L.icon({ iconUrl: 'https://img.icons8.com/plasticine/100/restaurant.png', iconSize: [60, 60], iconAnchor: [30, 60], popupAnchor: [0, -60] }),
        health: L.icon({ iconUrl: 'https://img.icons8.com/plasticine/100/medical-heart.png', iconSize: [60, 60], iconAnchor: [30, 60], popupAnchor: [0, -60] }),
        education: L.icon({ iconUrl: 'https://img.icons8.com/plasticine/100/school.png', iconSize: [60, 60], iconAnchor: [30, 60], popupAnchor: [0, -60] }),
        shop: L.icon({ iconUrl: 'https://img.icons8.com/plasticine/100/shopping-cart.png', iconSize: [60, 60], iconAnchor: [30, 60], popupAnchor: [0, -60] }),
        service: L.icon({ iconUrl: 'https://img.icons8.com/plasticine/100/services.png', iconSize: [60, 60], iconAnchor: [30, 60], popupAnchor: [0, -60] }),
        default: L.icon({ iconUrl: 'https://img.icons8.com/plasticine/100/marker.png', iconSize: [60, 60], iconAnchor: [30, 60], popupAnchor: [0, -60] })
      };

      allPoisRef.current = data.elements.map((element: any) => {
        const tags = element.tags;
        if (!tags) return null;
        const name = tags.name || "Nome não disponível";
        let type = 'default';
        let categoryName = 'Local';

        if (tags.amenity) {
          if (["restaurant", "cafe", "fast_food", "ice_cream", "pizzeria"].includes(tags.amenity)) { 
            type = 'food'; 
            categoryName = 'Alimentação'; 
          } else if (["pharmacy", "hospital", "clinic", "doctors"].includes(tags.amenity)) { 
            type = 'health'; 
            categoryName = 'Saúde'; 
          } else if (["school", "college", "university", "kindergarten"].includes(tags.amenity)) { 
            type = 'education'; 
            categoryName = 'Educação'; 
          } else if (["fuel", "post_office", "bank", "atm"].includes(tags.amenity)) { 
            type = 'service'; 
            categoryName = 'Serviços'; 
          }
        }
        if (tags.shop && type === 'default') {
          if (["supermarket", "convenience", "hardware", "clothes", "paint"].includes(tags.shop)){ 
            type = 'shop'; 
            categoryName = 'Comércio'; 
          }
        }

        const lat = element.center ? element.center.lat : element.lat;
        const lon = element.center ? element.center.lon : element.lon;
        if (typeof lat !== 'number' || typeof lon !== 'number') return null;
        
        const accessibilityInfo = getAccessibilityInfo(tags);
        
        const marker = L.marker([lat, lon], { icon: icons[type as keyof typeof icons] || icons.default });
        marker.bindTooltip(name);
        
        // Simular dados de avaliação (mockup)
        const mockRating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 a 5.0
        const mockReviews = Math.floor(Math.random() * 50) + 5; // 5 a 55 avaliações
        
        // Adicionar evento de clique para abrir painel lateral
        marker.on('click', () => {
          setSelectedPOI({
            name,
            category: categoryName,
            type,
            tags,
            accessibility: accessibilityInfo,
            lat,
            lon,
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5 a 5.0
            reviewCount: Math.floor(Math.random() * 8) + 2 // 2 a 10 avaliações
          });
        });
        
        return { marker, type, name: name, lat, lon, tags, category: categoryName, accessibility: accessibilityInfo };
      }).filter(Boolean);
      
      allPoisRef.current.sort((a, b) => a.name.localeCompare(b.name));

      // Adicionar todos os marcadores
      allPoisRef.current.forEach(poi => {
        if (poi.marker && markersLayerRef.current) {
          markersLayerRef.current.addLayer(poi.marker);
        }
      });

      toast({
        title: "Mapa Carregado! 🗺️",
        description: `${allPoisRef.current.length} locais encontrados em Portão/RS.`,
      });

    } catch (error) {
      console.error("Erro ao buscar ou processar dados do mapa:", error);
      toast({
        title: "Erro no Mapa",
        description: "Não foi possível carregar os dados. Verifique sua conexão.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

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
                <p className="text-gray-600">Mapa de Acessibilidade</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Bem-vindo, <span className="font-semibold text-conecta-blue">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full h-screen relative flex">
        {isLoading ? (
          <div className="flex items-center justify-center h-full bg-gray-100 w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-conecta-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando mapa...</p>
            </div>
          </div>
        ) : (
          <>
            <div 
              id="map" 
              className={`h-full transition-all duration-500 ${selectedPOI ? 'w-2/3' : 'w-full'}`}
              style={{ height: 'calc(100vh - 80px)' }}
            />
            
            {/* Painel lateral de acessibilidade */}
            {selectedPOI && (
              <div className="w-1/3 bg-white shadow-2xl border-l border-gray-200 h-full overflow-y-auto">
                <div className="p-6">
                  {/* Header do painel */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-conecta-blue/10 rounded-lg">
                        {getTypeIcon(selectedPOI.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedPOI.name}</h3>
                        <p className="text-sm text-gray-600">{selectedPOI.category}</p>
                      </div>
                    </div>
                     <Button
                      // CÓDIGO SIMPLIFICADO E CORRETO
                      onClick={() => setSelectedPOI(null)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Avaliação dos Usuários */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-500" />
                      Avaliação da Comunidade
                    </h4>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.floor(selectedPOI.rating)
                                ? 'text-yellow-500 fill-current'
                                : selectedPOI.rating >= star - 0.5
                                ? 'text-yellow-500 fill-current opacity-50'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-bold text-gray-900">{selectedPOI.rating}</span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedPOI.reviewCount} avaliações
                      </span>
                    </div>
                  </div>

                  {/* Score de Acessibilidade */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Status de Acessibilidade</h4>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            selectedPOI.accessibility.status === 'yes' ? 'bg-green-500' :
                            selectedPOI.accessibility.status === 'limited' ? 'bg-yellow-500' :
                            selectedPOI.accessibility.status === 'no' ? 'bg-red-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${selectedPOI.accessibility.score * 10}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{selectedPOI.accessibility.score}/10</span>
                    </div>
                    <p className={`text-sm mt-2 font-medium ${
                      selectedPOI.accessibility.status === 'yes' ? 'text-green-700' :
                      selectedPOI.accessibility.status === 'limited' ? 'text-yellow-700' :
                      selectedPOI.accessibility.status === 'no' ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      {selectedPOI.accessibility.text}
                    </p>
                  </div>

                  {/* Detalhes de Acessibilidade */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Informações Detalhadas</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Entrada Acessível</span>
                        <span className={`text-sm font-medium ${
                          selectedPOI.accessibility.status === 'yes' ? 'text-green-600' :
                          selectedPOI.accessibility.status === 'limited' ? 'text-yellow-600' :
                          selectedPOI.accessibility.status === 'no' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {selectedPOI.accessibility.status === 'yes' ? 'Sim' :
                           selectedPOI.accessibility.status === 'limited' ? 'Parcial' :
                           selectedPOI.accessibility.status === 'no' ? 'Não' : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Banheiro Adaptado</span>
                        <span className="text-sm text-gray-600">Não informado</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Estacionamento</span>
                        <span className="text-sm text-gray-600">Não informado</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Circulação Interna</span>
                        <span className="text-sm text-gray-600">Não informado</span>
                      </div>
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Localização
                    </h4>
                    <p className="text-sm text-gray-600">
                      Latitude: {selectedPOI.lat.toFixed(6)}<br />
                      Longitude: {selectedPOI.lon.toFixed(6)}
                    </p>
                  </div>

                  {/* Última atualização */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Dados do OpenStreetMap • Atualizado continuamente
                    </p>
                  </div>

                  {/* Seção de Nova Avaliação */}
                  <div className="mt-6 p-4 bg-conecta-blue/5 rounded-lg border border-conecta-blue/20">
                    <h5 className="font-medium text-conecta-blue mb-3">Avaliar este local</h5>
                    
                    {/* Estrelas para avaliação */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Sua avaliação:</p>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              star <= userRating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                            onClick={() => setUserRating(star)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Comentário */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Comentário (opcional):</p>
                      <Textarea
                        placeholder="Descreva sua experiência com a acessibilidade deste local..."
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        className="min-h-[80px] text-sm"
                      />
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-conecta-blue text-conecta-blue hover:bg-conecta-blue hover:text-white"
                      disabled={userRating === 0}
                      onClick={() => {
                        toast({
                          title: "Avaliação Enviada! ⭐",
                          description: "Obrigado por contribuir com nossa comunidade.",
                        });
                        setUserRating(0);
                        setUserReview('');
                      }}
                    >
                      Enviar Avaliação {userRating > 0 && `(${userRating} estrelas)`}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          .accessibility-status {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
          }
          .accessibility-status.yes {
            background-color: #d4edda;
            color: #155724;
          }
          .accessibility-status.limited {
            background-color: #fff3cd;
            color: #856404;
          }
          .accessibility-status.no {
            background-color: #f8d7da;
            color: #721c24;
          }
          .accessibility-status.unknown {
            background-color: #e2e3e5;
            color: #383d41;
          }
          .popup-category {
            color: #666;
            font-style: italic;
          }
          .popup-accessibility {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #eee;
          }
        `
      }} />
    </div>
  );
};

export default MapPage;