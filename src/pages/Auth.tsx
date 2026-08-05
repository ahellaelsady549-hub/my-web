import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Heart, Mail, Lock, User, Home, KeyRound, Stethoscope, FileText, Loader2, RefreshCw } from 'lucide-react';
import { z } from 'zod';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { medicalSpecialties } from '@/data/specialties';
import QuickBotTest from '@/components/QuickBotTest';
import { AdSlot } from '@/components/AdSlot';

const emailSchema = z.string().email('البريد الإلكتروني غير صالح');
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
const nameSchema = z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل');

const Auth = () => {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  // User type selection
  const [userType, setUserType] = useState<'user' | 'doctor'>('user');
  
  // Doctor specific fields
  const [doctorSpecialty, setDoctorSpecialty] = useState('');
  const [doctorBio, setDoctorBio] = useState('');
  const [doctorCvUrl, setDoctorCvUrl] = useState('');
  const [doctorPortfolioUrl, setDoctorPortfolioUrl] = useState('');
  
  // AI CV Review
  const [isReviewingCv, setIsReviewingCv] = useState(false);
  const [cvReview, setCvReview] = useState<string | null>(null);
  
  // OTP verification states
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingUserData, setPendingUserData] = useState<any>(null);
  

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: 'خطأ في البيانات',
          description: err.errors[0].message,
          variant: 'destructive'
        });
        return;
      }
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message === 'Invalid login credentials' 
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : error.message === 'Email not confirmed'
          ? 'البريد الإلكتروني غير مؤكد، يرجى التحقق من بريدك'
          : error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في إسعفني'
      });
    }
  };

  const reviewCvWithAI = async () => {
    if (!doctorCvUrl) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال رابط السيرة الذاتية أولاً',
        variant: 'destructive'
      });
      return;
    }

    setIsReviewingCv(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: `أنت مراجع سير ذاتية محترف. قم بمراجعة السيرة الذاتية للطبيب المتقدم وأعطه تقييماً موجزاً. 
          الرابط: ${doctorCvUrl}
          التخصص المطلوب: ${medicalSpecialties.find(s => s.value === doctorSpecialty)?.labelAr || doctorSpecialty}
          
          أجب بتقييم موجز (3-4 جمل) يتضمن:
          1. هل الرابط يبدو صالحاً؟
          2. نصائح عامة للطبيب
          3. التوقعات من السيرة الذاتية الجيدة`
        }
      });

      if (error) throw error;
      setCvReview(data?.response || 'تم استلام السيرة الذاتية وسيتم مراجعتها');
    } catch (error) {
      console.error('Error reviewing CV:', error);
      setCvReview('تم استلام السيرة الذاتية وسيتم مراجعتها من قبل الإدارة');
    } finally {
      setIsReviewingCv(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      nameSchema.parse(signupName);
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPassword);
      
      if (userType === 'doctor' && !doctorSpecialty) {
        toast({
          title: 'خطأ في البيانات',
          description: 'يرجى اختيار التخصص الطبي',
          variant: 'destructive'
        });
        return;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: 'خطأ في البيانات',
          description: err.errors[0].message,
          variant: 'destructive'
        });
        return;
      }
    }

    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          full_name: signupName
        }
      }
    });

    if (error) {
      setIsLoading(false);
      if (error.message.includes('already registered')) {
        toast({
          title: 'خطأ في التسجيل',
          description: 'هذا البريد الإلكتروني مسجل بالفعل',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'خطأ في التسجيل',
          description: error.message,
          variant: 'destructive'
        });
      }
      return;
    }

    if (data.user) {
      try {
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: userType
        });

        if (userType === 'doctor') {
          await supabase.from('doctors').insert({
            user_id: data.user.id,
            specialty: doctorSpecialty,
            bio: doctorBio,
            cv_url: doctorCvUrl,
            portfolio_url: doctorPortfolioUrl,
            ai_cv_review: cvReview,
            is_verified: false,
            verification_status: 'pending'
          });
        }
      } catch (err) {
        console.error('Error creating user data:', err);
      }
    }

    setIsLoading(false);
    toast({
      title: 'تم التسجيل بنجاح',
      description: userType === 'doctor'
        ? 'مرحباً بك! سيتم مراجعة حسابك من قبل الإدارة'
        : 'مرحباً بك في إسعفني!'
    });
    navigate('/');
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال رمز التحقق المكون من 6 أرقام',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    const { data, error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token: otpValue,
      type: 'signup'
    });
    
    if (error) {
      setIsLoading(false);
      toast({
        title: 'خطأ في التحقق',
        description: 'رمز التحقق غير صحيح أو منتهي الصلاحية',
        variant: 'destructive'
      });
      return;
    }

    // After successful verification, create role and doctor profile if needed
    if (data.user && pendingUserData) {
      try {
        // Insert user role
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: pendingUserData.userType
        });

        // If doctor, create doctor profile
        if (pendingUserData.userType === 'doctor') {
          await supabase.from('doctors').insert({
            user_id: data.user.id,
            specialty: pendingUserData.doctorSpecialty,
            bio: pendingUserData.doctorBio,
            cv_url: pendingUserData.doctorCvUrl,
            portfolio_url: pendingUserData.doctorPortfolioUrl,
            ai_cv_review: pendingUserData.cvReview,
            is_verified: false,
            verification_status: 'pending'
          });
        }
      } catch (err) {
        console.error('Error creating user data:', err);
      }
    }

    setIsLoading(false);
    toast({
      title: 'تم التحقق بنجاح',
      description: pendingUserData?.userType === 'doctor' 
        ? 'مرحباً بك! سيتم مراجعة حسابك من قبل الإدارة'
        : 'مرحباً بك في إسعفني!'
    });
    setShowOtpInput(false);
    navigate('/');
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: pendingEmail
    });
    
    setIsLoading(false);

    if (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إعادة إرسال الرمز',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'تم إعادة الإرسال',
        description: 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4" dir="rtl">
      <AdSlot id="auth-top" format="banner" className="my-2 w-full" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-4 right-4"
      >
        <Home className="h-4 w-4 ml-2" />
        الرئيسية
      </Button>
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-medical rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-medical bg-clip-text text-transparent">
            إسعفني
          </CardTitle>
          <CardDescription>
            سجل دخولك لإدارة صحتك
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showOtpInput ? (
            <div className="space-y-6">
              <div className="text-center">
                <KeyRound className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">التحقق من البريد الإلكتروني</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  أدخل رمز التحقق المرسل إلى
                  <br />
                  <span className="font-medium text-foreground">{pendingEmail}</span>
                </p>
              </div>
              
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={setOtpValue}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                onClick={handleVerifyOtp}
                className="w-full bg-gradient-medical hover:opacity-90"
                disabled={isLoading || otpValue.length !== 6}
              >
                {isLoading ? 'جاري التحقق...' : 'تأكيد الرمز'}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Button 
                  variant="link" 
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="p-0"
                >
                  إعادة إرسال الرمز
                </Button>
                <Button 
                  variant="link" 
                  onClick={() => setShowOtpInput(false)}
                  className="p-0"
                >
                  تغيير البريد
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="example@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-medical hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                  </Button>
                  
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  {/* User Type Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={userType === 'user' ? 'default' : 'outline'}
                      className={userType === 'user' ? 'bg-gradient-medical' : ''}
                      onClick={() => setUserType('user')}
                    >
                      <User className="w-4 h-4 ml-2" />
                      مستخدم
                    </Button>
                    <Button
                      type="button"
                      variant={userType === 'doctor' ? 'default' : 'outline'}
                      className={userType === 'doctor' ? 'bg-gradient-medical' : ''}
                      onClick={() => setUserType('doctor')}
                    >
                      <Stethoscope className="w-4 h-4 ml-2" />
                      طبيب
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-name">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="محمد أحمد"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="example@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Doctor-specific fields */}
                  {userType === 'doctor' && (
                    <div className="space-y-4 pt-2 border-t">
                      <p className="text-sm text-muted-foreground">معلومات الطبيب</p>
                      
                      <div className="space-y-2">
                        <Label>التخصص الطبي</Label>
                        <Select value={doctorSpecialty} onValueChange={setDoctorSpecialty}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التخصص" />
                          </SelectTrigger>
                          <SelectContent>
                            {medicalSpecialties.map(spec => (
                              <SelectItem key={spec.value} value={spec.value}>
                                {spec.labelAr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>نبذة عنك (اختياري)</Label>
                        <Textarea
                          placeholder="اكتب نبذة مختصرة عن خبراتك ومؤهلاتك..."
                          value={doctorBio}
                          onChange={(e) => setDoctorBio(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>رابط السيرة الذاتية (Google Drive, LinkedIn, etc.)</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <FileText className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="url"
                              placeholder="https://..."
                              value={doctorCvUrl}
                              onChange={(e) => setDoctorCvUrl(e.target.value)}
                              className="pr-10"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={reviewCvWithAI}
                            disabled={isReviewingCv || !doctorCvUrl}
                          >
                            {isReviewingCv ? <Loader2 className="w-4 h-4 animate-spin" /> : 'مراجعة'}
                          </Button>
                        </div>
                        {cvReview && (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                            {cvReview}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>رابط البورتفوليو (اختياري)</Label>
                        <Input
                          type="url"
                          placeholder="https://..."
                          value={doctorPortfolioUrl}
                          onChange={(e) => setDoctorPortfolioUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-medical hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
          
          {/* Quick Bot Test */}
          <div className="border-t pt-4 mt-4">
            <QuickBotTest />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
