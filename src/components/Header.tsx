import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Moon, Sun, Menu, User, LogIn, Stethoscope, UserRound, MessageCircle,
  Dumbbell, Settings as SettingsIcon, Home, Siren, HeartPulse, Pill,
  Lightbulb, Salad, MapPin, Newspaper, Target, Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

type Item =
  | { kind: 'section'; id: string; labelKey: string; icon: typeof Home }
  | { kind: 'route'; to: string; labelKey: string; icon: typeof Home; auth?: boolean };

const items: Item[] = [
  { kind: 'section', id: 'home', labelKey: 'nav.home', icon: Home },
  { kind: 'section', id: 'emergency', labelKey: 'nav.emergency', icon: Siren },
  { kind: 'section', id: 'first-aid', labelKey: 'nav.firstAid', icon: HeartPulse },
  { kind: 'section', id: 'treatments', labelKey: 'nav.treatments', icon: Pill },
  { kind: 'section', id: 'mental-health', labelKey: 'nav.mentalHealth', icon: UserRound },
  { kind: 'section', id: 'daily-tip', labelKey: 'nav.dailyTip', icon: Lightbulb },
  { kind: 'section', id: 'diet-plan', labelKey: 'nav.dietPlan', icon: Salad },
  { kind: 'section', id: 'physiotherapy', labelKey: 'nav.physiotherapy', icon: Activity },
  { kind: 'section', id: 'location', labelKey: 'nav.nearestHospitals', icon: MapPin },
  { kind: 'route', to: '/gym', labelKey: 'nav.gym', icon: Dumbbell },
  { kind: 'route', to: '/nutrition-goals', labelKey: 'nav.goals', icon: Target, auth: true },
  { kind: 'route', to: '/articles', labelKey: 'nav.articles', icon: Newspaper },
  { kind: 'route', to: '/find-doctor', labelKey: 'nav.findDoctor', icon: Stethoscope },
  { kind: 'route', to: '/personal-diagnosis', labelKey: 'nav.diagnose', icon: UserRound, auth: true },
  { kind: 'route', to: '/community', labelKey: 'nav.community', icon: MessageCircle, auth: true },
  { kind: 'route', to: '/dashboard', labelKey: 'nav.dashboard', icon: User, auth: true },
];

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  /** Home-page sections are reachable from every page. */
  const goSection = (id: string) => {
    setOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const visible = items.filter((i) => (i.kind === 'route' && i.auth ? Boolean(user) : true));

  const rowClass =
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-muted hover:translate-x-0.5 rtl:hover:-translate-x-0.5';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]">
            <h1 className="text-2xl font-bold bg-gradient-medical bg-clip-text text-transparent">
              {t('brand.name')}
            </h1>
          </Link>

          <div className="flex items-center gap-1.5">
            {/* Language flags */}
            <div className="flex items-center gap-1 rounded-full border border-border p-0.5" aria-label={t('lang.toggle')}>
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                aria-label="العربية"
                title="العربية"
                className={cn(
                  'rounded-full px-1.5 py-1 text-lg leading-none transition-all duration-200 hover:scale-110',
                  language === 'ar' ? 'bg-muted ring-1 ring-primary/40' : 'opacity-60',
                )}
              >
                🇪🇬
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-label="English"
                title="English"
                className={cn(
                  'rounded-full px-1.5 py-1 text-lg leading-none transition-all duration-200 hover:scale-110',
                  language === 'en' ? 'bg-muted ring-1 ring-primary/40' : 'opacity-60',
                )}
              >
                🇬🇧
              </button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={t('theme.toggle')}
              className="rounded-full transition-transform duration-200 hover:rotate-12"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/settings')}
                aria-label={t('nav.settings')}
                className="rounded-full transition-transform duration-200 hover:rotate-45"
              >
                <SettingsIcon className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="gap-1">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.login')}</span>
              </Button>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('nav.menu')} className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-[85vw] max-w-[300px] p-0">
                <SheetHeader className="border-b border-border px-4 py-4">
                  <SheetTitle className="bg-gradient-medical bg-clip-text text-transparent">
                    {t('brand.name')}
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)] px-3 py-3">
                  <nav className="flex flex-col gap-1">
                    {visible.map((item) =>
                      item.kind === 'section' ? (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => goSection(item.id)}
                          className={cn(rowClass, 'text-start')}
                        >
                          <item.icon className="h-4 w-4 shrink-0 text-primary" />
                          {t(item.labelKey)}
                        </button>
                      ) : (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={cn(rowClass, location.pathname === item.to && 'bg-muted text-primary')}
                        >
                          <item.icon className="h-4 w-4 shrink-0 text-primary" />
                          {t(item.labelKey)}
                        </Link>
                      ),
                    )}
                    {!user && (
                      <Link to="/auth" onClick={() => setOpen(false)} className={rowClass}>
                        <LogIn className="h-4 w-4 shrink-0 text-primary" />
                        {t('nav.login')}
                      </Link>
                    )}
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
