import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dumbbell, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
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

const quickSearches = [
  { label: 'أقرب صالة رياضية (جيم)', query: 'gym near me' },
  { label: 'جيم للسيدات', query: 'ladies gym near me' },
  { label: 'جيم 24 ساعة', query: '24 hour gym near me' },
  { label: 'مركز كروس فيت', query: 'crossfit box near me' },
  { label: 'حمام سباحة', query: 'swimming pool near me' },
  { label: 'ملاعب رياضية', query: 'sports club near me' },
];

export const GymNearby = () => {
  const [city, setCity] = useState('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Dumbbell className="h-5 w-5 text-primary" />
            البحث عن أقرب صالة رياضية
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            اسمح بالوصول لموقعك ليتم البحث عن أقرب جيم حولك على خرائط جوجل، أو اكتب اسم المدينة أو الحي للبحث فيه.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full gap-2 bg-gradient-medical" onClick={() => openMapsSearch('gym near me')}>
            <MapPin className="h-4 w-4" />
            ابحث عن أقرب جيم من موقعي
          </Button>

          <div className="flex gap-2">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="مثال: أسوان، مدينة نصر، الإسكندرية"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && city.trim()) openMapsSearch(`gym ${city.trim()}`);
              }}
            />
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => (city.trim() ? openMapsSearch(`gym ${city.trim()}`) : toast.error('اكتب اسم المدينة أو الحي'))}
            >
              <Search className="h-4 w-4" />
              بحث
            </Button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {quickSearches.map((q) => (
              <Button
                key={q.query}
                variant="secondary"
                className="justify-start gap-2"
                onClick={() => openMapsSearch(city.trim() ? `${q.query.replace(' near me', '')} ${city.trim()}` : q.query)}
              >
                <MapPin className="h-4 w-4 text-primary" />
                {q.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">نصائح قبل اختيار الجيم</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>اسأل عن وجود مدرب معتمد ومتابعة للأداء والإصابات.</li>
            <li>تأكد من نظافة الأجهزة والتهوية ووجود صيانة دورية.</li>
            <li>اختر جيم قريب من البيت أو العمل لتلتزم بالمواعيد.</li>
            <li>راجع المواعيد المزدحمة وتوفر أجهزة الكارديو والأوزان الحرة.</li>
            <li>لو عندك مشكلة في المفاصل أو الظهر، استشر أخصائي علاج طبيعي قبل البدء.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
