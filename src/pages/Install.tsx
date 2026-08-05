import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, Apple, Monitor, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = language === 'ar' ? [
    'إسعافات أولية سريعة',
    'بحث عن الأمراض والعلاجات',
    'أرقام الطوارئ',
    'مساعد صحي ذكي',
    'يعمل بدون إنترنت',
    'إشعارات تذكير الدواء'
  ] : [
    'Quick First Aid Tips',
    'Disease & Treatment Search',
    'Emergency Numbers',
    'Smart Health Assistant',
    'Works Offline',
    'Medication Reminders'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <AdSlot id="install-top" format="banner" />
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-medical text-white shadow-lg">
              <Smartphone className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? 'تحميل تطبيق إسعفني' : 'Download Es3efny App'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'احصل على التطبيق على جهازك للوصول السريع في أي وقت'
                : 'Get the app on your device for quick access anytime'}
            </p>
          </div>

          {isInstalled ? (
            <Card className="border-green-500/50 bg-green-50 dark:bg-green-900/20">
              <CardContent className="flex items-center justify-center gap-3 py-8">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                  {language === 'ar' ? 'التطبيق مثبت بالفعل!' : 'App already installed!'}
                </span>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {/* Android / PWA Install */}
              {(isAndroid || deferredPrompt) && (
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      {language === 'ar' ? 'تثبيت فوري' : 'Instant Install'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'ar' 
                        ? 'ثبت التطبيق مباشرة من المتصفح'
                        : 'Install the app directly from browser'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleInstall} className="w-full gap-2" size="lg">
                      <Download className="h-5 w-5" />
                      {language === 'ar' ? 'تثبيت التطبيق' : 'Install App'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* iOS Instructions */}
              {isIOS && (
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Apple className="h-5 w-5" />
                      {language === 'ar' ? 'تثبيت على iPhone' : 'Install on iPhone'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      {language === 'ar' ? (
                        <>
                          <li>اضغط على زر المشاركة (السهم للأعلى)</li>
                          <li>مرر للأسفل واختر "إضافة للشاشة الرئيسية"</li>
                          <li>اضغط "إضافة" في الزاوية العلوية</li>
                        </>
                      ) : (
                        <>
                          <li>Tap the Share button (arrow up)</li>
                          <li>Scroll down and tap "Add to Home Screen"</li>
                          <li>Tap "Add" in the top right corner</li>
                        </>
                      )}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {/* Desktop Instructions */}
              {!isIOS && !isAndroid && !deferredPrompt && (
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      {language === 'ar' ? 'تثبيت على الكمبيوتر' : 'Install on Desktop'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' 
                        ? 'في شريط العنوان، ابحث عن أيقونة التثبيت (⊕) واضغط عليها'
                        : 'In the address bar, look for the install icon (⊕) and click it'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Features List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'مميزات التطبيق' : 'App Features'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      <AdSlot id="install-bottom" format="inline" />
      </main>

      <Footer />
    </div>
  );
};

export default Install;
