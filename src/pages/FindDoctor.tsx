import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Star, 
  MessageCircle, 
  Home, 
  Heart,
  UserCheck,
  Filter,
  Loader2
} from 'lucide-react';
import { medicalSpecialties } from '@/data/specialties';
import { AdSlot } from '@/components/AdSlot';

interface Doctor {
  id: string;
  user_id: string;
  specialty: string;
  bio: string | null;
  rating: number;
  rating_count: number;
  is_verified: boolean;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const FindDoctor = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يرجى تسجيل الدخول للبحث عن الأطباء',
        variant: 'destructive'
      });
      navigate('/auth');
    }
  }, [user, loading, navigate, toast]);

  useEffect(() => {
    if (user) {
      fetchDoctors();
    }
  }, [user]);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchQuery, selectedSpecialty]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      // Use secure view that hides sensitive data (cv_url, portfolio_url)
      const { data, error } = await supabase
        .from('doctors_public' as any)
        .select('*');

      if (error) throw error;

      // Fetch profiles using secure view (hides email)
      if (data) {
        const doctorsWithProfiles = await Promise.all(
          data.map(async (doctor: any) => {
            const { data: profile } = await supabase
              .from('profiles_public' as any)
              .select('full_name, avatar_url')
              .eq('user_id', doctor.user_id)
              .maybeSingle();
            return { ...doctor, profile };
          })
        );
        setDoctors(doctorsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];

    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSpecialty && selectedSpecialty !== 'all') {
      filtered = filtered.filter(doc => doc.specialty === selectedSpecialty);
    }

    setFilteredDoctors(filtered);
  };

  const getSpecialtyLabel = (value: string) => {
    const spec = medicalSpecialties.find(s => s.value === value);
    return spec?.labelAr || value;
  };

  const startConversation = async (doctor: Doctor) => {
    if (!user) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يرجى تسجيل الدخول للتواصل مع الطبيب',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    try {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('doctor_id', doctor.id)
        .maybeSingle();

      if (existing) {
        navigate(`/chat/${existing.id}`);
        return;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          doctor_id: doctor.id
        })
        .select()
        .single();

      if (error) throw error;
      navigate(`/chat/${newConv.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء بدء المحادثة',
        variant: 'destructive'
      });
    }
  };

  const submitRating = async () => {
    if (!user || !selectedDoctor || userRating === 0) return;

    try {
      const { error } = await supabase
        .from('doctor_ratings')
        .upsert({
          doctor_id: selectedDoctor.id,
          user_id: user.id,
          rating: userRating,
          review: userReview
        });

      if (error) throw error;

      toast({
        title: 'شكراً لك',
        description: 'تم إضافة تقييمك بنجاح'
      });

      setSelectedDoctor(null);
      setUserRating(0);
      setUserReview('');
      fetchDoctors();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة التقييم',
        variant: 'destructive'
      });
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-medical bg-clip-text text-transparent">
              البحث عن طبيب
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <Home className="w-4 h-4 ml-2" />
            الرئيسية
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AdSlot id="find-doctor-top" format="banner" />
        {/* Search & Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث باسم الطبيب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 ml-2" />
                    <SelectValue placeholder="التخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التخصصات</SelectItem>
                    {medicalSpecialties.map(spec => (
                      <SelectItem key={spec.value} value={spec.value}>
                        {spec.labelAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-primary">جاري التحميل...</div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا يوجد أطباء مسجلين حالياً</p>
            <p className="text-sm mt-2">كن أول طبيب يسجل في المنصة!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map(doctor => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={doctor.profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {doctor.profile?.full_name?.charAt(0) || 'د'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          د. {doctor.profile?.full_name || 'طبيب'}
                        </CardTitle>
                        {doctor.is_verified && (
                          <UserCheck className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {getSpecialtyLabel(doctor.specialty)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= Math.round(doctor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({doctor.rating_count} تقييم)
                    </span>
                  </div>

                  {/* Bio */}
                  {doctor.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {doctor.bio}
                    </p>
                  )}

                  {/* Verified Badge */}
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <UserCheck className="w-4 h-4" />
                    <span>طبيب موثق</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-gradient-medical"
                      onClick={() => startConversation(doctor)}
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
                      محادثة
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent dir="rtl">
                        <DialogHeader>
                          <DialogTitle>تقييم د. {doctor.profile?.full_name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => setUserRating(star)}
                                className="p-1"
                              >
                                <Star
                                  className={`w-8 h-8 transition-colors ${star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                                />
                              </button>
                            ))}
                          </div>
                          <Textarea
                            placeholder="اكتب تقييمك (اختياري)"
                            value={userReview}
                            onChange={(e) => setUserReview(e.target.value)}
                          />
                          <Button 
                            className="w-full bg-gradient-medical"
                            onClick={submitRating}
                            disabled={userRating === 0}
                          >
                            إرسال التقييم
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      <AdSlot id="find-doctor-bottom" format="inline" />
      </main>
    </div>
  );
};

export default FindDoctor;
