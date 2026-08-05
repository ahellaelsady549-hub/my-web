import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Dumbbell, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { gymPrograms, getProgram } from '@/data/gymPrograms';
import { useAuth } from '@/contexts/AuthContext';

const todayISO = () => new Date().toISOString().slice(0, 10);

export const GymPrograms = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      const [{ data: prog }, { data: logs }] = await Promise.all([
        supabase.from('gym_user_program').select('program_key').eq('user_id', user.id).maybeSingle(),
        supabase.from('gym_workout_logs').select('day_key, exercise_name, completed').eq('user_id', user.id).eq('log_date', todayISO()),
      ]);
      if (prog?.program_key) {
        setSelected(prog.program_key);
        setActiveDay(getProgram(prog.program_key)?.days[0]?.key ?? null);
      }
      setDone(new Set((logs ?? []).filter((l) => l.completed).map((l) => `${l.day_key}|${l.exercise_name}`)));
      setLoading(false);
    };
    load();
  }, [user]);

  const chooseProgram = async (key: string) => {
    if (!user) return;
    setSelected(key);
    setActiveDay(getProgram(key)?.days[0]?.key ?? null);
    const { error } = await supabase
      .from('gym_user_program')
      .upsert({ user_id: user.id, program_key: key }, { onConflict: 'user_id' });
    if (error) toast.error('تعذّر حفظ النظام');
    else toast.success('تم اختيار النظام');
  };

  const toggleExercise = async (dayKey: string, exercise: string, checked: boolean) => {
    if (!user || !selected) return;
    const id = `${dayKey}|${exercise}`;
    const next = new Set(done);
    checked ? next.add(id) : next.delete(id);
    setDone(next);
    if (checked) {
      const { error } = await supabase.from('gym_workout_logs').upsert({
        user_id: user.id, program_key: selected, day_key: dayKey,
        exercise_name: exercise, log_date: todayISO(), completed: true,
      }, { onConflict: 'user_id,log_date,day_key,exercise_name' });
      if (error) toast.error('تعذّر حفظ التمرين');
    } else {
      await supabase.from('gym_workout_logs').delete()
        .eq('user_id', user.id).eq('log_date', todayISO())
        .eq('day_key', dayKey).eq('exercise_name', exercise);
    }
  };

  const program = selected ? getProgram(selected) : null;
  const day = program?.days.find((d) => d.key === activeDay) ?? program?.days[0];

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gymPrograms.map((p) => (
          <Card
            key={p.key}
            className={`cursor-pointer transition-all hover:shadow-lg ${selected === p.key ? 'border-primary ring-2 ring-primary/30' : ''}`}
            onClick={() => chooseProgram(p.key)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-start justify-between gap-2">
                <span>{p.name}</span>
                {selected === p.key && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{p.level}</Badge>
                <Badge variant="outline">{p.daysPerWeek}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{p.bestFor}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {program && day && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Dumbbell className="h-5 w-5 text-primary" />
              جدول {program.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {program.days.map((d) => (
                <Button
                  key={d.key}
                  size="sm"
                  variant={d.key === day.key ? 'default' : 'outline'}
                  onClick={() => setActiveDay(d.key)}
                >
                  {d.name}
                </Button>
              ))}
            </div>

            <div className="rounded-lg border border-border p-4 space-y-3">
              <div>
                <h3 className="font-semibold">{day.name}</h3>
                <p className="text-sm text-muted-foreground">العضلات: {day.muscles}</p>
              </div>
              <div className="space-y-2">
                {day.exercises.map((ex) => {
                  const id = `${day.key}|${ex}`;
                  const checked = done.has(id);
                  return (
                    <label
                      key={ex}
                      className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => toggleExercise(day.key, ex, Boolean(v))}
                      />
                      <span className={`text-sm ${checked ? 'line-through text-muted-foreground' : ''}`}>{ex}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                يتم حفظ تشيك تمارين اليوم تلقائياً ({todayISO()}).
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
