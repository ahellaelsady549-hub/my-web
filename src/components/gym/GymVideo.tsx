import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Video, Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/** Extract evenly spaced frames from a local video file as JPEG data URLs. */
async function extractFrames(file: File, count = 5): Promise<string[]> {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = url;
  video.muted = true;
  video.playsInline = true;

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error('تعذّر قراءة الفيديو'));
  });

  const duration = video.duration && isFinite(video.duration) ? video.duration : 1;
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 640 / (video.videoWidth || 640));
  canvas.width = Math.round((video.videoWidth || 640) * scale);
  canvas.height = Math.round((video.videoHeight || 360) * scale);
  const ctx = canvas.getContext('2d')!;
  const frames: string[] = [];

  for (let i = 0; i < count; i++) {
    const t = (duration * (i + 0.5)) / count;
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
      video.currentTime = Math.min(t, Math.max(0, duration - 0.05));
    });
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    frames.push(canvas.toDataURL('image/jpeg', 0.7));
  }

  URL.revokeObjectURL(url);
  return frames;
}

export const GymVideo = () => {
  const { user } = useAuth();
  const [exercise, setExercise] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('gym_video_analyses').select('*')
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
    setHistory(data ?? []);
  };

  useEffect(() => { loadHistory(); }, [user]);

  const handleVideo = async (file: File) => {
    if (!user) return;
    if (!exercise.trim()) { toast.error('اكتب اسم التمرين أولاً'); return; }
    if (file.size > 60 * 1024 * 1024) { toast.error('حجم الفيديو كبير (الحد 60 ميجا)'); return; }

    setLoading(true);
    setAnalysis('');
    let videoPath: string | null = null;
    try {
      const frames = await extractFrames(file);

      const ext = file.name.split('.').pop() || 'mp4';
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('gym-videos').upload(path, file, {
        contentType: file.type || 'video/mp4',
      });
      if (!upErr) videoPath = path;

      const { data, error } = await supabase.functions.invoke('gym-video-analyze', {
        body: { exerciseName: exercise, frames },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAnalysis(data.analysis);
      await supabase.from('gym_video_analyses').insert({
        user_id: user.id, exercise_name: exercise, video_path: videoPath, analysis: data.analysis,
      });
      loadHistory();
      toast.success('تم تحليل التمرين');
    } catch (e: any) {
      toast.error(e?.message || 'تعذّر تحليل الفيديو');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="h-5 w-5 text-primary" />
            ارفع فيديو التمرين والذكاء الاصطناعي يحلل أدائك
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="اسم التمرين (مثال: سكوات خلفي)" value={exercise} onChange={(e) => setExercise(e.target.value)} />
          <Button onClick={() => fileRef.current?.click()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin ms-2" /> : <Upload className="h-4 w-4 ms-2" />}
            {loading ? 'جاري التحليل...' : 'اختر فيديو'}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideo(f); e.target.value = ''; }}
          />
          <p className="text-xs text-muted-foreground">
            يتم استخراج لقطات من الفيديو وتحليلها. الفيديو محفوظ بشكل خاص لك فقط.
          </p>
          {analysis && (
            <div className="rounded-lg border border-border p-4 text-sm whitespace-pre-wrap">{analysis}</div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">تحليلاتي السابقة</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="rounded-md bg-muted/40 p-3 text-sm">
                <b>{h.exercise_name}</b>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{h.analysis}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
