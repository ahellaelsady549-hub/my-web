import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (limit.count >= RATE_LIMIT) return false;
  limit.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'غير مصرح. يرجى تسجيل الدخول.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'جلسة غير صالحة. يرجى إعادة تسجيل الدخول.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    if (!checkRateLimit(userId)) {
      return new Response(JSON.stringify({ error: 'تم تجاوز الحد المسموح. يمكنك تحليل 10 فيديوهات في الساعة.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const { exerciseName, frames } = await req.json();
    if (!Array.isArray(frames) || frames.length === 0) {
      return new Response(JSON.stringify({ error: 'لم يتم استخراج صور من الفيديو.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validFrames = (frames as string[])
      .filter((f) => typeof f === 'string' && f.startsWith('data:image/'))
      .slice(0, 6);
    if (validFrames.length === 0) {
      return new Response(JSON.stringify({ error: 'صور الفيديو غير صالحة.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-5.6-sol',
        reasoning_effort: 'none',
        messages: [
          {
            role: 'system',
            content: 'أنت مدرب لياقة ورفع أثقال محترف. تحصل على لقطات متتالية من فيديو تمرين. حلّل الأداء بالعربية في نقاط: 1) تقييم عام من 10، 2) الأخطاء الملاحظة، 3) تصحيحات واضحة خطوة بخطوة، 4) نصائح لتجنب الإصابة. إذا كانت اللقطات غير واضحة قل ذلك بصراحة. لا تقدّم تشخيصاً طبياً.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: `التمرين: ${String(exerciseName ?? 'غير محدد').slice(0, 120)}. حلّل الأداء وأعطني التحسينات.` },
              ...validFrames.map((f) => ({ type: 'image_url', image_url: { url: f } })),
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error('AI error', res.status, t);
      const msg = res.status === 429 ? 'تم تجاوز الحد المسموح. حاول لاحقاً.'
        : res.status === 402 ? 'يرجى إضافة رصيد للمتابعة.' : 'حدث خطأ في الاتصال';
      return new Response(JSON.stringify({ error: msg }), {
        status: res.status === 429 || res.status === 402 ? res.status : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    console.log('video analysis done for user', userId);
    return new Response(JSON.stringify({ analysis: data.choices?.[0]?.message?.content ?? '' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('gym-video-analyze error', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'خطأ غير معروف' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
