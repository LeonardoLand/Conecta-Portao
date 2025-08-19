
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ContactModal from './ContactModal';
import { Mail, MessageSquare, Heart } from 'lucide-react';

const ContactSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<{name: string, email: string} | null>(null);

  const contacts = [
    { 
      name: 'Leonardo Land', 
      email: 'leonardoramalholand@gmail.com',
      role: 'Desenvolvedor & Pesquisador',
      description: 'Especialista em desenvolvimento web e acessibilidade digital'
    },
    { 
      name: 'Gabriel Henry', 
      email: 'gabriel.henry@example.com',
      role: 'Designer & Analista',
      description: 'Focado em UX/UI e experiência do usuário inclusiva'
    }
  ];

  const openContactModal = (contact: {name: string, email: string}) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  return (
    <section id="contato" className="py-24 bg-gradient-to-br from-conecta-blue to-conecta-blue/90 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-overlay filter blur-xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-up">
            Vamos Conversar?
          </h2>
          <div className="w-24 h-1 bg-white mx-auto rounded-full animate-slide-up" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 space-y-6 animate-slide-in-left">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
                <h3 className="text-2xl font-bold text-white">Fale Conosco</h3>
              </div>
              <p className="text-blue-100 leading-relaxed text-lg mb-6">
                Tem alguma sugestão, dúvida ou quer saber mais sobre nosso projeto de inclusão digital?
              </p>
              
              <div className="flex items-center space-x-3 text-blue-100 mb-3">
                <Heart className="h-5 w-5 text-pink-300" />
                <span>Sempre prontos para ajudar</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <Mail className="h-5 w-5 text-yellow-300" />
                <span>Resposta rápida garantida</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6 animate-slide-in-right">
            {contacts.map((contact, index) => (
              <div 
                key={contact.name} 
                className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:bg-white transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{contact.name}</h3>
                    <p className="text-conecta-blue font-semibold mb-2">{contact.role}</p>
                    <p className="text-gray-600 leading-relaxed">{contact.description}</p>
                  </div>
                  <Button 
                    onClick={() => openContactModal(contact)}
                    className="bg-conecta-blue hover:bg-conecta-blue/90 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Contatar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 inline-block">
            <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
              <strong className="text-white">Nosso objetivo</strong> é tornar Portão mais acessível e justa para todos. 
              Se você deseja contribuir com ideias, relatar necessidades de acessibilidade, ou conversar sobre o projeto, 
              <strong className="text-white"> estamos à disposição!</strong>
            </p>
          </div>
        </div>
      </div>

      {selectedContact && (
        <ContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contact={selectedContact}
        />
      )}
    </section>
  );
};

export default ContactSection;
