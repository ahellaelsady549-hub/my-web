import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Mail, KeyRound, LogOut, Trash2, Loader2, Moon, Sun, Languages, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-background" dir={dir}>
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <p className="mb-4">{language === 'ar' ? 'سجّل الدخول للوصول لإعداداتك.' : 'Sign in to access your settings.'}</p>
          <Button onClick={() => navigate('/auth')}>{t('nav.login')}</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const changeEmail = async () => {
    if (!email.includes('@')) { toast.error(language === 'ar' ? 'بريد غير صالح' : 'Invalid email'); return; }
    setBusy('email');
    const { error } = await supabase.auth.updateUser({ email });
    setBusy(null);
    if (error) toast.error(error.message);
    else {
      toast.success(language === 'ar'
        ? 'تم إرسال رسالة تأكيد إلى بريدك الجديد.'
        : 'A confirmation message was sent to your new email.');
      setEmail('');
    }
  };

  const changePassword = async () => {
    if (password.length < 6) { toast.error(language === 'ar' ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be 6+ characters'); return; }
    if (password !== confirm) { toast.error(language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'); return; }
    setBusy('password');
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(null);
    if (error) toast.error(error.message);
    else { toast.success(t('settings.saved')); setPassword(''); setConfirm(''); }
  };

  const doSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const deleteAccount = async () => {
    setBusy('delete');
    try {
      const { data, error } = await supabase.functions.invoke('delete-account');
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      await supabase.auth.signOut();
      toast.success(language === 'ar' ? 'تم حذف حسابك نهائياً' : 'Your account was permanently deleted');
      navigate('/');
    } catch (e: any) {
      toast.error(e?.message || (language === 'ar' ? 'تعذّر حذف الحساب' : 'Could not delete the account'));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-8 animate-in fade-in duration-500">
        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
            <SettingsIcon className="h-7 w-7 text-primary" />
            {t('settings.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">{t('settings.subtitle')}</p>
        </header>

        <AdSlot id="settings-top" format="banner" className="my-4 px-0" />

        <div className="space-y-6">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-primary" />
                {t('settings.changeEmail')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t('settings.email')}: {user.email}</p>
              <div className="space-y-2">
                <Label htmlFor="new-email">{t('settings.newEmail')}</Label>
                <Input id="new-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button onClick={changeEmail} disabled={busy === 'email'}>
                {busy === 'email' && <Loader2 className="h-4 w-4 animate-spin me-2" />}
                {t('settings.changeEmail')}
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <KeyRound className="h-5 w-5 text-primary" />
                {t('settings.changePassword')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="new-pass">{t('settings.newPassword')}</Label>
                <Input id="new-pass" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-pass">{t('settings.confirmPassword')}</Label>
                <Input id="confirm-pass" type="password" dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <Button onClick={changePassword} disabled={busy === 'password'}>
                {busy === 'password' && <Loader2 className="h-4 w-4 animate-spin me-2" />}
                {t('settings.changePassword')}
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{t('settings.preferences')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={toggleTheme} className="gap-2">
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {t('theme.toggle')}
              </Button>
              <Button variant="outline" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="gap-2">
                <Languages className="h-4 w-4" />
                {language === 'ar' ? 'English 🇬🇧' : 'العربية 🇪🇬'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">{t('settings.dangerZone')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    {t('settings.logout')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir={dir}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('settings.logout')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('settings.logoutConfirm')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel>{t('settings.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={doSignOut}>{t('settings.confirm')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2" disabled={busy === 'delete'}>
                    {busy === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    {t('settings.deleteAccount')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir={dir}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">{t('settings.deleteAccount')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('settings.deleteConfirm')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel>{t('settings.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('settings.confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>

        <AdSlot id="settings-bottom" format="inline" className="my-8 px-0" />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default SettingsPage;
