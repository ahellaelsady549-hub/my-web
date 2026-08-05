import { Search, X, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { diseases } from '@/data/diseases';
import { treatments } from '@/data/treatments';

export const Hero = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'symptoms' | 'disease'>('symptoms');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [searchResults, setSearchResults] = useState<typeof diseases>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim() || selectedDisease) {
      const query = searchQuery.toLowerCase();
      let results;
      
      if (selectedDisease) {
        results = diseases.filter(disease => disease.id === selectedDisease);
      } else if (searchType === 'symptoms') {
        results = diseases.filter(disease => {
          const symptoms = language === 'ar' ? disease.symptomsAr : disease.symptomsEn;
          return symptoms.some(symptom => symptom.toLowerCase().includes(query));
        });
      } else {
        results = diseases.filter(disease => {
          const name = language === 'ar' ? disease.nameAr : disease.nameEn;
          return name.toLowerCase().includes(query);
        });
      }
      
      setSearchResults(results);
      setShowResults(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedDisease('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
      {/* Visual Effects - Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float blur-sm"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full animate-float blur-md" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-accent/15 rounded-full animate-float blur-sm" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-primary/10 rounded-full animate-float blur-md" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 left-1/2 w-12 h-12 bg-secondary/10 rounded-full animate-float blur-sm" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Pulse rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-secondary/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Medical icons floating */}
        <div className="absolute top-1/4 right-[15%] text-4xl opacity-20 animate-float hidden md:block">💊</div>
        <div className="absolute bottom-1/4 left-[10%] text-3xl opacity-20 animate-float hidden md:block" style={{ animationDelay: '2s' }}>🏥</div>
        <div className="absolute top-[60%] right-[10%] text-3xl opacity-20 animate-float hidden md:block" style={{ animationDelay: '1s' }}>❤️</div>
        <div className="absolute top-[15%] left-[20%] text-2xl opacity-15 animate-float hidden md:block" style={{ animationDelay: '0.5s' }}>🩺</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl md:text-6xl font-bold tracking-tight">
            {t('hero.title')}
          </h2>
          <p className="mb-10 text-lg md:text-xl text-muted-foreground">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                variant={searchType === 'symptoms' ? 'default' : 'outline'}
                onClick={() => { setSearchType('symptoms'); setSelectedDisease(''); }}
                className={searchType === 'symptoms' ? 'bg-gradient-medical' : ''}
              >
                {t('search.bySymptoms')}
              </Button>
              <Button
                variant={searchType === 'disease' ? 'default' : 'outline'}
                onClick={() => { setSearchType('disease'); setSelectedDisease(''); }}
                className={searchType === 'disease' ? 'bg-gradient-medical' : ''}
              >
                {t('search.byDisease')}
              </Button>
            </div>

            <div className="mb-3">
              <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                <SelectTrigger className="h-14 shadow-soft border-2">
                  <SelectValue placeholder={language === 'ar' ? 'اختر المرض' : 'Select Disease'} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {diseases.map((disease) => (
                    <SelectItem key={disease.id} value={disease.id}>
                      {language === 'ar' ? disease.nameAr : disease.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={searchType === 'symptoms' ? t('search.symptomsPlaceholder') : t('search.diseasePlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-14 text-base shadow-soft border-2 focus:border-primary"
                  disabled={!!selectedDisease}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-14 px-8 bg-gradient-medical hover:opacity-90 shadow-soft"
              >
                {t('hero.searchButton')}
              </Button>
            </div>
          </div>

          {showResults && (
            <div className="mt-6 max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {language === 'ar' ? 'نتائج البحث' : 'Search Results'}
                </h3>
                <Button variant="ghost" size="sm" onClick={clearSearch}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {searchResults.map((disease) => {
                    const diseaseTreatments = treatments.filter(t => t.diseaseId === disease.id);
                    
                    return (
                      <Card key={disease.id} className="p-5 shadow-card">
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          {language === 'ar' ? disease.nameAr : disease.nameEn}
                        </h4>
                        <div className="mb-4">
                          <p className="font-medium mb-2">
                            {language === 'ar' ? 'الأعراض:' : 'Symptoms:'}
                          </p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(language === 'ar' ? disease.symptomsAr : disease.symptomsEn).map((symptom, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-primary mt-1">•</span>
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {diseaseTreatments.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 mb-3">
                              <Pill className="h-5 w-5 text-secondary" />
                              <p className="font-medium text-secondary">
                                {language === 'ar' ? 'أفضل 3 علاجات:' : 'Best 3 Treatments:'}
                              </p>
                            </div>
                            <div className="space-y-3">
                              {diseaseTreatments.slice(0, 3).map((treatment) => (
                                <div key={treatment.id} className="bg-secondary/5 p-3 rounded-lg">
                                  <p className="font-semibold text-sm mb-1">
                                    {language === 'ar' ? treatment.nameAr : treatment.nameEn}
                                  </p>
                                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    <span>{language === 'ar' ? 'السعر:' : 'Price:'} {treatment.price} {language === 'ar' ? 'جنيه' : 'EGP'}</span>
                                    <span>•</span>
                                    <span>{language === 'ar' ? 'الجرعة:' : 'Dosage:'} {language === 'ar' ? treatment.dosageAr : treatment.dosageEn}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center shadow-card">
                  <p className="text-muted-foreground">
                    {language === 'ar' 
                      ? 'لم يتم العثور على نتائج. حاول البحث بكلمات مختلفة.'
                      : 'No results found. Try searching with different keywords.'}
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};