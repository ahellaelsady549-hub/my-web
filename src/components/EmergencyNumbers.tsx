import { Phone, AlertCircle, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const emergencyContacts = [
  { name: 'emergency.police', number: '122', icon: AlertCircle, color: 'emergency' },
  { name: 'emergency.ambulance', number: '123', icon: Phone, color: 'primary' },
  { name: 'emergency.fire', number: '180', icon: Flame, color: 'emergency' },
];

export const EmergencyNumbers = () => {
  const { t } = useLanguage();

  return (
    <section id="emergency" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('emergency.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;
            const isEmergency = contact.color === 'emergency';
            
            return (
              <Card
                key={contact.number}
                className={`p-8 text-center ${isEmergency ? 'shadow-emergency border-emergency/20' : 'shadow-soft'} hover:scale-105 transition-transform`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isEmergency ? 'bg-emergency/10' : 'bg-primary/10'
                }`}>
                  <Icon className={`h-8 w-8 ${isEmergency ? 'text-emergency' : 'text-primary'}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t(contact.name)}
                </h3>
                <a
                  href={`tel:${contact.number}`}
                  className={`text-3xl font-bold ${
                    isEmergency ? 'text-emergency' : 'text-primary'
                  } hover:underline`}
                >
                  {contact.number}
                </a>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
