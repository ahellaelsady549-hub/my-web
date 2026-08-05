import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Stethoscope, Brain, Activity, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AskMe } from '@/components/AskMe';
import { AdSlot } from '@/components/AdSlot';

const PersonalDiagnosis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [symptomType, setSymptomType] = useState<'physical' | 'mental' | 'both'>('both');
  const [diagnosis, setDiagnosis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول للوصول إلى صفحة التشخيص الشخصي",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  const handleDiagnosis = async () => {
    if (!symptoms.trim() || symptoms.trim().length < 10) {
      toast({
        title: "خطأ",
        description: "يرجى وصف أعراضك بالتفصيل (10 أحرف على الأقل)",
        variant: "destructive",
      });
      return;
    }

    if (symptoms.length > 2000) {
      toast({
        title: "خطأ",
        description: "وصف الأعراض طويل جداً (الحد الأقصى 2000 حرف)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setDiagnosis('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: "خطأ",
          description: "يرجى تسجيل الدخول مرة أخرى",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-diagnosis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ symptoms: symptoms.trim(), symptomType }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "تم تجاوز الحد المسموح",
            description: data.error || "يرجى المحاولة لاحقاً",
            variant: "destructive",
          });
        } else if (response.status === 402) {
          toast({
            title: "خطأ في الخدمة",
            description: "يرجى المحاولة لاحقاً",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error || 'حدث خطأ أثناء التشخيص');
        }
        return;
      }

      setDiagnosis(data.diagnosis);
    } catch (error) {
      console.error('Diagnosis error:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <AdSlot id="diagnosis-top" format="banner" />
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للرئيسية
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">التشخيص الشخصي بالذكاء الاصطناعي</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            صف أعراضك بالتفصيل وسيقوم الذكاء الاصطناعي بتحليلها وتقديم تشخيص أولي مع التوصيات المناسبة
          </p>
        </div>

        <Card className="mb-6 border-2">
          <CardHeader className="bg-amber-50 dark:bg-amber-950/20 border-b">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle className="text-lg">تنبيه مهم</CardTitle>
            </div>
            <CardDescription className="text-amber-600 dark:text-amber-300">
              هذا التشخيص أولي ولا يغني عن زيارة الطبيب المتخصص. في حالات الطوارئ اتصل بالإسعاف: 123
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              وصف الأعراض
            </CardTitle>
            <CardDescription>
              اختر نوع الأعراض ثم صفها بالتفصيل
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">نوع الأعراض</Label>
              <RadioGroup
                value={symptomType}
                onValueChange={(value) => setSymptomType(value as typeof symptomType)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="physical" id="physical" />
                  <Label htmlFor="physical" className="flex items-center gap-2 cursor-pointer">
                    <Activity className="h-4 w-4 text-green-600" />
                    أعراض جسدية
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="mental" id="mental" />
                  <Label htmlFor="mental" className="flex items-center gap-2 cursor-pointer">
                    <Brain className="h-4 w-4 text-purple-600" />
                    أعراض نفسية
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="flex items-center gap-2 cursor-pointer">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    كلاهما
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="symptoms" className="text-base font-medium">
                صف أعراضك بالتفصيل
              </Label>
              <Textarea
                id="symptoms"
                placeholder="مثال: أشعر بصداع شديد في الجانب الأيمن من الرأس منذ 3 أيام، مع غثيان وحساسية للضوء..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[150px] text-base"
                maxLength={2000}
              />
              <div className="text-sm text-muted-foreground text-left">
                {symptoms.length}/2000 حرف
              </div>
            </div>

            <Button
              onClick={handleDiagnosis}
              disabled={isLoading || symptoms.trim().length < 10}
              className="w-full h-12 text-lg gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التحليل...
                </>
              ) : (
                <>
                  <Stethoscope className="h-5 w-5" />
                  تشخيص الأعراض
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {diagnosis && (
          <Card className="mt-6 border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Stethoscope className="h-5 w-5" />
                نتيجة التشخيص
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap leading-relaxed">
                {diagnosis}
              </div>
            </CardContent>
          </Card>
        )}
        <AskMe />
      <AdSlot id="diagnosis-bottom" format="inline" />
      </main>

      <Footer />
    </div>
  );
};

export default PersonalDiagnosis;
