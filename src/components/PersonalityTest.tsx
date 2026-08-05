import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ChevronLeft, ChevronRight, RefreshCw, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { diseases } from '@/data/diseases';
import { treatments } from '@/data/treatments';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  textAr: string;
  category: string;
}

// 25 questions covering all mental health diseases
const PERSONALITY_QUESTIONS: Question[] = [
  { id: 1, textAr: 'هل تشعر بالحزن أو اليأس معظم الوقت دون سبب واضح؟', category: 'depression' },
  { id: 2, textAr: 'هل تجد صعوبة في النوم أو تنام كثيراً؟', category: 'insomnia' },
  { id: 3, textAr: 'هل تشعر بالقلق المفرط حول أمور يومية بسيطة؟', category: 'anxiety' },
  { id: 4, textAr: 'هل تتجنب التجمعات الاجتماعية والمناسبات خوفاً من الحكم عليك؟', category: 'social_anxiety' },
  { id: 5, textAr: 'هل لديك أفكار متكررة مزعجة لا تستطيع التخلص منها؟', category: 'ocd' },
  { id: 6, textAr: 'هل تشعر بتقلبات حادة في المزاج بين السعادة الشديدة والحزن؟', category: 'bipolar' },
  { id: 7, textAr: 'هل تجد صعوبة شديدة في التركيز على المهام وإكمالها؟', category: 'adhd' },
  { id: 8, textAr: 'هل تشعر بالخوف الشديد من أماكن أو مواقف معينة؟', category: 'phobia' },
  { id: 9, textAr: 'هل تعرضت لصدمة نفسية لا تزال تؤثر عليك بكوابيس أو ذكريات؟', category: 'ptsd' },
  { id: 10, textAr: 'هل تشعر بالفراغ أو انعدام المعنى في الحياة؟', category: 'depression' },
  { id: 11, textAr: 'هل تميل للانعزال عن الآخرين وتفضل الوحدة دائماً؟', category: 'avoidant' },
  { id: 12, textAr: 'هل تشعر بنوبات هلع مفاجئة مع خفقان وضيق تنفس؟', category: 'panic' },
  { id: 13, textAr: 'هل لديك سلوكيات قهرية تكررها باستمرار كغسل اليدين أو الترتيب؟', category: 'ocd' },
  { id: 14, textAr: 'هل تشعر بعدم الثقة في الآخرين وتشك في نواياهم؟', category: 'paranoid' },
  { id: 15, textAr: 'هل تجد صعوبة كبيرة في التحكم بمشاعرك وانفعالاتك؟', category: 'borderline' },
  { id: 16, textAr: 'هل تسمع أصواتاً أو ترى أشياء لا يراها الآخرون؟', category: 'schizophrenia' },
  { id: 17, textAr: 'هل لديك مشكلة في علاقاتك بالطعام كالإفراط أو الامتناع؟', category: 'eating' },
  { id: 18, textAr: 'هل تلجأ لمواد مخدرة أو كحول للهروب من مشاعرك؟', category: 'substance' },
  { id: 19, textAr: 'هل تشعر أنك منفصل عن جسدك أو أن العالم غير حقيقي؟', category: 'dissociative' },
  { id: 20, textAr: 'هل تحتاج دائماً لاهتمام الآخرين وإعجابهم بشكل مفرط؟', category: 'narcissistic' },
  { id: 21, textAr: 'هل تجد صعوبة في اتخاذ قرارات يومية دون مساعدة الآخرين؟', category: 'dependent' },
  { id: 22, textAr: 'هل تميل لتجميع الأشياء وصعوبة التخلص منها؟', category: 'hoarding' },
  { id: 23, textAr: 'هل تقوم بنتف شعرك أو خدش جلدك بشكل متكرر؟', category: 'trichotillomania' },
  { id: 24, textAr: 'هل تخاف من الخروج من المنزل أو الأماكن المزدحمة؟', category: 'agoraphobia' },
  { id: 25, textAr: 'هل تعاني من قلق الانفصال عن أشخاص مقربين منك؟', category: 'separation' },
];

const ANSWER_OPTIONS = [
  { value: 0, labelAr: 'أبداً' },
  { value: 1, labelAr: 'نادراً' },
  { value: 2, labelAr: 'أحياناً' },
  { value: 3, labelAr: 'غالباً' },
  { value: 4, labelAr: 'دائماً' },
];

const mentalHealthDiseaseIds = [
  'depression', 'bipolar', 'schizophrenia', 'ocd', 'ptsd', 
  'panic_disorder', 'social_anxiety', 'eating_disorder', 'adhd', 
  'autism', 'personality_disorder', 'substance_abuse', 'insomnia', 
  'phobia', 'dissociative', 'generalized_anxiety', 'seasonal_depression',
  'hoarding_disorder', 'body_dysmorphia', 'intermittent_explosive',
  'trichotillomania', 'dermatillomania', 'agoraphobia', 'adjustment_disorder',
  'somatoform', 'avoidant_personality', 'narcissistic_personality',
  'dependent_personality', 'paranoid_personality', 'borderline_personality',
  'cyclothymia', 'selective_mutism', 'reactive_attachment', 'excoriation',
  'gambling_disorder', 'illness_anxiety', 'depersonalization', 'acute_stress',
  'specific_phobia', 'separation_anxiety', 'conversion_disorder', 'factitious_disorder',
  'brief_psychotic', 'shared_psychotic', 'catatonia'
];

export const PersonalityTest = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [suggestedDiseases, setSuggestedDiseases] = useState<string[]>([]);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = PERSONALITY_QUESTIONS.length * 4;
    return Math.round((totalScore / maxScore) * 100);
  };

  const getCategoryScores = () => {
    const categoryScores: Record<string, number[]> = {};
    
    PERSONALITY_QUESTIONS.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        if (!categoryScores[question.category]) {
          categoryScores[question.category] = [];
        }
        categoryScores[question.category].push(answer);
      }
    });

    const avgScores: Record<string, number> = {};
    Object.entries(categoryScores).forEach(([category, scores]) => {
      avgScores[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    return avgScores;
  };

  const getResultLevel = (score: number) => {
    if (score < 25) return { level: 'سليم', color: 'bg-green-500', textColor: 'text-green-600' };
    if (score < 50) return { level: 'قلق خفيف', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    if (score < 75) return { level: 'يحتاج متابعة', color: 'bg-orange-500', textColor: 'text-orange-600' };
    return { level: 'يحتاج استشارة متخصصة', color: 'bg-red-500', textColor: 'text-red-600' };
  };

  const getSuggestedDiseases = (categoryScores: Record<string, number>) => {
    const suggested: string[] = [];
    
    if (categoryScores.depression >= 2.5) suggested.push('depression', 'seasonal_depression');
    if (categoryScores.anxiety >= 2.5) suggested.push('generalized_anxiety', 'panic_disorder');
    if (categoryScores.social_anxiety >= 2.5) suggested.push('social_anxiety', 'avoidant_personality');
    if (categoryScores.ocd >= 2.5) suggested.push('ocd', 'trichotillomania');
    if (categoryScores.bipolar >= 2.5) suggested.push('bipolar', 'cyclothymia');
    if (categoryScores.adhd >= 2.5) suggested.push('adhd');
    if (categoryScores.phobia >= 2.5) suggested.push('phobia', 'specific_phobia');
    if (categoryScores.ptsd >= 2.5) suggested.push('ptsd', 'acute_stress');
    if (categoryScores.paranoid >= 2.5) suggested.push('paranoid_personality');
    if (categoryScores.avoidant >= 2.5) suggested.push('avoidant_personality');
    if (categoryScores.panic >= 2.5) suggested.push('panic_disorder');
    if (categoryScores.borderline >= 2.5) suggested.push('borderline_personality');
    if (categoryScores.insomnia >= 2.5) suggested.push('insomnia');
    if (categoryScores.schizophrenia >= 2.5) suggested.push('schizophrenia');
    if (categoryScores.eating >= 2.5) suggested.push('eating_disorder');
    if (categoryScores.substance >= 2.5) suggested.push('substance_abuse');
    if (categoryScores.dissociative >= 2.5) suggested.push('dissociative', 'depersonalization');
    if (categoryScores.narcissistic >= 2.5) suggested.push('narcissistic_personality');
    if (categoryScores.dependent >= 2.5) suggested.push('dependent_personality');
    if (categoryScores.hoarding >= 2.5) suggested.push('hoarding_disorder');
    if (categoryScores.trichotillomania >= 2.5) suggested.push('trichotillomania', 'dermatillomania');
    if (categoryScores.agoraphobia >= 2.5) suggested.push('agoraphobia');
    if (categoryScores.separation >= 2.5) suggested.push('separation_anxiety');

    return [...new Set(suggested)];
  };

  const analyzeWithAI = async () => {
    setIsLoading(true);
    const score = calculateScore();
    const categoryScores = getCategoryScores();
    const suggestedIds = getSuggestedDiseases(categoryScores);
    setSuggestedDiseases(suggestedIds);

    const answersText = PERSONALITY_QUESTIONS.map(q => {
      const answer = answers[q.id];
      const answerLabel = ANSWER_OPTIONS.find(o => o.value === answer)?.labelAr || '';
      return `${q.textAr}: ${answerLabel}`;
    }).join('\n');

    try {
      const { data, error } = await supabase.functions.invoke('personality-test-analysis', {
        body: { 
          answers: answersText, 
          score, 
          categoryScores,
          suggestedDiseases: suggestedIds 
        }
      });

      if (error) {
        console.error('AI analysis error:', error);
        setAiAnalysis(null);
      } else {
        setAiAnalysis(data?.analysis || null);
        
        // Auto-save results for logged-in users
        if (user) {
          try {
            await supabase.from('user_personality_results').insert({
              user_id: user.id,
              score,
              level: score < 25 ? 'سليم' : score < 50 ? 'قلق خفيف' : score < 75 ? 'يحتاج متابعة' : 'يحتاج استشارة متخصصة',
              category_scores: categoryScores,
              suggested_diseases: suggestedIds,
              ai_analysis: data?.analysis || null
            });
            toast({
              title: "تم الحفظ",
              description: "تم حفظ نتائج الاختبار في لوحة التحكم"
            });
          } catch (saveError) {
            console.error('Error saving personality results:', saveError);
          }
        }
      }
    } catch (err) {
      console.error('Error calling AI:', err);
      setAiAnalysis(null);
    }

    setShowResults(true);
    setIsLoading(false);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setAiAnalysis(null);
    setSuggestedDiseases([]);
  };

  const progress = (Object.keys(answers).length / PERSONALITY_QUESTIONS.length) * 100;
  const canSubmit = Object.keys(answers).length === PERSONALITY_QUESTIONS.length;

  const mentalHealthDiseases = diseases.filter(d => mentalHealthDiseaseIds.includes(d.id));

  if (showResults) {
    const score = calculateScore();
    const result = getResultLevel(score);
    const suggestedDiseaseDetails = mentalHealthDiseases.filter(d => suggestedDiseases.includes(d.id));

    return (
      <section id="personality-test" className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                نتائج الاختبار النفسي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${result.color} text-white text-lg font-bold`}>
                  {score < 50 ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                  {result.level}
                </div>
                <p className="mt-4 text-muted-foreground">
                  النتيجة: {score}% من مؤشرات القلق النفسي
                </p>
              </div>

              <Progress value={score} className="h-4" />

              {aiAnalysis && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      تحليل الذكاء الاصطناعي
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{aiAnalysis}</p>
                  </CardContent>
                </Card>
              )}

              {suggestedDiseaseDetails.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">الاضطرابات المحتملة بناءً على إجاباتك:</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {suggestedDiseaseDetails.map(disease => {
                      const diseaseTreatments = treatments.filter(t => t.diseaseId === disease.id);
                      return (
                        <Card key={disease.id} className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{disease.nameAr}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-sm font-medium mb-1">الأعراض:</p>
                              <div className="flex flex-wrap gap-1">
                                {disease.symptomsAr.slice(0, 4).map((symptom, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {diseaseTreatments.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1">العلاجات المقترحة:</p>
                                <div className="flex flex-wrap gap-1">
                                  {diseaseTreatments.slice(0, 3).map(treatment => (
                                    <Badge key={treatment.id} className="text-xs bg-primary/80">
                                      {treatment.nameAr} ({treatment.price} ج.م)
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="text-center pt-4">
                <Button onClick={resetTest} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  إعادة الاختبار
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                ⚠️ هذا الاختبار للأغراض التوعوية فقط ولا يعتبر تشخيصاً طبياً. يرجى استشارة أخصائي نفسي للحصول على تقييم دقيق.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const question = PERSONALITY_QUESTIONS[currentQuestion];

  return (
    <section id="personality-test" className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            اختبار الصحة النفسية
          </h2>
          <p className="text-muted-foreground">
            أجب على 25 سؤالاً لتقييم حالتك النفسية بشكل شامل
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                السؤال {currentQuestion + 1} من {PERSONALITY_QUESTIONS.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <p className="text-xl font-medium">{question.textAr}</p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {ANSWER_OPTIONS.map(option => (
                <Button
                  key={option.value}
                  variant={answers[question.id] === option.value ? "default" : "outline"}
                  className="flex flex-col h-auto py-3 px-2"
                  onClick={() => handleAnswer(question.id, option.value)}
                >
                  <span className="text-xs">{option.labelAr}</span>
                </Button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="gap-1"
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </Button>

              {currentQuestion < PERSONALITY_QUESTIONS.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={answers[question.id] === undefined}
                  className="gap-1"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={analyzeWithAI}
                  disabled={!canSubmit || isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      عرض النتائج
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
