import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Clock } from 'lucide-react';
import { articles } from '@/data/articles';
import { useLanguage } from '@/contexts/LanguageContext';

const TITLE = 'مقالات صحية موثوقة | إسعافات أولية وتغذية وتدريب - إسعفني';
const DESCRIPTION =
  'مقالات صحية مبسطة: الإسعافات الأولية، حساب السعرات والبروتين، مقارنة جداول التمارين، والصحة النفسية — بمحتوى عملي مناسب لمصر.';

const setMeta = (selector: string, attr: string, value: string, create: () => HTMLMetaElement | HTMLLinkElement) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) { el = create(); document.head.appendChild(el); }
  el.setAttribute(attr, value);
};

const Articles = () => {
  const { t, dir } = useLanguage();

  useEffect(() => {
    document.title = TITLE;
    setMeta('meta[name="description"]', 'content', DESCRIPTION, () => {
      const m = document.createElement('meta'); m.setAttribute('name', 'description'); return m;
    });
    setMeta('link[rel="canonical"]', 'href', '/articles', () => {
      const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l;
    });

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'articles-ldjson';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: TITLE,
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://es3efny-health-helper.lovable.app/articles/${a.slug}`,
        name: a.title,
      })),
    });
    document.head.appendChild(ld);
    return () => { document.getElementById('articles-ldjson')?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <nav aria-label="breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
          <span className="mx-2">/</span>
          <span>{t('articles.title')}</span>
        </nav>

        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
            <Newspaper className="h-7 w-7 text-primary" />
            {t('articles.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">{DESCRIPTION}</p>
        </header>

        <AdSlot id="articles-top" format="banner" className="my-4 px-0" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link key={a.slug} to={`/articles/${a.slug}`} className="group">
              <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-snug group-hover:text-primary">{a.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-3 text-sm text-muted-foreground">{a.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{a.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {a.readMinutes} دقائق
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <AdSlot id="articles-bottom" format="inline" className="my-8 px-0" />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default Articles;
