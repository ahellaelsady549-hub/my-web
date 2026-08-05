import { MapPin, Building2, Cross, Stethoscope, Search, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const clinicSpecialties = [
  { id: 'dentist', nameAr: 'عيادات الأسنان', searchQuery: 'dentist clinic' },
  { id: 'ent', nameAr: 'عيادات الأنف والأذن والحنجرة', searchQuery: 'ENT clinic' },
  { id: 'eye', nameAr: 'عيادات العيون', searchQuery: 'eye clinic ophthalmologist' },
  { id: 'dermatology', nameAr: 'عيادات الجلدية', searchQuery: 'dermatology clinic' },
  { id: 'cardiology', nameAr: 'عيادات القلب', searchQuery: 'cardiology clinic' },
  { id: 'orthopedic', nameAr: 'عيادات العظام', searchQuery: 'orthopedic clinic' },
  { id: 'pediatric', nameAr: 'عيادات الأطفال', searchQuery: 'pediatric clinic' },
  { id: 'gynecology', nameAr: 'عيادات النساء والتوليد', searchQuery: 'gynecology clinic' },
  { id: 'neurology', nameAr: 'عيادات الأعصاب', searchQuery: 'neurology clinic' },
  { id: 'psychiatry', nameAr: 'عيادات الطب النفسي', searchQuery: 'psychiatry clinic' },
  { id: 'urology', nameAr: 'عيادات المسالك البولية', searchQuery: 'urology clinic' },
  { id: 'gastro', nameAr: 'عيادات الجهاز الهضمي', searchQuery: 'gastroenterology clinic' },
];

const locations = [
  { 
    name: 'location.hospitals', 
    icon: Cross, 
    searchQuery: 'hospitals near me',
    color: 'primary' 
  },
  { 
    name: 'location.pharmacies', 
    icon: Building2, 
    searchQuery: 'pharmacies near me',
    color: 'secondary' 
  },
  { 
    name: 'location.healthCenters', 
    icon: MapPin, 
    searchQuery: 'health centers near me',
    color: 'primary' 
  },
  { 
    name: 'location.mentalHealthCenters', 
    icon: Building2, 
    searchQuery: 'mental health clinics near me',
    color: 'primary' 
  },
];

const faqs = [
  {
    id: 'q1',
    questionAr: 'ما هي أهمية موقع إسعفني للمجتمع؟',
    questionEn: 'What is the importance of Es3efny website for the community?',
    answerAr: 'موقع إسعفني يوفر معلومات طبية موثوقة ونصائح إسعافات أولية للمجتمع، مما يساعد الأفراد على اتخاذ قرارات صحية سليمة وسريعة في حالات الطوارئ.',
    answerEn: 'Es3efny website provides reliable medical information and first aid tips to the community, helping individuals make sound and quick health decisions in emergency situations.'
  },
  {
    id: 'q2',
    questionAr: 'كيف يساعد الموقع في حالات الطوارئ؟',
    questionEn: 'How does the website help in emergency situations?',
    answerAr: 'يوفر الموقع أرقام الطوارئ المهمة في مصر، نصائح إسعافات أولية مفصلة، وخاصية البحث عن أقرب مستشفى أو صيدلية باستخدام خرائط جوجل.',
    answerEn: 'The website provides important emergency numbers in Egypt, detailed first aid tips, and a feature to search for the nearest hospital or pharmacy using Google Maps.'
  },
  {
    id: 'q3',
    questionAr: 'هل المعلومات الطبية الموجودة على الموقع موثوقة؟',
    questionEn: 'Is the medical information on the website reliable?',
    answerAr: 'نعم، جميع المعلومات مبنية على مصادر طبية موثوقة ومراجعة من قبل متخصصين، ولكن ننصح دائماً باستشارة طبيب مختص للحالات الخطيرة.',
    answerEn: 'Yes, all information is based on reliable medical sources and reviewed by specialists, but we always recommend consulting a doctor for serious cases.'
  },
  {
    id: 'q4',
    questionAr: 'كيف يفيد النظام الغذائي المخصص المستخدمين؟',
    questionEn: 'How does the personalized diet plan benefit users?',
    answerAr: 'النظام الغذائي المخصص يحسب أفضل نظام غذائي بناءً على الطول والوزن والعمر، مما يساعد المستخدمين على تحسين صحتهم وتحقيق أهدافهم الصحية.',
    answerEn: 'The personalized diet plan calculates the best diet based on height, weight, and age, helping users improve their health and achieve their health goals.'
  },
  {
    id: 'q5',
    questionAr: 'ما الذي يميز موقع إسعفني عن غيره من المواقع الطبية؟',
    questionEn: 'What distinguishes Es3efny from other medical websites?',
    answerAr: 'الموقع يدعم اللغة العربية والإنجليزية، متخصص في السوق المصري، يوفر معلومات عن أسعار الأدوية المحلية، ويحتوي على بوت مساعد لشرح خصائص الموقع.',
    answerEn: 'The website supports Arabic and English, specializes in the Egyptian market, provides information on local medication prices, and includes a guide bot to explain website features.'
  }
];

export const LocationSearch = () => {
  const { t, language } = useLanguage();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');

  const handleLocationSearch = (searchQuery: string) => {
    toast.info(language === 'ar' ? 'جاري تحديد موقعك...' : 'Getting your location...');
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${latitude},${longitude},15z`;
          window.open(mapsUrl, '_blank');
          toast.success(language === 'ar' ? 'تم فتح الخريطة' : 'Map opened');
        },
        (error) => {
          console.error('Location error:', error);
          toast.error(
            language === 'ar' 
              ? 'تعذر الوصول إلى موقعك. سيتم البحث بدون موقعك الحالي.'
              : 'Unable to access your location. Searching without your current location.'
          );
          const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
          window.open(mapsUrl, '_blank');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const handleClinicSearch = () => {
    if (!selectedSpecialty) {
      toast.error(language === 'ar' ? 'يرجى اختيار التخصص أولاً' : 'Please select a specialty first');
      return;
    }

    const specialty = clinicSpecialties.find(s => s.id === selectedSpecialty);
    if (specialty) {
      handleLocationSearch(specialty.searchQuery + ' near me');
    }
  };

  return (
    <section id="location" className="py-16 md:py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          البحث عن أقرب المرافق الصحية
        </h2>

        {/* Clinic Search by Specialty */}
        <Card className="p-6 mb-12 max-w-xl mx-auto shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">البحث عن عيادة بالتخصص</h3>
          </div>
          <div className="flex gap-2">
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="اختر التخصص" />
              </SelectTrigger>
              <SelectContent>
                {clinicSpecialties.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleClinicSearch} className="gap-2 bg-gradient-medical">
              <Search className="h-4 w-4" />
              بحث
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {locations.map((location) => {
            const Icon = location.icon;
            const isSecondary = location.color === 'secondary';
            
            return (
              <Card
                key={location.searchQuery}
                className="p-6 text-center shadow-card hover:shadow-soft transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isSecondary ? 'bg-secondary/10' : 'bg-primary/10'
                }`}>
                  <Icon className={`h-8 w-8 ${isSecondary ? 'text-secondary' : 'text-primary'}`} />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  {t(location.name)}
                </h3>
                <Button
                  onClick={() => handleLocationSearch(location.searchQuery)}
                  className={`w-full ${
                    isSecondary 
                      ? 'bg-gradient-wellness hover:opacity-90' 
                      : 'bg-gradient-medical hover:opacity-90'
                  }`}
                >
                  {t('location.findNow')}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section integrated here */}
        <div className="mt-16 pt-16 border-t border-border">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'إجابات على أهم الأسئلة حول الموقع'
                : 'Answers to key questions about the website'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="bg-background rounded-lg border shadow-sm px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold">
                      {language === 'ar' ? faq.questionAr : faq.questionEn}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {language === 'ar' ? faq.answerAr : faq.answerEn}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};
