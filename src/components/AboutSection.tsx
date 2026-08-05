import { diseases } from "@/data/diseases";
import { treatments } from "@/data/treatments";
import { firstAidTips } from "@/data/firstAidTips";
import { Heart, Stethoscope, Brain, Cross } from "lucide-react";

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

export const AboutSection = () => {
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
    <section id="about-section" className="py-16 bg-gradient-to-b from-background to-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            من نحن
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            إسعفني هو منصة صحية شاملة مصممة خصيصاً لخدمة المجتمع المصري، نقدم معلومات طبية موثوقة وإرشادات للإسعافات الأولية والصحة النفسية.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
              </div>
              <div className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">{stat.count}</div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">ماذا نقدم؟</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            نقدم قاعدة بيانات شاملة تضم {physicalDiseases.length} مرض جسدي و{treatments.length} علاج و{firstAidTips.length} إسعاف أولي و{mentalDiseases.length} مرض نفسي، بالإضافة إلى أرقام الطوارئ وحاسبة BMI وخطط النظام الغذائي والبحث عن أقرب المستشفيات والصيدليات.
          </p>
        </div>
      </div>
    </section>
  );
};
