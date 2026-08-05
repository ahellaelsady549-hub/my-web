import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Apple, Calculator, Loader2, Droplets, Dumbbell, Flame, Wheat, Clock, Download, ChevronDown, ChevronUp, Target, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  height: string;
  weight: string;
  age: string;
  gender: string;
  activityLevel: string;
}

interface DietPlanResult {
  dailyCalories: number;
  bmi: number;
  bmiCategory: string;
  bodyType: 'underweight' | 'normal' | 'overweight';
  goalDescription: string;
  weightPrediction: {
    currentWeight: number;
    targetWeight: number;
    predictedWeightAfterMonth: number;
    weeklyChange: number;
  };
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
  };
  waterIntake: string;
  breakfast: {
    title: string;
    items: string[];
    calories: number;
  };
  lunch: {
    title: string;
    items: string[];
    calories: number;
  };
  dinner: {
    title: string;
    items: string[];
    calories: number;
  };
  snacks: {
    title: string;
    items: string[];
    calories: number;
  };
  tips: string[];
  avoid: string[];
}

const activityLevels = [
  { value: 'sedentary', label: 'قليل الحركة (مكتبي)' },
  { value: 'light', label: 'نشاط خفيف (1-2 يوم/أسبوع)' },
  { value: 'moderate', label: 'نشاط متوسط (3-5 يوم/أسبوع)' },
  { value: 'active', label: 'نشيط جداً (6-7 يوم/أسبوع)' },
  { value: 'athlete', label: 'رياضي محترف' },
];

export const DietPlan = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData>({ 
    height: '', 
    weight: '', 
    age: '',
    gender: 'male',
    activityLevel: 'moderate'
  });
  const [dietPlan, setDietPlan] = useState<DietPlanResult | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Auto-save diet plan to database when generated
  const saveDietPlanToDatabase = async (plan: DietPlanResult) => {
    if (!user) return;

    try {
      const height = parseFloat(userData.height);
      const weight = parseFloat(userData.weight);
      const age = parseInt(userData.age);
      const bmi = weight / Math.pow(height / 100, 2);
      let goal = 'maintain';
      if (bmi < 18.5) goal = 'gain';
      else if (bmi >= 25) goal = 'lose';

      await supabase.from('user_diet_plans').insert({
        user_id: user.id,
        weight,
        height,
        age,
        gender: userData.gender,
        activity_level: userData.activityLevel,
        goal,
        bmi,
        bmr: plan.dailyCalories,
        calories: plan.dailyCalories,
        protein: plan.macros?.protein,
        carbs: plan.macros?.carbs,
        fats: plan.macros?.fats,
        predicted_weight: plan.weightPrediction?.predictedWeightAfterMonth,
        diet_plan: plan as any
      });

      toast({
        title: "تم الحفظ",
        description: "تم حفظ النظام الغذائي في لوحة التحكم"
      });
    } catch (error) {
      console.error('Error saving diet plan:', error);
    }
  };

  const generateDietPlan = async () => {
    const height = parseFloat(userData.height);
    const weight = parseFloat(userData.weight);
    const age = parseFloat(userData.age);

    if (!height || !weight || !age) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Calculate BMI to determine goal automatically
      const bmi = weight / Math.pow(height / 100, 2);
      let autoGoal = 'maintain';
      if (bmi < 18.5) autoGoal = 'gain';
      else if (bmi >= 25) autoGoal = 'lose';

      const { data, error } = await supabase.functions.invoke('ai-diet-plan', {
        body: {
          height,
          weight,
          age,
          gender: userData.gender,
          activityLevel: userData.activityLevel,
          goal: autoGoal
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.dietPlan) {
        setDietPlan(data.dietPlan);
        setShowPlan(true);
        localStorage.setItem('dietUserData', JSON.stringify(userData));
        // Auto-save for logged-in users
        if (user) {
          saveDietPlanToDatabase(data.dietPlan);
        }
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ في إنشاء النظام الغذائي",
        variant: "destructive",
      });
    } finally {
    setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateDietPlan();
  };

  const getBMICategoryColor = (category: string) => {
    if (category.includes('نحيف') || category.includes('Underweight')) return 'text-yellow-600';
    if (category.includes('طبيعي') || category.includes('Normal')) return 'text-green-600';
    if (category.includes('زائد') || category.includes('Overweight')) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <section id="diet-plan" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
            <Apple className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('diet.title')}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-6 md:p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="height">{t('diet.height')}</Label>
                  <div className="relative">
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={userData.height}
                      onChange={(e) => setUserData({ ...userData, height: e.target.value })}
                      className="pr-12"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      سم
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">{t('diet.weight')}</Label>
                  <div className="relative">
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={userData.weight}
                      onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                      className="pr-12"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      كجم
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">{t('diet.age')}</Label>
                  <div className="relative">
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={userData.age}
                      onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                      className="pr-16"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      سنة
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>الجنس</Label>
                  <Select value={userData.gender} onValueChange={(value) => setUserData({ ...userData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>مستوى النشاط</Label>
                  <Select value={userData.activityLevel} onValueChange={(value) => setUserData({ ...userData, activityLevel: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activityLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-wellness hover:opacity-90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    جاري إنشاء النظام الغذائي...
                  </>
                ) : (
                  <>
                    <Calculator className="h-5 w-5 mr-2" />
                    إنشاء نظام غذائي مخصص
                  </>
                )}
              </Button>
            </form>

            {showPlan && dietPlan && (
              <div className="mt-8 space-y-6 border-t pt-8">
                {/* Weight Prediction Card */}
                {dietPlan.weightPrediction && (
                  <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      توقع الوزن والهدف
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <Scale className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                        <p className="text-xl font-bold">{dietPlan.weightPrediction.currentWeight} كجم</p>
                        <p className="text-xs text-muted-foreground">الوزن الحالي</p>
                      </div>
                      <div>
                        <Target className="h-5 w-5 mx-auto mb-1 text-green-500" />
                        <p className="text-xl font-bold">{dietPlan.weightPrediction.targetWeight} كجم</p>
                        <p className="text-xs text-muted-foreground">الوزن المثالي</p>
                      </div>
                      <div>
                        {dietPlan.bodyType === 'underweight' ? (
                          <TrendingUp className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                        ) : dietPlan.bodyType === 'overweight' ? (
                          <TrendingDown className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                        ) : (
                          <Scale className="h-5 w-5 mx-auto mb-1 text-primary" />
                        )}
                        <p className="text-xl font-bold">{dietPlan.weightPrediction.predictedWeightAfterMonth} كجم</p>
                        <p className="text-xs text-muted-foreground">المتوقع بعد شهر</p>
                      </div>
                      <div>
                        <p className={`text-xl font-bold ${dietPlan.weightPrediction.weeklyChange > 0 ? 'text-green-500' : dietPlan.weightPrediction.weeklyChange < 0 ? 'text-orange-500' : 'text-primary'}`}>
                          {dietPlan.weightPrediction.weeklyChange > 0 ? '+' : ''}{dietPlan.weightPrediction.weeklyChange} كجم
                        </p>
                        <p className="text-xs text-muted-foreground">التغير الأسبوعي</p>
                      </div>
                    </div>
                    {dietPlan.goalDescription && (
                      <p className="mt-4 text-sm text-center text-muted-foreground bg-background/50 rounded-lg p-2">
                        🎯 {dietPlan.goalDescription}
                      </p>
                    )}
                  </Card>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="h-4 w-4 text-primary" />
                      <p className="text-sm text-muted-foreground">السعرات اليومية</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{dietPlan.dailyCalories}</p>
                  </Card>
                  <Card className="p-4 bg-secondary/5 border-secondary/20">
                    <p className="text-sm text-muted-foreground mb-1">مؤشر كتلة الجسم</p>
                    <p className="text-2xl font-bold text-secondary">{dietPlan.bmi}</p>
                    <p className={`text-xs ${getBMICategoryColor(dietPlan.bmiCategory)}`}>{dietPlan.bmiCategory}</p>
                  </Card>
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-muted-foreground">الماء يومياً</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{dietPlan.waterIntake}</p>
                  </Card>
                  <Card className="p-4 bg-purple-50 dark:bg-purple-950/20 border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Dumbbell className="h-4 w-4 text-purple-500" />
                      <p className="text-sm text-muted-foreground">البروتين</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{dietPlan.macros?.protein || 0}g</p>
                  </Card>
                </div>

                {/* Macros */}
                {dietPlan.macros && (
                  <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Wheat className="h-5 w-5 text-primary" />
                      توزيع الماكروز اليومي
                    </h4>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{dietPlan.macros.protein}g</p>
                        <p className="text-sm text-muted-foreground">بروتين</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-amber-600">{dietPlan.macros.carbs}g</p>
                        <p className="text-sm text-muted-foreground">كربوهيدرات</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{dietPlan.macros.fats}g</p>
                        <p className="text-sm text-muted-foreground">دهون</p>
                      </div>
                      {dietPlan.macros.fiber && (
                        <div>
                          <p className="text-2xl font-bold text-orange-600">{dietPlan.macros.fiber}g</p>
                          <p className="text-sm text-muted-foreground">ألياف</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Show More / Less Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowMore(!showMore)}
                  className="w-full flex items-center gap-2"
                >
                  {showMore ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      عرض أقل
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      عرض المزيد (الوجبات والنصائح)
                    </>
                  )}
                </Button>

                {showMore && (
                  <>
                    {/* Meals */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">{t('diet.planTitle')}</h3>
                      
                      <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-lg">{dietPlan.breakfast?.title || 'وجبة الإفطار'}</h4>
                          <span className="text-sm text-muted-foreground">{dietPlan.breakfast?.calories} سعرة</span>
                        </div>
                        <ul className="space-y-2">
                          {dietPlan.breakfast?.items?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>

                      <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-lg">{dietPlan.lunch?.title || 'وجبة الغداء'}</h4>
                          <span className="text-sm text-muted-foreground">{dietPlan.lunch?.calories} سعرة</span>
                        </div>
                        <ul className="space-y-2">
                          {dietPlan.lunch?.items?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>

                      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-lg">{dietPlan.dinner?.title || 'وجبة العشاء'}</h4>
                          <span className="text-sm text-muted-foreground">{dietPlan.dinner?.calories} سعرة</span>
                        </div>
                        <ul className="space-y-2">
                          {dietPlan.dinner?.items?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>

                      <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-lg">{dietPlan.snacks?.title || 'الوجبات الخفيفة'}</h4>
                          <span className="text-sm text-muted-foreground">{dietPlan.snacks?.calories} سعرة</span>
                        </div>
                        <ul className="space-y-2">
                          {dietPlan.snacks?.items?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>

                    {/* Tips */}
                    {dietPlan.tips && dietPlan.tips.length > 0 && (
                      <Card className="p-4 bg-primary/5">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          نصائح مهمة
                        </h4>
                        <ul className="space-y-2">
                          {dietPlan.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-primary">✓</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}

                    {/* Foods to Avoid */}
                    {dietPlan.avoid && dietPlan.avoid.length > 0 && (
                      <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200">
                        <h4 className="font-semibold mb-3 text-red-600">أطعمة يجب تجنبها</h4>
                        <ul className="space-y-2">
                          {dietPlan.avoid.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-red-500">✗</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </>
                )}

                {/* Download XML Button for Excel */}
                <Button
                  onClick={() => {
                    // Create Excel-compatible XML (SpreadsheetML)
                    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Size="12"/>
      <Interior ss:Color="#4CAF50" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="Data">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="النظام الغذائي">
    <Table>
      <Column ss:Width="150"/>
      <Column ss:Width="150"/>
      <Column ss:Width="150"/>
      <Column ss:Width="150"/>
      <Row ss:StyleID="Header">
        <Cell><Data ss:Type="String">البيان</Data></Cell>
        <Cell><Data ss:Type="String">القيمة</Data></Cell>
        <Cell><Data ss:Type="String">الوحدة</Data></Cell>
        <Cell><Data ss:Type="String">ملاحظات</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">السعرات الحرارية اليومية</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.dailyCalories}</Data></Cell>
        <Cell><Data ss:Type="String">سعرة</Data></Cell>
        <Cell><Data ss:Type="String">الاحتياج اليومي</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">مؤشر كتلة الجسم BMI</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.bmi}</Data></Cell>
        <Cell><Data ss:Type="String">-</Data></Cell>
        <Cell><Data ss:Type="String">${dietPlan.bmiCategory}</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">البروتين</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.macros?.protein || 0}</Data></Cell>
        <Cell><Data ss:Type="String">جرام</Data></Cell>
        <Cell><Data ss:Type="String">يومياً</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">الكربوهيدرات</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.macros?.carbs || 0}</Data></Cell>
        <Cell><Data ss:Type="String">جرام</Data></Cell>
        <Cell><Data ss:Type="String">يومياً</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">الدهون</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.macros?.fats || 0}</Data></Cell>
        <Cell><Data ss:Type="String">جرام</Data></Cell>
        <Cell><Data ss:Type="String">يومياً</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">الماء</Data></Cell>
        <Cell><Data ss:Type="String">${dietPlan.waterIntake}</Data></Cell>
        <Cell><Data ss:Type="String">لتر</Data></Cell>
        <Cell><Data ss:Type="String">يومياً</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">الوزن الحالي</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.weightPrediction?.currentWeight || 0}</Data></Cell>
        <Cell><Data ss:Type="String">كجم</Data></Cell>
        <Cell><Data ss:Type="String">-</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">الوزن المثالي</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.weightPrediction?.targetWeight || 0}</Data></Cell>
        <Cell><Data ss:Type="String">كجم</Data></Cell>
        <Cell><Data ss:Type="String">الهدف</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">الوزن المتوقع بعد شهر</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.weightPrediction?.predictedWeightAfterMonth || 0}</Data></Cell>
        <Cell><Data ss:Type="String">كجم</Data></Cell>
        <Cell><Data ss:Type="String">توقع</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
  <Worksheet ss:Name="الوجبات">
    <Table>
      <Column ss:Width="120"/>
      <Column ss:Width="300"/>
      <Column ss:Width="100"/>
      <Row ss:StyleID="Header">
        <Cell><Data ss:Type="String">الوجبة</Data></Cell>
        <Cell><Data ss:Type="String">المحتويات</Data></Cell>
        <Cell><Data ss:Type="String">السعرات</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">${dietPlan.breakfast?.title || 'الإفطار'}</Data></Cell>
        <Cell><Data ss:Type="String">${dietPlan.breakfast?.items?.join('، ') || ''}</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.breakfast?.calories || 0}</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">${dietPlan.lunch?.title || 'الغداء'}</Data></Cell>
        <Cell><Data ss:Type="String">${dietPlan.lunch?.items?.join('، ') || ''}</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.lunch?.calories || 0}</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">${dietPlan.dinner?.title || 'العشاء'}</Data></Cell>
        <Cell><Data ss:Type="String">${dietPlan.dinner?.items?.join('، ') || ''}</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.dinner?.calories || 0}</Data></Cell>
      </Row>
      <Row ss:StyleID="Data">
        <Cell><Data ss:Type="String">${dietPlan.snacks?.title || 'وجبات خفيفة'}</Data></Cell>
        <Cell><Data ss:Type="String">${dietPlan.snacks?.items?.join('، ') || ''}</Data></Cell>
        <Cell><Data ss:Type="Number">${dietPlan.snacks?.calories || 0}</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
  <Worksheet ss:Name="النصائح">
    <Table>
      <Column ss:Width="400"/>
      <Row ss:StyleID="Header">
        <Cell><Data ss:Type="String">نصائح مهمة</Data></Cell>
      </Row>
      ${dietPlan.tips?.map(tip => `<Row ss:StyleID="Data"><Cell><Data ss:Type="String">${tip}</Data></Cell></Row>`).join('\n      ') || ''}
    </Table>
  </Worksheet>
</Workbook>`;
                    const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'diet-plan.xls';
                    a.click();
                    URL.revokeObjectURL(url);
                    toast({ title: "تم التحميل", description: "تم تحميل النظام الغذائي كجدول Excel" });
                  }}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Download className="h-4 w-4" />
                  تحميل النظام الغذائي (Excel)
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};
