import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck } from 'lucide-react';

const KEY = 'es3efny_terms_accepted';

const termsAr = [
  'إسعفني منصة معلومات صحية تعليمية فقط، ولا تُغني عن استشارة الطبيب أو التشخيص الطبي أو العلاج.',
  'في حالات الطوارئ اتصل فوراً بالإسعاف 123 أو الشرطة 122 أو الإطفاء 180.',
  'المحتوى والتقديرات الغذائية والتدريبية إرشادية، والمسؤولية عن أي قرار صحي تقع على المستخدم.',
  'أنت مسؤول عن دقة البيانات التي تدخلها، وعن سرية بيانات حسابك وكلمة المرور.',
  'يُمنع نشر محتوى مسيء أو مخالف للقانون في المجتمع، وقد يُحذف الحساب في حالة المخالفة.',
  'يتم تخزين بياناتك الصحية بشكل خاص ولا يمكن لأي مستخدم آخر الوصول إليها، ويمكنك حذف حسابك وبياناتك نهائياً من صفحة إعداداتي في أي وقت.',
];

const termsEn = [
  'Es3efny is an educational health information platform only and is not a substitute for medical consultation, diagnosis or treatment.',
  'In an emergency, call the ambulance on 123, police 122 or fire department 180 immediately.',
  'Content and nutrition/training figures are guidance only; you remain responsible for any health decision.',
  'You are responsible for the accuracy of the data you enter and for keeping your account credentials confidential.',
  'Offensive or unlawful content is prohibited in the community and may result in account removal.',
  'Your health data is stored privately and no other user can access it. You can permanently delete your account and data from the settings page at any time.',
];

/** Blocks the app until the user accepts the terms & conditions. */
export const TermsGate = () => {
  const { t, language } = useLanguage();
  const [accepted, setAccepted] = useState(true);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    setAccepted(localStorage.getItem(KEY) === 'true');
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, 'true');
    setDeclined(false);
    setAccepted(true);
  };

  if (accepted) return null;

  const list = language === 'ar' ? termsAr : termsEn;

  if (declined) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-6 animate-in fade-in duration-300">
        <div className="max-w-md space-y-4 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
          <p className="text-lg font-medium">{t('terms.declined')}</p>
          <Button onClick={() => setDeclined(false)}>{t('terms.reconsider')}</Button>
        </div>
      </div>
    );
  }

  return (
    <Dialog open>
      <DialogContent
        className="max-w-lg animate-in fade-in zoom-in-95 duration-300 [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {t('terms.title')}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar'
              ? 'يرجى قراءة الشروط والموافقة عليها لاستخدام الموقع.'
              : 'Please read and accept the terms to use the site.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[45vh] pe-3">
          <ol className="space-y-3 text-sm leading-relaxed">
            {list.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold text-primary">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </ScrollArea>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => setDeclined(true)}>{t('terms.decline')}</Button>
          <Button onClick={accept}>{t('terms.accept')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
