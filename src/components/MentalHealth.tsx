import { Brain, Search, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useMemo } from 'react';
import { diseases } from '@/data/diseases';
import { treatments } from '@/data/treatments';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

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

export const MentalHealth = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isSymptomSearchOpen, setIsSymptomSearchOpen] = useState(false);

  const mentalHealthDiseases = diseases.filter(d => 
    mentalHealthDiseaseIds.includes(d.id)
  );

  // Get all unique symptoms for the filter
  const allSymptoms = useMemo(() => {
    const symptomsSet = new Set<string>();
    mentalHealthDiseases.forEach(disease => {
      const symptoms = language === 'ar' ? disease.symptomsAr : disease.symptomsEn;
      symptoms.forEach(symptom => symptomsSet.add(symptom));
    });
    return Array.from(symptomsSet).sort();
  }, [mentalHealthDiseases, language]);

  // Filter diseases by selected symptoms
  const filteredBySymptoms = useMemo(() => {
    if (selectedSymptoms.length === 0) return mentalHealthDiseases;
    
    return mentalHealthDiseases.filter(disease => {
      const symptoms = language === 'ar' ? disease.symptomsAr : disease.symptomsEn;
      return selectedSymptoms.some(selected => 
        symptoms.some(symptom => 
          symptom.toLowerCase().includes(selected.toLowerCase())
        )
      );
    }).sort((a, b) => {
      // Sort by number of matching symptoms
      const symptomsA = language === 'ar' ? a.symptomsAr : a.symptomsEn;
      const symptomsB = language === 'ar' ? b.symptomsAr : b.symptomsEn;
      const matchesA = selectedSymptoms.filter(sel => 
        symptomsA.some(s => s.toLowerCase().includes(sel.toLowerCase()))
      ).length;
      const matchesB = selectedSymptoms.filter(sel => 
        symptomsB.some(s => s.toLowerCase().includes(sel.toLowerCase()))
      ).length;
      return matchesB - matchesA;
    });
  }, [mentalHealthDiseases, selectedSymptoms, language]);

  const filteredDiseases = searchQuery.trim()
    ? filteredBySymptoms.filter(disease =>
        (language === 'ar' ? disease.nameAr : disease.nameEn)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : filteredBySymptoms;

  const displayedDiseases = showAll ? filteredDiseases : filteredDiseases.slice(0, 6);

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getDiseaseTimeTreatments = (diseaseId: string) => {
    return treatments.filter(t => t.diseaseId === diseaseId);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const clearSymptoms = () => {
    setSelectedSymptoms([]);
  };

  const getMatchingSymptomCount = (disease: typeof diseases[0]) => {
    if (selectedSymptoms.length === 0) return 0;
    const symptoms = language === 'ar' ? disease.symptomsAr : disease.symptomsEn;
    return selectedSymptoms.filter(sel => 
      symptoms.some(s => s.toLowerCase().includes(sel.toLowerCase()))
    ).length;
  };

  return (
    <section id="mental-health" className="py-16 md:py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            {language === 'ar' ? 'الأمراض النفسية' : 'Mental Health Disorders'}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'معلومات شاملة عن الأمراض النفسية وأعراضها وطرق العلاج المتاحة في مصر'
              : 'Comprehensive information about mental health disorders, symptoms, and available treatments in Egypt'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8 space-y-4">
          {/* Search by name */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'ar' ? 'ابحث عن مرض نفسي...' : 'Search for mental health disorder...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 shadow-soft border-2 focus:border-primary"
            />
          </div>

          {/* Search by symptoms */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Popover open={isSymptomSearchOpen} onOpenChange={setIsSymptomSearchOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-12 border-2 hover:border-primary"
                >
                  <Filter className="h-4 w-4" />
                  {language === 'ar' ? 'البحث بالأعراض' : 'Search by Symptoms'}
                  {selectedSymptoms.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedSymptoms.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-96 overflow-y-auto" align="start">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {language === 'ar' ? 'اختر الأعراض' : 'Select Symptoms'}
                    </h4>
                    {selectedSymptoms.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearSymptoms}>
                        {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {allSymptoms.map((symptom, idx) => (
                      <label 
                        key={idx} 
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md"
                      >
                        <Checkbox
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <span className="text-sm">{symptom}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {selectedSymptoms.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearSymptoms}
                className="h-12"
              >
                <X className="h-4 w-4 mr-1" />
                {language === 'ar' ? 'مسح الفلتر' : 'Clear Filter'}
              </Button>
            )}
          </div>

          {/* Selected symptoms badges */}
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}

          {/* Results count */}
          {selectedSymptoms.length > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              {language === 'ar' 
                ? `تم العثور على ${filteredDiseases.length} مرض مطابق للأعراض المحددة`
                : `Found ${filteredDiseases.length} disorders matching selected symptoms`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          {displayedDiseases.map((disease) => {
            const isExpanded = expandedCards.has(disease.id);
            const diseaseTimeTreatments = getDiseaseTimeTreatments(disease.id);
            const matchCount = getMatchingSymptomCount(disease);
            
            return (
              <Card key={disease.id} className="p-6 shadow-card hover:shadow-soft transition-shadow relative">
                {matchCount > 0 && (
                  <Badge className="absolute top-2 right-2 bg-primary">
                    {language === 'ar' ? `${matchCount} أعراض مطابقة` : `${matchCount} matching`}
                  </Badge>
                )}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-primary flex-1 pr-16">
                    {language === 'ar' ? disease.nameAr : disease.nameEn}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCard(disease.id)}
                    className="ml-2"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-sm">
                    {language === 'ar' ? 'الأعراض:' : 'Symptoms:'}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {(language === 'ar' ? disease.symptomsAr : disease.symptomsEn)
                      .slice(0, isExpanded ? undefined : 3)
                      .map((symptom, idx) => {
                        const isMatching = selectedSymptoms.some(sel => 
                          symptom.toLowerCase().includes(sel.toLowerCase())
                        );
                        return (
                          <li key={idx} className={`flex gap-2 ${isMatching ? 'text-primary font-medium' : ''}`}>
                            <span className="text-primary">•</span>
                            <span>{symptom}</span>
                          </li>
                        );
                      })}
                  </ul>
                </div>

                {isExpanded && diseaseTimeTreatments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-medium mb-3 text-sm">
                      {language === 'ar' ? 'العلاجات المتاحة:' : 'Available Treatments:'}
                    </h4>
                    <div className="space-y-2">
                      {diseaseTimeTreatments.map((treatment) => (
                        <div key={treatment.id} className="p-3 bg-accent/50 rounded-lg">
                          <p className="font-medium text-sm mb-1">
                            {language === 'ar' ? treatment.nameAr : treatment.nameEn}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            {treatment.price} {language === 'ar' ? 'جنيه' : 'EGP'}
                          </p>
                          <p className="text-xs text-primary">
                            {language === 'ar' ? treatment.dosageAr : treatment.dosageEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {filteredDiseases.length > 6 && (
          <div className="text-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="border-2 border-primary hover:bg-primary/10"
            >
              {showAll 
                ? (language === 'ar' ? 'عرض أقل' : 'Show Less')
                : (language === 'ar' ? 'عرض المزيد' : 'Show More')}
            </Button>
          </div>
        )}

        {filteredDiseases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'لم يتم العثور على أمراض مطابقة. جرب تغيير الأعراض المحددة.'
                : 'No matching disorders found. Try changing the selected symptoms.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
