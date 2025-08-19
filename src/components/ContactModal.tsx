
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    name: string;
    email: string;
  };
}

const ContactModal = ({ isOpen, onClose, contact }: ContactModalProps) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contact.email);
    toast({
      title: "E-mail copiado! 📋",
      description: "O endereço foi copiado para sua área de transferência.",
    });
  };

  const openGmail = () => {
    window.open(`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${contact.email}`, '_blank');
  };

  const openOutlook = () => {
    window.open(`https://outlook.live.com/mail/0/deeplink/compose?to=${contact.email}`, '_blank');
  };

  const openDefaultApp = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-conecta-blue/10 rounded-full">
              <Mail className="h-8 w-8 text-conecta-blue" />
            </div>
            <div>
              <div>Contatar</div>
              <div className="text-conecta-blue">{contact.name}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center bg-gray-50 p-6 rounded-xl">
            <p className="text-gray-600 text-sm mb-2">Endereço de e-mail:</p>
            <p className="text-conecta-blue font-bold text-lg">{contact.email}</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-700 font-medium text-center mb-4">Escolha como deseja entrar em contato:</p>
            
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={openGmail}
                variant="outline" 
                className="justify-start h-14 text-left hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Abrir no Gmail</div>
                    <div className="text-sm text-gray-500">Redirecionamento para o Gmail</div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
              
              <Button 
                onClick={openOutlook}
                variant="outline"
                className="justify-start h-14 text-left hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Abrir no Outlook</div>
                    <div className="text-sm text-gray-500">Redirecionamento para o Outlook</div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
              
              <Button 
                onClick={openDefaultApp}
                variant="outline"
                className="justify-start h-14 text-left hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">App Padrão do Sistema</div>
                    <div className="text-sm text-gray-500">Abrir no seu cliente de e-mail</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="justify-start h-14 text-left hover:bg-conecta-blue/10 hover:text-conecta-blue hover:border-conecta-blue transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-conecta-blue rounded-lg flex items-center justify-center">
                    <Copy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Copiar E-mail</div>
                    <div className="text-sm text-gray-500">Copiar para área de transferência</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
