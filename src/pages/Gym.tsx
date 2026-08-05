import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { BackToTop } from '@/components/BackToTop';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell, Utensils, Video, LogIn, ExternalLink, MapPin } from 'lucide-react';
import { GymPrograms } from '@/components/gym/GymPrograms';
import { GymFood } from '@/components/gym/GymFood';
import { GymVideo } from '@/components/gym/GymVideo';
import { GymNearby } from '@/components/gym/GymNearby';
import { useAuth } from '@/contexts/AuthContext';

const TITLE = 'الجيم والتغذية | جداول تمارين وتحليل الأكل بالذكاء الاصطناعي - إسعفني';
const DESCRIPTION =
  'جداول تمارين جاهزة (فُل بودي، أبر لوَر، برو سبليت، بوش بول ليج، أرنولد سبليت، PHUL، PHAT) مع تشيك تمارين اليوم، تحليل سعرات وبروتين ودهون الأكل من الصورة، واقتراح وجبات عالية البروتين وتحليل فيديو التمرين.';
const KEYWORDS =
  'جدول تمارين, ارنولد سبليت, بوش بول ليج, PHUL, PHAT, فل بودي, برو سبليت, حساب السعرات, تحليل الأكل بالصورة, بروتين, كمال أجسام, تحليل فيديو التمرين, دايت, تغذية رياضية';

const setMeta = (selector: string, attr: string, value: string, create: () => HTMLMetaElement | HTMLLinkElement) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) { el = create(); document.head.appendChild(el); }
  el.setAttribute(attr, value);
};

const externalResources = [
  { label: 'منظمة الصحة العالمية — النشاط البدني', url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity' },
  { label: 'قاعدة بيانات الأغذية USDA FoodData Central', url: 'https://fdc.nal.usda.gov/' },
  { label: 'الكلية الأمريكية للطب الرياضي (ACSM)', url: 'https://www.acsm.org/' },
  { label: 'ExRx — مكتبة التمارين', url: 'https://exrx.net/Lists/Directory' },
];

const GymPage = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = TITLE;
    setMeta('meta[name="description"]', 'content', DESCRIPTION, () => {
      const m = document.createElement('meta'); m.setAttribute('name', 'description'); return m;
    });
    setMeta('meta[name="keywords"]', 'content', KEYWORDS, () => {
      const m = document.createElement('meta'); m.setAttribute('name', 'keywords'); return m;
    });
    setMeta('meta[property="og:title"]', 'content', TITLE, () => {
      const m = document.createElement('meta'); m.setAttribute('property', 'og:title'); return m;
    });
    setMeta('meta[property="og:description"]', 'content', DESCRIPTION, () => {
      const m = document.createElement('meta'); m.setAttribute('property', 'og:description'); return m;
    });
    setMeta('link[rel="canonical"]', 'href', '/gym', () => {
      const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l;
    });

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'gym-ldjson';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'ar',
      keywords: KEYWORDS,
    });
    document.head.appendChild(ld);
    return () => { document.getElementById('gym-ldjson')?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <nav aria-label="مسار التنقل" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span>الجيم والتغذية</span>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
            الجيم والتغذية
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">{DESCRIPTION}</p>
        </header>

        <AdSlot id="gym-top" format="banner" className="my-4 px-0" />

        {!user ? (
          <Card>
            <CardContent className="py-10 text-center space-y-4">
              <Dumbbell className="mx-auto h-10 w-10 text-primary" />
              <p>سجّل الدخول للوصول لجداول التمارين وتحليل الأكل وتحليل فيديو التمرين.</p>
              <Button asChild>
                <Link to="/auth"><LogIn className="h-4 w-4 ms-2" />تسجيل الدخول</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="programs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="programs" className="gap-1"><Dumbbell className="h-4 w-4" />التمارين</TabsTrigger>
              <TabsTrigger value="food" className="gap-1"><Utensils className="h-4 w-4" />الأكل</TabsTrigger>
              <TabsTrigger value="video" className="gap-1"><Video className="h-4 w-4" />تحليل الفيديو</TabsTrigger>
              <TabsTrigger value="nearby" className="gap-1"><MapPin className="h-4 w-4" />أقرب جيم</TabsTrigger>
            </TabsList>
            <TabsContent value="programs" className="mt-6"><GymPrograms /></TabsContent>
            <TabsContent value="food" className="mt-6"><GymFood /></TabsContent>
            <TabsContent value="video" className="mt-6"><GymVideo /></TabsContent>
            <TabsContent value="nearby" className="mt-6"><GymNearby /></TabsContent>
          </Tabs>
        )}

        <AdSlot id="gym-mid" format="inline" className="my-8 px-0" />

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">مصادر ومراجع خارجية موثوقة</h2>
          <ul className="grid gap-2 md:grid-cols-2">
            {externalResources.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer external"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <AdSlot id="gym-bottom" format="banner" />
      <BackToTop />
      <Footer />
    </div>
  );
};

export default GymPage;
