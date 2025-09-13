import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, X, MapPin, Clock, Heart, School, ShoppingCart, Fuel, Star, Users, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Declaração global para Leaflet e MarkerCluster
declare global {
  interface Window {
    L: any;
  }
}

// NOVO: Define a estrutura de uma avaliação
interface Review {
  rating: number;
  review: string;
  useremail: string;
  criadoem: string;
}

const MapPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]); // NOVO: Estado para guardar as avaliações
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const allPoisRef = useRef<any[]>([]);
  
  // Efeito para carregar os scripts e CSS do mapa
  useEffect(() => {
    // ALTERAÇÃO 1: A verificação de login foi REMOVIDA daqui para tornar o mapa público.
    
    const loadLeafletAndInitialize = async () => {
      try {
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(leafletCSS);
        }
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
        if (!window.L) {
          await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
        }
        if (!window.L.markerClusterGroup) {
          await loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js');
        }
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
  }, [toast]);

  // Efeito para inicializar o mapa quando os scripts estiverem prontos
  useEffect(() => {
    if (!isLoading && window.L && window.L.markerClusterGroup) {
      initMapPage();
    }
  }, [isLoading]);
  
  // Efeito para corrigir o bug do "mapa branco"
  useLayoutEffect(() => {
    if (mapRef.current) {
      requestAnimationFrame(() => {
        mapRef.current.invalidateSize(true);
      });
    }
  }, [selectedPOI]); 

  // NOVO EFEITO: Busca as avaliações na API sempre que um local é selecionado
  useEffect(() => {
    if (selectedPOI?.id) {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`/api/avaliacoes?poiId=${selectedPOI.id}`);
          if (!response.ok) throw new Error('Falha ao buscar avaliações');
          const data = await response.json();
          setReviews(data);
        } catch (error) {
          console.error(error);
          setReviews([]);
        }
      };
      fetchReviews();
    } else {
      setReviews([]); // Limpa as avaliações quando o painel é fechado
    }
  }, [selectedPOI]);

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
    if (!window.L || !window.L.markerClusterGroup) return;
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    if (mapRef.current) mapRef.current.remove();

    const L = window.L;
    const portaoCoords: [number, number] = [-29.701944, -51.241944];
    const initialZoom = 14;
    
    const southWest = L.latLng(-29.77, -51.32); 
    const northEast = L.latLng(-29.65, -51.17); 
    const bounds = L.latLngBounds(southWest, northEast);

    const map = L.map('map', { center: portaoCoords, zoom: initialZoom, minZoom: 12, maxBounds: bounds, maxBoundsViscosity: 0.9 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

    const portaoVisibleArea = [
      [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
      [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
      [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
      [bounds.getSouthEast().lat, bounds.getSouthEast().lng],
      [bounds.getSouthWest().lat, bounds.getSouthWest().lng] 
    ];
    const worldCoverPolygon = [ [-90, -180], [90, -180], [90, 180], [-90, 180] ];
    L.polygon([worldCoverPolygon, portaoVisibleArea], { stroke: false, fillColor: '#343a40', fillOpacity: 0.9, interactive: false, pane: 'overlayPane' }).addTo(map);

    mapRef.current = map;
    markersLayerRef.current = L.markerClusterGroup();
    map.addLayer(markersLayerRef.current);
    fetchAndDrawPOIs();
  };

  const getAccessibilityInfo = (tags: any) => {
    if (!tags || typeof tags.wheelchair === 'undefined') return { status: 'unknown', text: 'Informação não disponível', score: 0 };
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
          if (["restaurant", "cafe", "fast_food", "ice_cream", "pizzeria"].includes(tags.amenity)) { type = 'food'; categoryName = 'Alimentação'; }
          else if (["pharmacy", "hospital", "clinic", "doctors"].includes(tags.amenity)) { type = 'health'; categoryName = 'Saúde'; }
          else if (["school", "college", "university", "kindergarten"].includes(tags.amenity)) { type = 'education'; categoryName = 'Educação'; }
          else if (["fuel", "post_office", "bank", "atm"].includes(tags.amenity)) { type = 'service'; categoryName = 'Serviços'; }
        }
        if (tags.shop && type === 'default') {
          if (["supermarket", "convenience", "hardware", "clothes", "paint"].includes(tags.shop)){ type = 'shop'; categoryName = 'Comércio'; }
        }

        const lat = element.center ? element.center.lat : element.lat;
        const lon = element.center ? element.center.lon : element.lon;
        if (typeof lat !== 'number' || typeof lon !== 'number') return null;
        
        const accessibilityInfo = getAccessibilityInfo(tags);
        const marker = L.marker([lat, lon], { icon: icons[type as keyof typeof icons] || icons.default });
        marker.bindTooltip(name);
        
        // ALTERAÇÃO: Passando o ID do local para o painel
        marker.on('click', () => {
          setSelectedPOI({
            id: element.id, 
            name,
            category: categoryName,
            type,
            tags,
            accessibility: accessibilityInfo,
            lat,
            lon,
          });
        });
        
        return { marker, type, name: name, lat, lon, tags, category: categoryName, accessibility: accessibilityInfo };
      }).filter(Boolean);
      
      allPoisRef.current.sort((a, b) => a.name.localeCompare(b.name));

      allPoisRef.current.forEach(poi => {
        if (poi.marker && markersLayerRef.current) {
          markersLayerRef.current.addLayer(poi.marker);
        }
      });
      toast({ title: "Mapa Carregado! 🗺️", description: `${allPoisRef.current.length} locais encontrados em Portão/RS.` });
    } catch (error) {
      console.error("Erro ao buscar ou processar dados do mapa:", error);
      toast({ title: "Erro no Mapa", description: "Não foi possível carregar os dados. Verifique sua conexão.", variant: "destructive" });
    }
  };

  // Lógica para calcular a média de estrelas e contagem de avaliações
  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : "N/A";
  const reviewCount = reviews.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-conecta-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/')} variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-conecta-blue">Conecta Portão</h1>
                <p className="text-gray-600">Mapa de Acessibilidade</p>
              </div>
            </div>
            {user && <div className="text-sm text-gray-600">Bem-vindo, <span className="font-semibold text-conecta-blue">{user.name}</span></div>}
        </div>
      </header>
      
      <main className="w-full h-screen relative">
        <div id="map" className="h-full w-full" style={{ height: 'calc(100vh - 80px)' }} />
            
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-10 border-l border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out ${selectedPOI ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedPOI && (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-conecta-blue/10 rounded-lg">{getTypeIcon(selectedPOI.type)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedPOI.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPOI.category}</p>
                  </div>
                </div>
                <Button onClick={() => setSelectedPOI(null)} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></Button>
              </div>

              {/* ALTERAÇÃO: Mostra a média e contagem de avaliações REAIS */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><Star className="h-5 w-5 mr-2 text-yellow-500" />Avaliação da Comunidade</h4>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-5 w-5 ${Number(averageRating) >= star ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />)}
                  </div>
                  <span className="text-lg font-bold text-gray-900">{averageRating}</span>
                  <span className="text-sm text-gray-600 flex items-center"><Users className="h-4 w-4 mr-1" />{reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'}</span>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Status de Acessibilidade</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full transition-all duration-300 ${selectedPOI.accessibility.status === 'yes' ? 'bg-green-500' : selectedPOI.accessibility.status === 'limited' ? 'bg-yellow-500' : selectedPOI.accessibility.status === 'no' ? 'bg-red-500' : 'bg-gray-400'}`} style={{ width: `${selectedPOI.accessibility.score * 10}%` }} />
                  </div>
                  <span className="text-sm font-medium">{selectedPOI.accessibility.score}/10</span>
                </div>
                <p className={`text-sm mt-2 font-medium ${selectedPOI.accessibility.status === 'yes' ? 'text-green-700' : selectedPOI.accessibility.status === 'limited' ? 'text-yellow-700' : selectedPOI.accessibility.status === 'no' ? 'text-red-700' : 'text-gray-700'}`}>{selectedPOI.accessibility.text}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Informações Detalhadas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Entrada Acessível</span>
                    <span className={`text-sm font-medium ${selectedPOI.accessibility.status === 'yes' ? 'text-green-600' : selectedPOI.accessibility.status === 'limited' ? 'text-yellow-600' : selectedPOI.accessibility.status === 'no' ? 'text-red-600' : 'text-gray-600'}`}>{selectedPOI.accessibility.status === 'yes' ? 'Sim' : selectedPOI.accessibility.status === 'limited' ? 'Parcial' : selectedPOI.accessibility.status === 'no' ? 'Não' : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Banheiro Adaptado</span><span className="text-sm text-gray-600">Não informado</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Estacionamento</span><span className="text-sm text-gray-600">Não informado</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Circulação Interna</span><span className="text-sm text-gray-600">Não informado</span></div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center"><MapPin className="h-4 w-4 mr-2" />Localização</h4>
                <p className="text-sm text-gray-600">Latitude: {selectedPOI.lat.toFixed(6)}<br />Longitude: {selectedPOI.lon.toFixed(6)}</p>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 flex items-center"><Clock className="h-3 w-3 mr-1" />Dados do OpenStreetMap • Atualizado continuamente</p>
              </div>
              
              {/* NOVO: Seção para mostrar os comentários */}
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-gray-900">O que as pessoas dizem ({reviewCount})</h4>
                {reviews.length > 0 ? (
                  <div className="space-y-4 max-h-48 overflow-y-auto pr-2 border-t pt-4">
                    {reviews.map((review) => (
                      <div key={review.criadoem} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-800">{review.useremail.split('@')[0]}</p>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />)}
                          </div>
                        </div>
                        {review.review && <p className="text-sm text-gray-600 italic">"{review.review}"</p>}
                        <p className="text-xs text-gray-400 mt-2 text-right">{new Date(review.criadoem).toLocaleDateString('pt-BR')}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg border">
                    <MessageSquare className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Nenhum comentário ainda. Seja o primeiro a avaliar!</p>
                  </div>
                )}
              </div>

              {/* ALTERAÇÃO: Lógica de avaliação com chamada para a API */}
              <div className="mt-6 p-4 bg-conecta-blue/5 rounded-lg border border-conecta-blue/20">
                <h5 className="font-medium text-conecta-blue mb-3">Deixe sua avaliação</h5>
                {user ? (
                  <>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Sua nota:</p>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-6 w-6 cursor-pointer transition-colors ${star <= userRating ? 'text-yellow-500 fill-current' : 'text-gray-300 hover:text-yellow-400'}`} onClick={() => setUserRating(star)} />)}
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Comentário (opcional):</p>
                      <Textarea placeholder="Descreva sua experiência..." value={userReview} onChange={(e) => setUserReview(e.target.value)} className="min-h-[80px] text-sm" />
                    </div>
                    <Button 
                      variant="outline" size="sm" className="w-full border-conecta-blue text-conecta-blue hover:bg-conecta-blue hover:text-white" disabled={userRating === 0}
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/avaliar', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ poiId: selectedPOI.id, poiName: selectedPOI.name, userEmail: user.email, rating: userRating, review: userReview }),
                          });
                          const result = await response.json();
                          if (!response.ok) throw new Error(result.error || 'Falha ao salvar avaliação.');
                          toast({ title: "Avaliação Enviada! ⭐", description: "Obrigado por contribuir!" });
                          // Atualiza a lista de reviews na tela instantaneamente
                          setReviews(prev => [{ rating: userRating, review: userReview, useremail: user.email, criadoem: new Date().toISOString() }, ...prev]);
                          setUserRating(0);
                          setUserReview('');
                        } catch (error: any) {
                          toast({ title: "Erro", description: error.message, variant: "destructive" });
                        }
                      }}
                    >
                      Enviar Avaliação {userRating > 0 && `(${userRating} estrelas)`}
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Você precisa estar logado para avaliar este local.</p>
                    <Button onClick={() => navigate('/')} className="w-full bg-conecta-blue hover:bg-conecta-blue/90">Fazer Login ou Criar Conta</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
          .leaflet-pane, .leaflet-top, .leaflet-bottom { z-index: 1 !important; }
          .leaflet-tooltip { z-index: 2 !important; }
          .accessibility-status { padding: 2px 6px; border-radius: 3px; font-size: 12px; }
          .accessibility-status.yes { background-color: #d4edda; color: #155724; }
          .accessibility-status.limited { background-color: #fff3cd; color: #856404; }
          .accessibility-status.no { background-color: #f8d7da; color: #721c24; }
          .accessibility-status.unknown { background-color: #e2e3e5; color: #383d41; }
          .popup-category { color: #666; font-style: italic; }
          .popup-accessibility { margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; }
      `}} />
    </div>
  );
};

export default MapPage;