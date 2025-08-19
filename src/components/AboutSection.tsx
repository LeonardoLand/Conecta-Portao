
const AboutSection = () => {
  return (
    <section id="sobre" className="py-16 bg-gradient-to-b from-gray-50 to-white relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
            Sobre o <span className="text-conecta-blue">Projeto</span>
          </h2>
          <div className="w-24 h-1 bg-conecta-blue mx-auto rounded-full animate-slide-up" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-left">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-3 h-3 bg-conecta-blue rounded-full mr-3"></div>
                Nossa Missão
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Promover a inclusão de pessoas com deficiência física nas atividades esportivas, culturais e de lazer da cidade de Portão através de tecnologia inovadora.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-3 h-3 bg-conecta-blue rounded-full mr-3"></div>
                Como Funciona
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Nossa plataforma permite mapear e localizar espaços acessíveis, consultar eventos inclusivos e descobrir atividades adaptadas para diferentes necessidades.
              </p>
            </div>
          </div>
          
          <div className="animate-slide-in-right">
            <div className="bg-gradient-to-br from-conecta-blue to-conecta-blue/80 p-8 rounded-3xl text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Foco Atual</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></span><span>Centro da cidade mapeado com prioridade para rotas e pontos-chave de acessibilidade.</span></li>
                <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></span><span>Contribuições da comunidade para sugerir locais e relatar barreiras.</span></li>
                <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></span><span>Lançamento em breve — métricas públicas serão apresentadas após validação.</span></li>
                <li className="flex items-start"><span className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></span><span>Transparência: sem números inflados; foco na qualidade das informações.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
