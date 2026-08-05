import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Activity, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

const openMapsSearch = (query: string) => {
  toast.info('جاري تحديد موقعك...');
  const open = (coords?: { lat: number; lng: number }) => {
    const url = coords
      ? `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},14z`
      : `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!('geolocation' in navigator)) {
    open();
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      open({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      toast.success('تم فتح الخريطة');
    },
    () => {
      toast.error('تعذر تحديد موقعك، سيتم البحث بدون الموقع الحالي');
      open();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
  );
};

const facilities = [
  { label: 'أقرب مركز علاج طبيعي', query: 'physiotherapy center near me' },
  { label: 'أخصائي علاج طبيعي', query: 'physiotherapist near me' },
  { label: 'مركز تأهيل إصابات الملاعب', query: 'sports injury rehabilitation center near me' },
  { label: 'علاج طبيعي للأطفال', query: 'pediatric physiotherapy near me' },
  { label: 'علاج طبيعي منزلي', query: 'home physiotherapy service near me' },
  { label: 'عيادات عظام', query: 'orthopedic clinic near me' },
];

const conditions = [
  {
    id: 'back',
    title: 'آلام أسفل الظهر والانزلاق الغضروفي',
    body: 'الراحة النسبية (لا راحة تامة طويلة)، تمارين تقوية عضلات الجذع والبطن، تصحيح الجلوس، كمادات دافئة، وتجنب رفع الأوزان بظهر منحني. العلاج الطبيعي يشمل تمارين الإطالة والتقوية والعلاج اليدوي والكهربائي.',
  },
  {
    id: 'neck',
    title: 'آلام الرقبة والوضعية الخاطئة',
    body: 'اضبط ارتفاع الشاشة على مستوى العين، خذ راحة كل 30 دقيقة، تمارين إطالة الرقبة والكتف، ووسادة بارتفاع مناسب. جلسات العلاج الطبيعي تخفف التشنج العضلي وتحسن مدى الحركة.',
  },
  {
    id: 'knee',
    title: 'إصابات الرباط الصليبي والغضروف الهلالي',
    body: 'بروتوكول أولي: راحة، ثلج، ضغط، ورفع الساق. بعد ذلك تأهيل تدريجي لعضلات الفخذ الأمامية والخلفية وتحسين التوازن قبل العودة للرياضة، تحت إشراف أخصائي.',
  },
  {
    id: 'shoulder',
    title: 'التهاب أوتار الكتف والكتف المتجمد',
    body: 'تمارين مدى الحركة اليومية (تسلق الحائط، تمرين البندول)، تجنب الحركات فوق الرأس المؤلمة، مع علاج طبيعي بالموجات فوق الصوتية والعلاج اليدوي.',
  },
  {
    id: 'stroke',
    title: 'التأهيل بعد الجلطة الدماغية',
    body: 'يبدأ التأهيل مبكرًا: تمارين توازن ومشي، تدريب اليد على المهارات الدقيقة، وعلاج تخاطب عند الحاجة. الاستمرارية اليومية هي أهم عامل للتحسن.',
  },
  {
    id: 'post-op',
    title: 'التأهيل بعد الجراحات والكسور',
    body: 'يبدأ بتحريك المفاصل المجاورة ومنع التيبس، ثم تقوية تدريجية بأوزان خفيفة، مع تدرج في تحميل الوزن حسب تعليمات الطبيب الجراح.',
  },
];

export const Physiotherapy = () => {
  const [city, setCity] = useState('');

  return (
    <section id="physiotherapy" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">العلاج الطبيعي والتأهيل</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            إرشادات عملية لأشهر حالات العلاج الطبيعي، مع البحث عن أقرب مركز أو أخصائي علاج طبيعي حولك.
          </p>
        </div>

        <Card className="mx-auto mb-10 max-w-3xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              البحث عن أقرب مرافق علاج طبيعي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full gap-2 bg-gradient-medical"
              onClick={() => openMapsSearch('physiotherapy center near me')}
            >
              <MapPin className="h-4 w-4" />
              ابحث من موقعي الحالي
            </Button>

            <div className="flex gap-2">
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: أسوان، الجيزة، طنطا"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && city.trim()) openMapsSearch(`physiotherapy center ${city.trim()}`);
                }}
              />
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  city.trim()
                    ? openMapsSearch(`physiotherapy center ${city.trim()}`)
                    : toast.error('اكتب اسم المدينة أو الحي')
                }
              >
                <Search className="h-4 w-4" />
                بحث
              </Button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {facilities.map((f) => (
                <Button
                  key={f.query}
                  variant="secondary"
                  className="justify-start gap-2"
                  onClick={() =>
                    openMapsSearch(city.trim() ? `${f.query.replace(' near me', '')} ${city.trim()}` : f.query)
                  }
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  {f.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mx-auto max-w-3xl">
          <h3 className="mb-4 text-xl font-semibold">أشهر الحالات وخطة التأهيل</h3>
          <Accordion type="single" collapsible className="space-y-3">
            {conditions.map((c) => (
              <AccordionItem key={c.id} value={c.id} className="rounded-lg border bg-background px-6 shadow-sm">
                <AccordionTrigger className="py-4 text-start hover:no-underline">
                  <span className="font-semibold">{c.title}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">{c.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-4 text-xs text-muted-foreground">
            هذه إرشادات عامة ولا تُغني عن تقييم أخصائي علاج طبيعي أو طبيب عظام لحالتك.
          </p>
        </div>
      </div>
    </section>
  );
};
