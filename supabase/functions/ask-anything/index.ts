import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 25;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `أنت "اسألني" — مساعد ذكي عالي الكفاءة داخل موقع "إسعفني" المصري، وتجيب على أي سؤال مهما كان مجاله: طب، صحة نفسية، تغذية، رياضة وجيم، علاج طبيعي، دراسة، برمجة، قوانين عامة، حساب ورياضيات، ترجمة، نصائح حياتية، معلومات عامة، وأي موضوع آخر.

قواعد الجودة (التزم بها بدقة):
1. فكّر خطوة بخطوة داخليًا قبل الإجابة، ثم اعرض النتيجة النهائية منظمة وواضحة.
2. ابدأ بإجابة مباشرة في سطر أو سطرين، ثم التفاصيل بنقاط أو خطوات مرقمة.
3. في الأسئلة الحسابية أو المنطقية اعرض خطوات الحل والنتيجة النهائية بشكل واضح.
4. لو السؤال ناقص معلومات، افترض أرجح احتمال وأجب عليه، واذكر في النهاية سؤال توضيحي واحد فقط.
5. لا تخترع معلومات. لو معلومة غير مؤكدة أو تحتاج مصدر حديث، قل ذلك صراحةً بجملة قصيرة.
6. الأسئلة الطبية: أعطِ معلومات دقيقة وعملية (أسباب محتملة، ما يمكن عمله الآن، علامات الخطر التي تستوجب الطوارئ)، وانصح بمراجعة طبيب مختص في الحالات الخطيرة أو المستمرة، بدون تشخيص قاطع.
7. أرقام الطوارئ في مصر: الإسعاف 123، الشرطة 122، الإطفاء 180، النجدة 128.
8. اكتب بالعربية الفصحى السهلة (أو الإنجليزية إذا سأل المستخدم بالإنجليزية)، بأسلوب ودود ومختصر بدون حشو أو تكرار.
9. اجعل الإجابة كاملة وقابلة للتنفيذ: خطوات، أمثلة، أرقام، ونصائح محددة بدل الكلام العام.
10. ارفض بلطف فقط ما هو خطير أو غير قانوني بشكل صريح، واقترح بديلًا آمنًا.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'يرجى تسجيل الدخول' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: claimsError } = await supabase.auth.getUser(token);
    const userId = userData?.user?.id;
    if (claimsError || !userId) {
      console.error('auth error:', claimsError);
      return new Response(JSON.stringify({ error: 'جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!checkRateLimit(userId)) {
      return new Response(JSON.stringify({ error: 'عدد كبير من الأسئلة، انتظر دقيقة ثم حاول مرة أخرى.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    const history = Array.isArray(body?.history) ? body.history.slice(-10) : [];

    if (question.length < 2 || question.length > 4000) {
      return new Response(JSON.stringify({ error: 'اكتب سؤالك (من حرفين حتى 4000 حرف)' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history
        .filter((m: { role?: string; content?: string }) => m?.role && typeof m.content === 'string')
        .map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content.slice(0, 4000),
        })),
      { role: 'user', content: question },
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'openai/gpt-5.6-sol', reasoning_effort: 'none', messages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'الخدمة مشغولة الآن، حاول بعد قليل.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'انتهى رصيد الخدمة، يرجى المحاولة لاحقًا.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'حدث خطأ أثناء الحصول على الإجابة' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'عذرًا، لم أستطع تكوين إجابة. أعد صياغة السؤال.';

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ask-anything error:', error);
    return new Response(JSON.stringify({ error: 'خطأ غير متوقع' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
