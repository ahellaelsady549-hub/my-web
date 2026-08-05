import { Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { language } = useLanguage();

  const whatsappNumber = '2001129211431';
  const phoneNumber = '+201129211431';
  const address = language === 'ar' 
    ? 'اسوان طريق السادات - عمارات التامين الاهليه - بجوار الاستاد'
    : 'Aswan, Al-Sadat Road - Al-Tamin Al-Ahli Buildings - Next to the Stadium';

  return (
    <footer className="bg-gradient-medical text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold mb-4">
              {language === 'ar' ? 'إسعفني' : 'Es3efny'}
            </h3>
            <p className="text-white/90 text-sm">
              {language === 'ar' 
                ? 'رفيقك الصحي لحياة أفضل' 
                : 'Your health companion for a better life'}
            </p>
          </div>

          <div className="text-center">
            <h4 className="font-semibold mb-4">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h4>
            <div className="space-y-3">
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">WhatsApp: {phoneNumber}</span>
              </a>
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">{language === 'ar' ? 'هاتف:' : 'Phone:'} {phoneNumber}</span>
              </a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">{language === 'ar' ? 'العنوان' : 'Address'}</h4>
            <div className="flex items-start justify-center md:justify-start gap-2">
              <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-white/90 text-sm">{address}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-white/90 text-sm">
            © 2026 {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'} - Mohamed Abdalaziz
          </p>
        </div>
      </div>
    </footer>
  );
};
