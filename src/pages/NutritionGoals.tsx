import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Target, Loader2, Save, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Goals {
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  goal: string;
}

const empty: Goals = { calories: '', protein: '', carbs: '', fats: '', goal: 'maintain' };

const NutritionGoals = () => {
  const { user } = useAuth();
  const { t, dir, language } = useLanguage();
  const [goals, setGoals] = useState<Goals>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fromPlan, setFromPlan] = useState<any>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (async () => {
      const [{ data: g }, { data: plan }] = await Promise.all([
        supabase.from('gym_nutrition_goals').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_diet_plans').select('calories, protein, carbs, fats, goal, created_at')
          .eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (g) {
        setGoals({
          calories: g.calories?.toString() ?? '',
          protein: g.protein?.toString() ?? '',
          carbs: g.carbs?.toString() ?? '',
          fats: g.fats?.toString() ?? '',
          goal: g.goal ?? 'maintain',
        });
      }
      setFromPlan(plan ?? null);
      setLoading(false);
    })();
  }, [user]);

  /** Fill the form from the user's own saved diet-plan record (real stored values). */
  const useSavedPlan = () => {
    if (!fromPlan) return;
    setGoals({
      calories: fromPlan.calories?.toString() ?? '',
      protein: fromPlan.protein?.toString() ?? '',
      carbs: fromPlan.carbs?.toString() ?? '',
      fats: fromPlan.fats?.toString() ?? '',
      goal: fromPlan.goal ?? 'maintain',
    });
    toast.success(language === 'ar' ? 'تم التعبئة من نظامك الغذائي المحفوظ' : 'Filled from your saved diet plan');
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const num = (v: string) => (v.trim() === '' ? null : Number(v));
    const { error } = await supabase.from('gym_nutrition_goals').upsert({
      user_id: user.id,
      calories: num(goals.calories),
      protein: num(goals.protein),
      carbs: num(goals.carbs),
      fats: num(goals.fats),
      goal: goals.goal,
    }, { onConflict: 'user_id' });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(t('settings.saved'));
  };

  const label = (arText: string, enText: string) => (language === 'ar' ? arText : enText);

  if (!user) {
    return (
      <div className="min-h-screen bg-background" dir={dir}>
        <Header />
        <main className="container mx-auto px-4 py-16 text-center space-y-4">
          <Target className="mx-auto h-10 w-10 text-primary" />
          <p>{label('سجّل الدخول لتحديد أهدافك الغذائية.', 'Sign in to set your nutrition goals.')}</p>
          <Button asChild><Link to="/auth">{t('nav.login')}</Link></Button>
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
          <Link to="/gym" className="hover:text-primary">{t('nav.gym')}</Link>
          <span className="mx-2">/</span>
          <span>{t('goals.title')}</span>
        </nav>

        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
            <Target className="h-7 w-7 text-primary" />
            {t('goals.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {label(
              'حدّد سعراتك وبروتينك والكارب والدهون اليومية، وسيتم بناء اقتراحات الوجبات وتحليلها على أساس هذه الأهداف.',
              'Set your daily calories, protein, carbs and fats — meal suggestions and analysis will be built around these goals.',
            )}
          </p>
        </header>

        <AdSlot id="goals-top" format="banner" className="my-4 px-0" />

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{label('أهدافي اليومية', 'My daily targets')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fromPlan && (
                <Button variant="outline" onClick={useSavedPlan} className="gap-2">
                  <Wand2 className="h-4 w-4" />
                  {label('استخدم أرقام نظامي الغذائي المحفوظ', 'Use my saved diet-plan numbers')}
                </Button>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cal">{label('السعرات (كالوري/يوم)', 'Calories (kcal/day)')}</Label>
                  <Input id="cal" type="number" value={goals.calories} onChange={(e) => setGoals({ ...goals, calories: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pro">{label('البروتين (جرام/يوم)', 'Protein (g/day)')}</Label>
                  <Input id="pro" type="number" value={goals.protein} onChange={(e) => setGoals({ ...goals, protein: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carb">{label('الكارب (جرام/يوم)', 'Carbs (g/day)')}</Label>
                  <Input id="carb" type="number" value={goals.carbs} onChange={(e) => setGoals({ ...goals, carbs: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">{label('الدهون (جرام/يوم)', 'Fats (g/day)')}</Label>
                  <Input id="fat" type="number" value={goals.fats} onChange={(e) => setGoals({ ...goals, fats: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{label('الهدف', 'Goal')}</Label>
                <Select value={goals.goal} onValueChange={(v) => setGoals({ ...goals, goal: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">{label('نزول وزن', 'Lose weight')}</SelectItem>
                    <SelectItem value="maintain">{label('ثبات الوزن', 'Maintain weight')}</SelectItem>
                    <SelectItem value="gain">{label('زيادة عضل', 'Build muscle')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={save} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {t('common.save')}
              </Button>

              <p className="text-xs text-muted-foreground">
                {label(
                  'الأرقام المعروضة هنا هي التي أدخلتها أو المحفوظة في نظامك الغذائي فقط — لا يتم توليد أرقام غير مسجّلة.',
                  'The numbers shown here are only the ones you entered or saved in your diet plan — nothing is generated.',
                )}
              </p>
            </CardContent>
          </Card>
        )}

        <AdSlot id="goals-bottom" format="inline" className="my-8 px-0" />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default NutritionGoals;
