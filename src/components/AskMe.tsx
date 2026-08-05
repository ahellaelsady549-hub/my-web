import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessagesSquare, Send, Trash2, History, ChevronDown, ChevronUp, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type Msg = { role: 'user' | 'assistant'; content: string };
type HistoryItem = { id: string; question: string; answer: string; created_at: string };

const SUGGESTIONS = [
  'إيه أسباب الصداع المستمر؟',
  'اعملي خطة مذاكرة أسبوعية',
  'أفضل أكل عالي البروتين ورخيص',
  'اشرح لي فرق الفيروس والبكتيريا',
];

export const AskMe = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const loadHistory = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('ask_me_history')
      .select('id, question, answer, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) return;
    setHistory(data || []);
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (q.length < 2) {
      toast.error('اكتب سؤالك أولاً');
      return;
    }
    setInput('');
    const historyMsgs = messages.slice(-10);
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ask-anything', {
        body: { question: q, history: historyMsgs },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const answer = data.answer as string;
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

      if (user) {
        const { data: saved, error: saveErr } = await supabase
          .from('ask_me_history')
          .insert({ user_id: user.id, question: q, answer })
          .select('id, question, answer, created_at')
          .single();
        if (saveErr) {
          toast.error('تم الرد لكن تعذر حفظ السؤال في السجل');
        } else if (saved) {
          setHistory((prev) => [saved as HistoryItem, ...prev]);
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'تعذر الحصول على إجابة');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('ask_me_history').delete().eq('id', id);
    if (error) {
      toast.error('تعذر الحذف');
      return;
    }
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const clearHistory = async () => {
    if (!user) return;
    const { error } = await supabase.from('ask_me_history').delete().eq('user_id', user.id);
    if (error) {
      toast.error('تعذر مسح السجل');
      return;
    }
    setHistory([]);
    toast.success('تم مسح السجل');
  };

  return (
    <Card id="ask-me" className="mt-10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-xl">
          <span className="flex items-center gap-2">
            <MessagesSquare className="h-5 w-5 text-primary" />
            اسألني
          </span>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="gap-1">
              <Trash2 className="h-4 w-4" />
              مسح المحادثة
            </Button>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          اسأل عن أي شيء مهما كان: صحة، تغذية، جيم، علاج طبيعي، دراسة، أو أي موضوع عام — وسأجيبك بتفصيل وخطوات عملية.
          {user ? ' كل سؤال وإجابته بيُحفظ في سجلك عشان ترجع له في أي وقت.' : ''}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Button key={s} variant="outline" size="sm" onClick={() => ask(s)} disabled={loading}>
                {s}
              </Button>
            ))}
          </div>
        )}

        {messages.length > 0 && (
          <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-lg border border-border p-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-end' : 'text-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'inline-block max-w-[90%] rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground'
                      : 'inline-block max-w-full whitespace-pre-wrap text-sm leading-relaxed text-foreground'
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التفكير...
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                ask(input);
              }
            }}
            placeholder="اكتب أي سؤال..."
            rows={2}
            className="flex-1 resize-none"
            disabled={loading}
          />
          <Button onClick={() => ask(input)} disabled={loading} className="gap-2 sm:self-end">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            إرسال
          </Button>
        </div>

        {user && (
          <div className="rounded-lg border border-border">
            <div className="flex items-center justify-between gap-2 p-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setShowHistory((v) => !v)}
              >
                <History className="h-4 w-4" />
                سجل أسئلتي ({history.length})
                {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {history.length > 0 && showHistory && (
                <Button variant="ghost" size="sm" className="gap-1 text-destructive" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4" />
                  مسح السجل
                </Button>
              )}
            </div>

            {showHistory && (
              <div className="max-h-[420px] space-y-3 overflow-y-auto border-t border-border p-3">
                {history.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">لا توجد أسئلة محفوظة بعد</p>
                ) : (
                  history.map((h) => (
                    <div key={h.id} className="rounded-lg bg-muted/40 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="flex-1 text-sm font-semibold">{h.question}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => deleteItem(h.id)}
                          aria-label="حذف"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {h.answer}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(h.created_at).toLocaleString('ar-EG')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
