import { Phone, MapPin, Smartphone, MessageCircle, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { language } = useLanguage();

  const whatsappNumber = '2001129211431';
  const phoneNumber = '+201129211431';
  const address = language === 'ar'
    ? 'اسوان طريق السادات - عمارات التامين الاهليه - بجوار الاستاد'
    : 'Aswan, Al-Sadat Road - Al-Tamin Al-Ahli Buildings - Next to the Stadium';

  return (
    <footer className="bg-gradient-medical text-white">
      <div className="container mx-auto px-4 py-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">
                {language === 'ar' ? 'إسعفني' : 'Es3efny'}
              </h3>
            </div>
            <p className="text-white/85 text-xs leading-relaxed max-w-xs">
              {language === 'ar'
                ? 'رفيقك الصحي لحياة أفضل — مساعدة طبية موثوقة في متناول يدك.'
                : 'Your health companion for a better life — trusted medical help at your fingertips.'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
              <Phone className="h-4 w-4 opacity-80" />
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/85 hover:text-white transition-colors group"
              >
                <MessageCircle className="h-4 w-4 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm">WhatsApp: {phoneNumber}</span>
              </a>
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-2.5 text-white/85 hover:text-white transition-colors group"
              >
                <Phone className="h-4 w-4 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm">{language === 'ar' ? 'هاتف:' : 'Phone:'} {phoneNumber}</span>
              </a>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
              <MapPin className="h-4 w-4 opacity-80" />
              {language === 'ar' ? 'العنوان' : 'Address'}
            </h4>
            <div className="flex items-start gap-2.5">
              <p className="text-white/85 text-sm leading-relaxed">{address}</p>
            </div>
          </div>

          {/* Download App */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
              <Smartphone className="h-4 w-4 opacity-80" />
              {language === 'ar' ? 'تحميل التطبيق' : 'Download the App'}
            </h4>
            <a
              href="https://www.webtoapp.app/app/apps/-OzLzKCLD6OSpj3ssj_3/general"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25 transition-all hover:scale-[1.03] active:scale-95"
            >
              <Smartphone className="h-4 w-4" />
              <span>{language === 'ar' ? 'أندرويد و آيفون' : 'Android & iPhone'}</span>
            </a>
          </div>
        </div>

        <div className="mt-7 pt-4 border-t border-white/15">
          <p className="text-center text-white/75 text-xs tracking-wide">
            © 2026 {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'} — Mohamed Abdalaziz
          </p>
        </div>
      </div>
    </footer>
  );
};
