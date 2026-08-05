import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
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
      return new Response(JSON.stringify({ error: 'تم تجاوز الحد المسموح. حاول بعد قليل.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const body = await req.json();
    const mode: string = body.mode ?? 'text';

    // ---- High-protein meal suggestions -------------------------------------
    if (mode === 'suggest') {
      const question = String(body.question ?? '').slice(0, 800);
      const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai/gpt-5.6-sol',
          reasoning_effort: 'none',
          messages: [
            {
              role: 'system',
              content: 'أنت خبير تغذية رياضية مصري. اقترح وجبات متوفرة في مصر بأعلى كمية بروتين وبأسعار مناسبة. اكتب بالعربية بشكل منظّم: اسم الوجبة، المكونات بالكميات (جرام)، البروتين والسعرات التقديرية، وطريقة تحضير سريعة. لا تكتب أي تشخيص طبي.',
            },
            { role: 'user', content: question || 'اقترح لي وجبات بأعلى كمية بروتين ممكنة.' },
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
      return new Response(JSON.stringify({ answer: data.choices?.[0]?.message?.content ?? '' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---- Nutrition analysis (text or image) --------------------------------
    const systemPrompt = `أنت خبير تغذية. حلّل الوجبة وقدّر القيم الغذائية ومستوى خطورتها على الدايت.
أعد JSON فقط بهذا الشكل بدون أي شرح إضافي:
{
  "name": "اسم الوجبة بالعربية",
  "ingredients": "المكونات مع الكميات",
  "quantityGrams": number,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "riskLevel": "منخفض" | "متوسط" | "عالي",
  "riskReason": "سبب مستوى الخطورة على الدايت",
  "notes": "نصائح قصيرة لتحسين الوجبة"
}`;

    let userContent: unknown;
    if (mode === 'image') {
      const imageUrl = String(body.imageBase64 ?? '');
      if (!imageUrl.startsWith('data:image/')) {
        return new Response(JSON.stringify({ error: 'صورة غير صالحة.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      userContent = [
        { type: 'text', text: `حلّل الأكل في الصورة${body.note ? ` — ملاحظة المستخدم: ${String(body.note).slice(0, 300)}` : ''}. أعد JSON فقط.` },
        { type: 'image_url', image_url: { url: imageUrl } },
      ];
    } else {
      const name = String(body.name ?? '').slice(0, 200);
      const ingredients = String(body.ingredients ?? '').slice(0, 1000);
      const quantity = String(body.quantityGrams ?? '');
      if (!name && !ingredients) {
        return new Response(JSON.stringify({ error: 'اكتب اسم الوجبة أو مكوناتها.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      userContent = `الوجبة: ${name}\nالمكونات والكميات: ${ingredients}\nالكمية الإجمالية بالجرام: ${quantity}\nأعد JSON فقط.`;
    }

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-5.6-sol',
        reasoning_effort: 'none',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
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
    const raw = data.choices?.[0]?.message?.content ?? '';
    let analysis;
    try {
      const match = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(match ? (match[1] || match[0]) : raw);
    } catch (e) {
      console.error('parse error', e);
      return new Response(JSON.stringify({ error: 'تعذّر تحليل الوجبة، حاول مرة أخرى.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('gym-food-analyze error', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'خطأ غير معروف' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
