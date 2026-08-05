import { diseases } from "@/data/diseases";
import { treatments } from "@/data/treatments";
import { firstAidTips } from "@/data/firstAidTips";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Heart, Stethoscope, Brain, Cross, Users, Target, Award } from "lucide-react";
import { AdSlot } from '@/components/AdSlot';

const mentalHealthDiseaseIds = [
  'depression', 'bipolar', 'schizophrenia', 'ocd', 'ptsd', 
  'panic_disorder', 'social_anxiety', 'eating_disorder', 'adhd', 
  'autism', 'personality_disorder', 'substance_abuse', 'insomnia', 
  'phobia', 'dissociative', 'generalized_anxiety', 'seasonal_depression',
  'hoarding_disorder', 'body_dysmorphia', 'intermittent_explosive',
  'trichotillomania', 'dermatillomania', 'agoraphobia', 'adjustment_disorder',
  'somatoform', 'avoidant_personality', 'narcissistic_personality',
  'dependent_personality', 'paranoid_personality'
];

const About = () => {
  // Calculate statistics
  const physicalDiseases = diseases.filter(d => !mentalHealthDiseaseIds.includes(d.id));
  const mentalDiseases = diseases.filter(d => mentalHealthDiseaseIds.includes(d.id));
  
  const stats = [
    {
      icon: Stethoscope,
      count: physicalDiseases.length,
      label: "مرض جسدي",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Cross,
      count: treatments.length,
      label: "علاج",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Heart,
      count: firstAidTips.length,
      label: "إسعاف أولي",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Brain,
      count: mentalDiseases.length,
      label: "مرض نفسي",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <AdSlot id="about-top" format="banner" />
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            من نحن
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            إسعفني هو منصة صحية شاملة مصممة خصيصاً لخدمة المجتمع المصري، نقدم معلومات طبية موثوقة وإرشادات للإسعافات الأولية والصحة النفسية.
          </p>
        </div>

        {/* Statistics Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">
            إحصائيات الموقع
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">{stat.count}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">رسالتنا</h3>
            <p className="text-muted-foreground">
              توفير معلومات صحية موثوقة وسهلة الوصول لكل مواطن مصري
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">من نخدم</h3>
            <p className="text-muted-foreground">
              نخدم المجتمع المصري بأكمله من خلال توفير معلومات طبية موثوقة وشاملة
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">قيمنا</h3>
            <p className="text-muted-foreground">
              الدقة والموثوقية وسهولة الوصول هي أساس كل ما نقدمه
            </p>
          </div>
        </div>

        {/* Features Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">ماذا نقدم؟</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نقدم قاعدة بيانات شاملة تضم {physicalDiseases.length} مرض جسدي و{treatments.length} علاج و{firstAidTips.length} إسعاف أولي و{mentalDiseases.length} مرض نفسي، بالإضافة إلى أرقام الطوارئ وحاسبة BMI وخطط النظام الغذائي والبحث عن أقرب المستشفيات والصيدليات.
          </p>
        </div>
      <AdSlot id="about-bottom" format="inline" />
      </main>

      <Footer />
    </div>
  );
};

export default About;
