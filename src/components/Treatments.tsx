import { Pill, Search, Filter, Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { diseases } from '@/data/diseases';
import { Badge } from '@/components/ui/badge';

// الأعراض الشائعة للبحث
const commonSymptoms = [
  'حمى', 'صداع', 'إرهاق', 'غثيان', 'قيء', 'سعال', 'ضيق التنفس', 
  'ألم في الصدر', 'ألم في البطن', 'إسهال', 'إمساك', 'دوخة',
  'تورم', 'حكة', 'ألم في المفاصل', 'ضعف', 'فقدان الشهية'
];

const treatments = [
  {
    id: 'headache',
    nameKey: 'treatments.headache',
    category: 'pain',
    medications: [
      { nameAr: 'بنادول اكسترا', price: '15-20', dosageAr: '2 قرص كل 6 ساعات' },
      { nameAr: 'نوفالدول', price: '10-15', dosageAr: '1-2 قرص كل 4-6 ساعات' },
      { nameAr: 'سيتال', price: '8-12', dosageAr: '1 قرص 3 مرات يومياً' }
    ]
  },
  {
    id: 'joints',
    nameKey: 'treatments.bonePain',
    category: 'pain',
    medications: [
      { nameAr: 'فولتارين', price: '25-35', dosageAr: '1 قرص 2-3 مرات يومياً' },
      { nameAr: 'كتافلام', price: '20-30', dosageAr: '1 قرص 2-3 مرات يومياً بعد الأكل' },
      { nameAr: 'بروفين', price: '15-25', dosageAr: '1-2 قرص 3 مرات يومياً' }
    ]
  },
  {
    id: 'fever',
    nameKey: 'treatments.fever',
    category: 'general',
    medications: [
      { nameAr: 'بنادول', price: '12-18', dosageAr: '1-2 قرص كل 4-6 ساعات' },
      { nameAr: 'فيفادول', price: '10-15', dosageAr: '2 قرص كل 6 ساعات' },
      { nameAr: 'ابيمول', price: '8-12', dosageAr: '1 قرص 3-4 مرات يومياً' }
    ]
  },
  {
    id: 'cough',
    nameKey: 'treatments.cough',
    category: 'respiratory',
    medications: [
      { nameAr: 'ميوكوسولفان', price: '30-40', dosageAr: '10 مل 3 مرات يومياً' },
      { nameAr: 'توبلكسيل', price: '25-35', dosageAr: '15 مل 3 مرات يومياً' },
      { nameAr: 'بروسبان', price: '35-45', dosageAr: '5 مل 3 مرات يومياً' }
    ]
  },
  {
    id: 'flu',
    nameKey: 'treatments.flu',
    category: 'respiratory',
    medications: [
      { nameAr: 'كونجستال', price: '20-28', dosageAr: '1 قرص 3 مرات يومياً' },
      { nameAr: '123', price: '18-25', dosageAr: '2 قرص 3 مرات يومياً' },
      { nameAr: 'فلورست', price: '15-22', dosageAr: '1 قرص كل 6 ساعات' }
    ]
  },
  {
    id: 'covid19',
    nameKey: 'treatments.covid19',
    category: 'general',
    medications: [
      { nameAr: 'فيتامين سي 1000', price: '40-60', dosageAr: '1 قرص يومياً' },
      { nameAr: 'فيتامين د', price: '35-50', dosageAr: '1 كبسولة أسبوعياً' },
      { nameAr: 'زنك', price: '30-45', dosageAr: '1 قرص يومياً' }
    ]
  },
  {
    id: 'diabetes',
    nameKey: 'treatments.diabetes',
    category: 'chronic',
    medications: [
      { nameAr: 'جلوكوفاج', price: '25-35', dosageAr: '1 قرص مرتين يومياً' },
      { nameAr: 'اماريل', price: '30-45', dosageAr: '1 قرص صباحاً' },
      { nameAr: 'دياميكرون', price: '35-50', dosageAr: '1 قرص يومياً' }
    ]
  },
  {
    id: 'hypertension',
    nameKey: 'treatments.hypertension',
    category: 'chronic',
    medications: [
      { nameAr: 'كونكور', price: '40-60', dosageAr: '1 قرص صباحاً' },
      { nameAr: 'نورفاسك', price: '35-50', dosageAr: '1 قرص يومياً' },
      { nameAr: 'كوفرسيل', price: '45-65', dosageAr: '1 قرص صباحاً' }
    ]
  },
  {
    id: 'asthma',
    nameKey: 'treatments.asthma',
    category: 'respiratory',
    medications: [
      { nameAr: 'فنتولين بخاخ', price: '60-80', dosageAr: 'بخة واحدة عند الحاجة' },
      { nameAr: 'سيريتايد بخاخ', price: '180-220', dosageAr: 'بخة صباحاً ومساءً' },
      { nameAr: 'سينجولير', price: '120-150', dosageAr: '1 قرص مساءً' }
    ]
  },
  {
    id: 'anemia',
    nameKey: 'treatments.anemia',
    category: 'general',
    medications: [
      { nameAr: 'فيروجلوبين', price: '45-60', dosageAr: '1 كبسولة يومياً' },
      { nameAr: 'هيموجيت', price: '35-50', dosageAr: '1 قرص مرتين يومياً' },
      { nameAr: 'فيتاترون', price: '50-70', dosageAr: '1 كبسولة يومياً' }
    ]
  },
  {
    id: 'migraine',
    nameKey: 'treatments.migraine',
    category: 'pain',
    medications: [
      { nameAr: 'ميجرانيل', price: '30-45', dosageAr: '1 قرص عند بداية النوبة' },
      { nameAr: 'اميجران', price: '80-120', dosageAr: '1 قرص عند الحاجة' },
      { nameAr: 'باراسيتامول 500', price: '10-15', dosageAr: '2 قرص كل 6 ساعات' }
    ]
  },
  {
    id: 'gastritis',
    nameKey: 'treatments.gastritis',
    category: 'digestive',
    medications: [
      { nameAr: 'كونترولوك', price: '35-50', dosageAr: '1 قرص صباحاً قبل الأكل' },
      { nameAr: 'نيكسيوم', price: '45-65', dosageAr: '1 قرص يومياً' },
      { nameAr: 'جافيسكون', price: '25-35', dosageAr: '10 مل بعد الأكل' }
    ]
  },
  {
    id: 'arthritis',
    nameKey: 'treatments.arthritis',
    category: 'pain',
    medications: [
      { nameAr: 'سيليبريكس', price: '50-70', dosageAr: '1 كبسولة مرتين يومياً' },
      { nameAr: 'موبيك', price: '40-60', dosageAr: '1 قرص يومياً' },
      { nameAr: 'ارثروفاست', price: '35-50', dosageAr: '1 كيس مرتين يومياً' }
    ]
  },
  {
    id: 'bronchitis',
    nameKey: 'treatments.bronchitis',
    category: 'respiratory',
    medications: [
      { nameAr: 'اوجمنتين', price: '60-85', dosageAr: '1 قرص مرتين يومياً' },
      { nameAr: 'ازيثروميسين', price: '45-65', dosageAr: '1 قرص يومياً لمدة 3 أيام' },
      { nameAr: 'كلافوكس', price: '50-70', dosageAr: '1 قرص 3 مرات يومياً' }
    ]
  },
  {
    id: 'sinusitis',
    nameKey: 'treatments.sinusitis',
    category: 'respiratory',
    medications: [
      { nameAr: 'سينوكلير', price: '30-45', dosageAr: 'بخة في كل فتحة أنف مرتين يومياً' },
      { nameAr: 'تلفاست', price: '40-55', dosageAr: '1 قرص يومياً' },
      { nameAr: 'رينوكورت', price: '85-110', dosageAr: 'بخة واحدة يومياً' }
    ]
  },
  {
    id: 'urinary_infection',
    nameKey: 'treatments.urinaryInfection',
    category: 'general',
    medications: [
      { nameAr: 'سيبروفلوكساسين', price: '25-40', dosageAr: '1 قرص مرتين يومياً' },
      { nameAr: 'يوريفين', price: '15-25', dosageAr: '1 كيس 3 مرات يومياً' },
      { nameAr: 'فلاجيل', price: '20-30', dosageAr: '1 قرص 3 مرات يومياً' }
    ]
  },
  {
    id: 'thyroid_disorder',
    nameKey: 'treatments.thyroidDisorder',
    category: 'chronic',
    medications: [
      { nameAr: 'يوثيروكس', price: '30-45', dosageAr: '1 قرص صباحاً على الريق' },
      { nameAr: 'ثيروكسين', price: '25-40', dosageAr: '1 قرص يومياً' },
      { nameAr: 'كاربيمازول', price: '35-50', dosageAr: '1 قرص مرتين يومياً' }
    ]
  },
  {
    id: 'anxiety',
    nameKey: 'treatments.anxiety',
    category: 'mental',
    medications: [
      { nameAr: 'زولام', price: '25-40', dosageAr: '1 قرص عند الحاجة' },
      { nameAr: 'ليكسوتانيل', price: '30-45', dosageAr: '1 قرص مساءً' },
      { nameAr: 'اندرال', price: '15-25', dosageAr: '1 قرص مرتين يومياً' }
    ]
  },
  {
    id: 'allergic_rhinitis',
    nameKey: 'treatments.allergicRhinitis',
    category: 'allergy',
    medications: [
      { nameAr: 'كلاريتين', price: '45-60', dosageAr: '1 قرص يومياً' },
      { nameAr: 'زيرتك', price: '40-55', dosageAr: '1 قرص مساءً' },
      { nameAr: 'أفاميس بخاخ', price: '90-120', dosageAr: 'بخة واحدة يومياً' }
    ]
  }
];

const categories = [
  { id: 'all', nameAr: 'الكل' },
  { id: 'pain', nameAr: 'الآلام والمسكنات' },
  { id: 'respiratory', nameAr: 'الجهاز التنفسي' },
  { id: 'digestive', nameAr: 'الجهاز الهضمي' },
  { id: 'chronic', nameAr: 'الأمراض المزمنة' },
  { id: 'general', nameAr: 'عام' },
  { id: 'mental', nameAr: 'الصحة النفسية' },
  { id: 'allergy', nameAr: 'الحساسية' }
];

export const Treatments = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showSymptomResults, setShowSymptomResults] = useState(false);

  // البحث عن الأمراض بالأعراض
  const physicalDiseases = diseases.filter(d => 
    !['depression', 'bipolar', 'schizophrenia', 'ocd', 'ptsd', 'panic_disorder', 
      'social_anxiety', 'eating_disorder', 'adhd', 'autism', 'personality_disorder',
      'substance_abuse', 'insomnia', 'phobia', 'dissociative', 'generalized_anxiety',
      'seasonal_depression', 'hoarding_disorder', 'body_dysmorphia', 'intermittent_explosive',
      'trichotillomania', 'dermatillomania', 'agoraphobia', 'adjustment_disorder',
      'somatoform', 'avoidant_personality', 'narcissistic_personality', 'dependent_personality',
      'paranoid_personality', 'borderline_personality', 'cyclothymia', 'selective_mutism',
      'reactive_attachment', 'excoriation', 'gambling_disorder', 'illness_anxiety',
      'binge_eating', 'rumination', 'separation_anxiety', 'conversion_disorder'
    ].includes(d.id)
  );

  const matchedDiseases = selectedSymptoms.length > 0
    ? physicalDiseases
        .map(disease => ({
          ...disease,
          matchCount: selectedSymptoms.filter(symptom =>
            disease.symptomsAr.some(s => s.includes(symptom))
          ).length
        }))
        .filter(d => d.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
    : [];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
    setShowSymptomResults(true);
  };

  const allMedications = treatments.flatMap(treatment => 
    treatment.medications.map(med => ({
      ...med,
      category: treatment.nameKey
    }))
  );

  const filteredByCategory = selectedCategory === 'all' 
    ? treatments 
    : treatments.filter(t => t.category === selectedCategory);

  const filteredMedications = searchQuery.trim() 
    ? allMedications.filter(med => 
        med.nameAr.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const displayedTreatments = showAll ? filteredByCategory : filteredByCategory.slice(0, 6);

  return (
    <section id="treatments" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {t('treatments.title')}
          </h2>
        </div>

        <div className="max-w-xl mx-auto mb-12 space-y-4">
          {/* Symptom Filter */}
          <div className="mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-between border-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    <span>البحث بالأعراض ({selectedSymptoms.length} محدد)</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-80 overflow-y-auto">
                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">اختر الأعراض:</h4>
                  {commonSymptoms.map(symptom => (
                    <div key={symptom} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => toggleSymptom(symptom)}
                      />
                      <span className="text-sm">{symptom}</span>
                    </div>
                  ))}
                  {selectedSymptoms.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setSelectedSymptoms([]); setShowSymptomResults(false); }}
                      className="w-full mt-2"
                    >
                      مسح الكل
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Symptom Results */}
          {showSymptomResults && matchedDiseases.length > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border mb-4 max-h-64 overflow-y-auto">
              <h4 className="font-semibold mb-3">الأمراض المحتملة حسب الأعراض:</h4>
              {matchedDiseases.slice(0, 5).map(disease => (
                <div key={disease.id} className="p-3 bg-accent/30 rounded-lg mb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{disease.nameAr}</span>
                    <Badge variant="secondary">{disease.matchCount} أعراض متطابقة</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 shadow-soft border-2">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute end-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder={t('treatments.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pe-12 h-12 shadow-soft border-2 focus:border-primary"
            />
          </div>

          {searchQuery.trim() && (
            <div className="mt-4 space-y-3 bg-card p-4 rounded-lg shadow-card max-h-96 overflow-y-auto">
              {filteredMedications.length > 0 ? (
                filteredMedications.map((med, idx) => (
                  <div key={idx} className="p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-lg">{med.nameAr}</p>
                        <p className="text-sm text-muted-foreground">{t(med.category)}</p>
                      </div>
                      <p className="font-bold text-primary">{med.price} جنيه</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-sm">
                        <span className="font-medium">الجرعة: </span>
                        {med.dosageAr}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">لم يتم العثور على نتائج</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          {displayedTreatments.map((treatment) => (
            <Card key={treatment.id} className="p-6 shadow-card hover:shadow-soft transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{t(treatment.nameKey)}</h3>
              </div>
              
              <div className="space-y-3">
                {treatment.medications.map((med, idx) => (
                  <div key={idx} className="p-3 bg-accent/30 rounded-lg">
                    <p className="font-medium text-sm mb-1">{med.nameAr}</p>
                    <p className="text-xs text-muted-foreground mb-1">{med.price} جنيه</p>
                    <p className="text-xs text-primary">{med.dosageAr}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {filteredByCategory.length > 6 && (
          <div className="text-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="border-2 border-primary hover:bg-primary/10"
            >
              {showAll ? 'عرض أقل' : 'عرض المزيد'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
