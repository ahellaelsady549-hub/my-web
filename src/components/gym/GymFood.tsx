import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Utensils, Camera, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Analysis {
  name: string;
  ingredients?: string;
  quantityGrams?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  riskLevel?: string;
  riskReason?: string;
  notes?: string;
}

const riskColor = (level?: string) =>
  level === 'عالي' ? 'destructive' : level === 'متوسط' ? 'secondary' : 'default';

export const GymFood = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadLogs = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('gym_food_logs').select('*')
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);
    setLogs(data ?? []);
  };

  useEffect(() => { loadLogs(); }, [user]);

  const saveAnalysis = async (a: Analysis, source: string) => {
    if (!user) return;
    await supabase.from('gym_food_logs').insert({
      user_id: user.id,
      name: a.name || 'وجبة',
      ingredients: a.ingredients ?? null,
      quantity_grams: a.quantityGrams ?? null,
      calories: a.calories ?? null,
      protein: a.protein ?? null,
      carbs: a.carbs ?? null,
      fats: a.fats ?? null,
      risk_level: a.riskLevel ?? null,
      risk_reason: a.riskReason ?? null,
      source,
      ai_notes: a.notes ?? null,
    });
    loadLogs();
  };

  const analyze = async (payload: Record<string, unknown>, source: string) => {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('gym-food-analyze', { body: payload });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data.analysis);
      await saveAnalysis(data.analysis, source);
      toast.success('تم تحليل الوجبة وحفظها');
    } catch (e: any) {
      toast.error(e?.message || 'تعذّر تحليل الوجبة');
    } finally {
      setLoading(false);
    }
  };

  const handleImage = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) { toast.error('حجم الصورة كبير (الحد 8 ميجا)'); return; }
    const reader = new FileReader();
    reader.onload = () => analyze({ mode: 'image', imageBase64: reader.result, note: name }, 'image');
    reader.readAsDataURL(file);
  };

  const ask = async () => {
    setAsking(true);
    setAnswer('');
    try {
      const { data, error } = await supabase.functions.invoke('gym-food-analyze', {
        body: { mode: 'suggest', question },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAnswer(data.answer);
    } catch (e: any) {
      toast.error(e?.message || 'تعذّر الحصول على اقتراحات');
    } finally {
      setAsking(false);
    }
  };

  const removeLog = async (id: string) => {
    await supabase.from('gym_food_logs').delete().eq('id', id);
    loadLogs();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Utensils className="h-5 w-5 text-primary" />
            تحليل الأكل (سعرات / بروتين / دهون / خطورة على الدايت)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="اسم الوجبة (مثال: فرخة مشوية بالأرز)" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea
            placeholder="المكونات والكميات (مثال: 200 جرام صدور فراخ، 150 جرام أرز، معلقة زيت)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={3}
          />
          <Input type="number" placeholder="الكمية الإجمالية بالجرام (اختياري)" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => analyze({ mode: 'text', name, ingredients, quantityGrams: quantity }, 'manual')}
              disabled={loading || (!name && !ingredients)}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin ms-2" /> : <Sparkles className="h-4 w-4 ms-2" />}
              حلّل الوجبة
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={loading}>
              <Camera className="h-4 w-4 ms-2" />
              تحليل من صورة الأكل
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); e.target.value = ''; }}
            />
          </div>

          {result && (
            <div className="rounded-lg border border-border p-4 space-y-2">
              <h3 className="font-semibold">{result.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="rounded-md bg-muted/50 p-2">السعرات: <b>{result.calories}</b></div>
                <div className="rounded-md bg-muted/50 p-2">بروتين: <b>{result.protein} جم</b></div>
                <div className="rounded-md bg-muted/50 p-2">كارب: <b>{result.carbs} جم</b></div>
                <div className="rounded-md bg-muted/50 p-2">دهون: <b>{result.fats} جم</b></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">مستوى الخطورة على الدايت:</span>
                <Badge variant={riskColor(result.riskLevel) as any}>{result.riskLevel}</Badge>
              </div>
              {result.riskReason && <p className="text-sm text-muted-foreground">{result.riskReason}</p>}
              {result.notes && <p className="text-sm">{result.notes}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            اسأل الذكاء الاصطناعي عن وجبات بأعلى بروتين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={2}
            placeholder="مثال: عندي فراخ وبيض وزبادي — إيه أعلى وجبات بروتين أقدر أعملها؟"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button onClick={ask} disabled={asking}>
            {asking ? <Loader2 className="h-4 w-4 animate-spin ms-2" /> : <Sparkles className="h-4 w-4 ms-2" />}
            اقترح وجبات
          </Button>
          {answer && <div className="rounded-lg border border-border p-4 text-sm whitespace-pre-wrap">{answer}</div>}
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">سجل وجباتي</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {logs.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2 text-sm">
                <div>
                  <b>{l.name}</b>
                  <span className="text-muted-foreground"> — {l.calories ?? '?'} سعرة / {l.protein ?? '?'} جم بروتين</span>
                  {l.risk_level && <Badge className="ms-2" variant={riskColor(l.risk_level) as any}>{l.risk_level}</Badge>}
                </div>
                <Button size="icon" variant="ghost" onClick={() => removeLog(l.id)} aria-label="حذف">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
