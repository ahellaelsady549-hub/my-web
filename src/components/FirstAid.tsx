import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { firstAidTips } from '@/data/firstAidTips';
import { Heart, Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [
  { id: 'all', nameAr: 'الكل' },
  { id: 'injuries', nameAr: 'الإصابات والجروح' },
  { id: 'breathing', nameAr: 'مشاكل التنفس' },
  { id: 'burns', nameAr: 'الحروق' },
  { id: 'bites', nameAr: 'اللدغات والعضات' },
  { id: 'medical', nameAr: 'الحالات الطبية' },
  { id: 'cardiac', nameAr: 'القلب والدورة الدموية' },
  { id: 'environmental', nameAr: 'الحالات البيئية' },
  { id: 'other', nameAr: 'أخرى' }
];

const getCategoryForTip = (tip: typeof firstAidTips[0]): string => {
  const title = tip.titleAr.toLowerCase();
  const desc = tip.descriptionAr.toLowerCase();
  const combined = title + ' ' + desc;
  
  if (combined.includes('قلب') || combined.includes('إنعاش') || combined.includes('نبض') || combined.includes('سكتة')) return 'cardiac';
  if (combined.includes('جرح') || combined.includes('نزيف') || combined.includes('كسر') || combined.includes('التواء') || combined.includes('إصابة')) return 'injuries';
  if (combined.includes('تنفس') || combined.includes('اختناق') || combined.includes('ربو') || combined.includes('غرق')) return 'breathing';
  if (combined.includes('حرق') || combined.includes('حرارة') || combined.includes('كهرب')) return 'burns';
  if (combined.includes('لدغ') || combined.includes('عض') || combined.includes('لسع') || combined.includes('سم')) return 'bites';
  if (combined.includes('سكر') || combined.includes('صرع') || combined.includes('إغماء') || combined.includes('تسمم')) return 'medical';
  if (combined.includes('حرارة') || combined.includes('برد') || combined.includes('شمس') || combined.includes('جفاف')) return 'environmental';
  return 'other';
};

export const FirstAid = () => {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const filteredTips = firstAidTips.filter(tip => {
    const tipCategory = getCategoryForTip(tip);
    const matchesCategory = selectedCategory === 'all' || tipCategory === selectedCategory;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = searchLower === '' || 
      tip.titleAr.toLowerCase().includes(searchLower) ||
      tip.descriptionAr.toLowerCase().includes(searchLower) ||
      tip.stepsAr.some(step => step.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  const displayedTips = showAll ? filteredTips : filteredTips.slice(0, 6);

  const toggleCard = (id: number) => {
    const idStr = id.toString();
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idStr)) {
        newSet.delete(idStr);
      } else {
        newSet.add(idStr);
      }
      return newSet;
    });
  };

  return (
    <section id="first-aid" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
            <Heart className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('firstAid.title')}
          </h2>
          <p className="text-muted-foreground mt-2">
            {filteredTips.length} إسعاف أولي متاح
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12 space-y-4">
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
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث في الإسعافات الأولية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 shadow-soft border-2 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          {displayedTips.map((tip) => {
            const isExpanded = expandedCards.has(tip.id.toString());
            
            return (
              <Card key={tip.id} className="p-6 shadow-card hover:shadow-soft transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-primary flex-1">
                    {tip.titleAr}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCard(tip.id)}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {tip.descriptionAr}
                </p>
                {isExpanded && (
                  <div className="space-y-4">
                    <ol className="space-y-2 text-sm">
                      {tip.stepsAr.map((step, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="font-semibold text-primary">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">لا توجد نتائج مطابقة للبحث</p>
          </div>
        )}

        {filteredTips.length > 6 && (
          <div className="text-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="border-2 border-primary hover:bg-primary/10"
            >
              {showAll ? 'عرض أقل' : `عرض المزيد (${filteredTips.length - 6} إضافي)`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
