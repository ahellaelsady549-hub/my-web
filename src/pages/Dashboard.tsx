import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { Header as SiteHeader } from '@/components/Header';
import NotificationSettings from '@/components/NotificationSettings';
import { 
  Pill, 
  Utensils, 
  Brain, 
  LogOut, 
  Plus, 
  Trash2, 
  Bell, 
  BellOff,
  Home,
  Heart,
  Activity,
  Stethoscope,
  Calendar,
  Link as LinkIcon
} from 'lucide-react';
import { treatments } from '@/data/treatments';
import { AdSlot } from '@/components/AdSlot';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  reminder_enabled: boolean;
}

interface DietPlan {
  id: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  goal: string;
  bmi: number;
  calories: number;
  created_at: string;
}

interface PersonalityResult {
  id: string;
  score: number;
  level: string;
  ai_analysis: string;
  created_at: string;
}

interface UserDisease {
  id: string;
  name: string;
  type: string;
  notes: string | null;
  diagnosed_at: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [personalityResults, setPersonalityResults] = useState<PersonalityResult[]>([]);
  const [userDiseases, setUserDiseases] = useState<UserDisease[]>([]);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [userProfile, setUserProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '1',
    time: '08:00',
    disease_id: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (profileData) setUserProfile(profileData);

    // Fetch medications
    const { data: medsData } = await supabase
      .from('user_medications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (medsData) setMedications(medsData);

    // Fetch diet plans
    const { data: dietData } = await supabase
      .from('user_diet_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (dietData) setDietPlans(dietData);

    // Fetch personality results
    const { data: personalityData } = await supabase
      .from('user_personality_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (personalityData) setPersonalityResults(personalityData);

    // Fetch user diseases
    const { data: diseasesData } = await supabase
      .from('user_diseases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (diseasesData) setUserDiseases(diseasesData);
  };

  const handleAddMedication = async () => {
    if (!user || !newMed.name) return;

    // Check if medication exists in treatments database
    const foundTreatment = treatments.find(t => 
      t.nameAr.includes(newMed.name) ||
      t.nameEn.toLowerCase().includes(newMed.name.toLowerCase()) ||
      newMed.name.toLowerCase().includes(t.nameEn.toLowerCase())
    );

    const dosage = foundTreatment?.dosageAr || newMed.dosage;
    const frequency = foundTreatment ? '3' : newMed.frequency;

    const { data, error } = await supabase
      .from('user_medications')
      .insert({
        user_id: user.id,
        name: newMed.name,
        dosage: dosage,
        frequency: frequency,
        time: newMed.time,
        reminder_enabled: true
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة الدواء',
        variant: 'destructive'
      });
    } else {
      setMedications([data, ...medications]);
      setNewMed({ name: '', dosage: '', frequency: '1', time: '08:00', disease_id: '' });
      setIsAddingMed(false);
      toast({
        title: 'تمت الإضافة',
        description: foundTreatment 
          ? `تم إضافة ${newMed.name} مع الجرعة الموصى بها تلقائياً`
          : 'تم إضافة الدواء بنجاح'
      });
    }
  };

  const handleDeleteMedication = async (id: string) => {
    const { error } = await supabase
      .from('user_medications')
      .delete()
      .eq('id', id);

    if (!error) {
      setMedications(medications.filter(m => m.id !== id));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الدواء بنجاح'
      });
    }
  };

  const toggleReminder = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('user_medications')
      .update({ reminder_enabled: !currentState })
      .eq('id', id);

    if (!error) {
      setMedications(medications.map(m => 
        m.id === id ? { ...m, reminder_enabled: !currentState } : m
      ));
    }
  };

  const handleDeleteDietPlan = async (id: string) => {
    const { error } = await supabase
      .from('user_diet_plans')
      .delete()
      .eq('id', id);

    if (!error) {
      setDietPlans(dietPlans.filter(p => p.id !== id));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الخطة الغذائية بنجاح'
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5" dir="rtl">
      <SiteHeader />

      {/* Page bar */}
      <header className="w-full border-b border-border bg-background/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-medical bg-clip-text text-transparent">
              لوحة التحكم
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 ml-2" />
              الرئيسية
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AdSlot id="dashboard-top" format="banner" />
        {/* Welcome Card */}
        <Card className="mb-8 bg-gradient-medical text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ProfileAvatar 
                avatarUrl={userProfile?.avatar_url || null}
                fullName={userProfile?.full_name || null}
                size="lg"
                editable
                onAvatarChange={(url) => setUserProfile(prev => prev ? { ...prev, avatar_url: url } : null)}
              />
              <div>
                <CardTitle className="text-2xl">مرحباً {userProfile?.full_name || 'بك'}!</CardTitle>
                <CardDescription className="text-white/80">
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">{medications.length}</div>
                <div className="text-sm text-white/80">أدوية</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{userDiseases.length}</div>
                <div className="text-sm text-white/80">أمراض</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{dietPlans.length}</div>
                <div className="text-sm text-white/80">خطط غذائية</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{personalityResults.length}</div>
                <div className="text-sm text-white/80">اختبارات</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="medications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              أدويتي
            </TabsTrigger>
            <TabsTrigger value="diseases" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              أمراضي
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              الغذائي
            </TabsTrigger>
            <TabsTrigger value="mental" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              النفسية
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              الإشعارات
            </TabsTrigger>
          </TabsList>

          {/* Medications Tab */}
          <TabsContent value="medications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>أدويتي</CardTitle>
                  <CardDescription>إدارة الأدوية والتذكيرات</CardDescription>
                </div>
                <Dialog open={isAddingMed} onOpenChange={setIsAddingMed}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-medical">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة دواء
                    </Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة دواء جديد</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>اسم الدواء</Label>
                        <Input
                          value={newMed.name}
                          onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                          placeholder="مثال: باراسيتامول"
                        />
                      </div>
                      <div>
                        <Label>الجرعة</Label>
                        <Input
                          value={newMed.dosage}
                          onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                          placeholder="مثال: 500mg"
                        />
                      </div>
                      <div>
                        <Label>عدد المرات يومياً</Label>
                        <Select value={newMed.frequency} onValueChange={(v) => setNewMed({ ...newMed, frequency: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">مرة واحدة</SelectItem>
                            <SelectItem value="2">مرتين</SelectItem>
                            <SelectItem value="3">3 مرات</SelectItem>
                            <SelectItem value="4">4 مرات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>وقت الجرعة الأولى</Label>
                        <Input
                          type="time"
                          value={newMed.time}
                          onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddMedication} className="w-full bg-gradient-medical">
                        إضافة
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {medications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Pill className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد أدوية مضافة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {medications.map((med) => (
                      <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Pill className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{med.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {med.dosage} - {med.frequency} مرات يومياً - {med.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleReminder(med.id, med.reminder_enabled)}
                          >
                            {med.reminder_enabled ? (
                              <Bell className="w-4 h-4 text-primary" />
                            ) : (
                              <BellOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMedication(med.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diseases Tab */}
          <TabsContent value="diseases">
            <Card>
              <CardHeader>
                <CardTitle>أمراضي</CardTitle>
                <CardDescription>سجل الحالات المرضية الخاصة بك</CardDescription>
              </CardHeader>
              <CardContent>
                {userDiseases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد أمراض مسجلة</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/#my-diseases')}
                    >
                      إضافة مرض
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userDiseases.map((disease) => (
                      <div key={disease.id} className="p-4 border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              disease.type === 'mental' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-primary/10'
                            }`}>
                              <Stethoscope className={`w-5 h-5 ${
                                disease.type === 'mental' ? 'text-purple-600 dark:text-purple-400' : 'text-primary'
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-semibold">{disease.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {disease.type === 'physical' ? 'جسدي' : 'نفسي'}
                              </Badge>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(disease.created_at).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        {disease.diagnosed_at && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>تم التشخيص: {new Date(disease.diagnosed_at).toLocaleDateString('ar-EG')}</span>
                          </div>
                        )}
                        {disease.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{disease.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diet Tab */}
          <TabsContent value="diet">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>سجل النظام الغذائي</CardTitle>
                  <CardDescription>تاريخ خططك الغذائية</CardDescription>
                </div>
                <Button 
                  className="bg-gradient-medical"
                  onClick={() => navigate('/diet-plan')}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إنشاء خطة جديدة
                </Button>
              </CardHeader>
              <CardContent>
                {dietPlans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد خطط غذائية</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-right">التاريخ</th>
                          <th className="p-3 text-right">الهدف</th>
                          <th className="p-3 text-right">الوزن</th>
                          <th className="p-3 text-right">الطول</th>
                          <th className="p-3 text-right">BMI</th>
                          <th className="p-3 text-right">السعرات</th>
                          <th className="p-3 text-right">إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dietPlans.map((plan) => (
                          <tr key={plan.id} className="border-b hover:bg-muted/30">
                            <td className="p-3 text-sm">
                              {new Date(plan.created_at).toLocaleDateString('ar-EG')}
                            </td>
                            <td className="p-3">
                              <Badge variant="outline">
                                {plan.goal === 'gain' ? 'زيادة الوزن' : plan.goal === 'lose' ? 'إنقاص الوزن' : 'الحفاظ'}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm">{plan.weight} كجم</td>
                            <td className="p-3 text-sm">{plan.height} سم</td>
                            <td className="p-3 text-sm">{plan.bmi?.toFixed(1)}</td>
                            <td className="p-3 text-sm">{plan.calories} سعرة</td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDietPlan(plan.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mental Health Tab */}
          <TabsContent value="mental">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>سجل الحالة النفسية</CardTitle>
                  <CardDescription>نتائج اختبارات الشخصية</CardDescription>
                </div>
                <Button 
                  className="bg-gradient-medical"
                  onClick={() => navigate('/personality-test')}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  اختبار جديد
                </Button>
              </CardHeader>
              <CardContent>
                {personalityResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد اختبارات</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {personalityResults.map((result) => (
                      <div key={result.id} className="p-4 border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            className={
                              result.level === 'سليم' ? 'bg-green-500' :
                              result.level === 'قلق خفيف' ? 'bg-yellow-500' :
                              result.level === 'يحتاج متابعة' ? 'bg-orange-500' : 'bg-red-500'
                            }
                          >
                            {result.level}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(result.created_at).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-primary" />
                          <span>النتيجة: {result.score}%</span>
                        </div>
                        {result.ai_analysis && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.ai_analysis}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      <AdSlot id="dashboard-bottom" format="inline" />
      </main>
    </div>
  );
};

export default Dashboard;
