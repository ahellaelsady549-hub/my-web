import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { BackToTop } from '@/components/BackToTop';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getArticle } from '@/data/articles';
import { useLanguage } from '@/contexts/LanguageContext';

const setMeta = (selector: string, attr: string, value: string, create: () => HTMLMetaElement | HTMLLinkElement) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) { el = create(); document.head.appendChild(el); }
  el.setAttribute(attr, value);
};

const ArticleDetail = () => {
  const { slug } = useParams();
  const { t, dir } = useLanguage();
  const article = slug ? getArticle(slug) : undefined;

  useEffect(() => {
    if (!article) return;
    document.title = `${article.title} - إسعفني`;
    setMeta('meta[name="description"]', 'content', article.description, () => {
      const m = document.createElement('meta'); m.setAttribute('name', 'description'); return m;
    });
    setMeta('meta[name="keywords"]', 'content', article.keywords.join(', '), () => {
      const m = document.createElement('meta'); m.setAttribute('name', 'keywords'); return m;
    });
    setMeta('link[rel="canonical"]', 'href', `/articles/${article.slug}`, () => {
      const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l;
    });

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'article-ldjson';
    ld.textContent = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        inLanguage: 'ar',
        dateModified: article.updated,
        keywords: article.keywords.join(', '),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ]);
    document.head.appendChild(ld);
    return () => { document.getElementById('article-ldjson')?.remove(); };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background" dir={dir}>
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <p className="mb-4">المقال غير موجود.</p>
          <Link to="/articles" className="text-primary hover:underline">{t('articles.title')}</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-8 animate-in fade-in duration-500">
        <nav aria-label="breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
          <span className="mx-2">/</span>
          <Link to="/articles" className="hover:text-primary">{t('articles.title')}</Link>
          <span className="mx-2">/</span>
          <span>{article.category}</span>
        </nav>

        <article>
          <header className="mb-6">
            <h1 className="text-3xl font-bold leading-snug">{article.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{article.category}</Badge>
              <span className="text-xs text-muted-foreground">{article.readMinutes} دقائق قراءة</span>
              <span className="text-xs text-muted-foreground">آخر تحديث {article.updated}</span>
            </div>
            <p className="mt-4 text-muted-foreground">{article.description}</p>
          </header>

          <AdSlot id="article-top" format="banner" className="my-4 px-0" />

          <div className="space-y-8">
            {article.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="mb-2 text-xl font-semibold">{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mb-2 leading-relaxed text-foreground/90">{p}</p>
                ))}
              </section>
            ))}
          </div>

          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">أسئلة شائعة</h2>
            <Accordion type="single" collapsible>
              {article.faq.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-start">{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">مقالات ذات صلة</h2>
            <ul className="space-y-2">
              {getRelated(article.slug).map((r) => (
                <li key={r.slug}>
                  <Link to={`/articles/${r.slug}`} className="text-sm text-primary hover:underline">{r.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <AdSlot id="article-bottom" format="inline" className="my-8 px-0" />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
};

import { articles } from '@/data/articles';
const getRelated = (slug: string) => articles.filter((a) => a.slug !== slug).slice(0, 3);

export default ArticleDetail;
