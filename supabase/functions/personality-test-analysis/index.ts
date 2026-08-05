import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per hour for personality tests
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'غير مصرح. يرجى تسجيل الدخول.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    
    if (claimsError || !claimsData?.user) {
      return new Response(JSON.stringify({ error: 'جلسة غير صالحة. يرجى إعادة تسجيل الدخول.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.user.id;

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return new Response(JSON.stringify({ 
        analysis: 'تم تجاوز الحد المسموح. يمكنك إجراء 5 اختبارات في الساعة.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { answers, score, categoryScores, suggestedDiseases } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Calling AI for personality analysis, user:', userId);

    const systemPrompt = `أنت طبيب نفسي خبير متخصص في تحليل الاختبارات النفسية والتشخيص المبدئي.
    
مهمتك:
1. تحليل دقيق وعميق لإجابات المستخدم
2. تحديد الأنماط السلوكية والنفسية
3. ربط الإجابات بالاضطرابات النفسية المحتملة
4. تقديم تفسير علمي للنتائج
5. اقتراح خطوات عملية للتحسين

يجب أن يكون التحليل:
- علمي ومبني على معايير DSM-5
- شامل لجميع جوانب الصحة النفسية
- متضمن لتوصيات عملية محددة
- داعم ومشجع للمستخدم
- واضح وسهل الفهم

اكتب بالعربية الفصحى السهلة بأسلوب مهني وودي.`;

    const userPrompt = `قم بتحليل نفسي شامل ودقيق لهذه النتائج:

📊 النتيجة الإجمالية: ${score}% من مؤشرات القلق النفسي

📝 تفاصيل الإجابات:
${answers}

📈 تحليل الفئات:
${Object.entries(categoryScores).map(([cat, val]) => `- ${cat}: ${(val as number).toFixed(1)}/4`).join('\n')}

🔍 الاضطرابات المكتشفة: ${suggestedDiseases.join('، ')}

قدم تحليلاً شاملاً (300-400 كلمة) يتضمن:

1️⃣ **التقييم النفسي العام:**
- وصف الحالة النفسية الحالية
- نقاط القوة النفسية
- المجالات التي تحتاج اهتمام

2️⃣ **تحليل الأنماط السلوكية:**
- الأنماط الفكرية السائدة
- ردود الفعل العاطفية
- السلوكيات المتكررة

3️⃣ **التفسير العلمي:**
- ربط الأعراض بالاضطرابات المحتملة
- شرح مبسط للحالة

4️⃣ **خطة العلاج المقترحة:**
- تقنيات يومية للتحسين
- تمارين ذهنية محددة
- عادات صحية موصى بها

5️⃣ **متى تطلب المساعدة المتخصصة:**
- العلامات التحذيرية
- أنواع المختصين المناسبين`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5.6-sol',
        reasoning_effort: 'none',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          analysis: 'عذراً، الخدمة مشغولة حالياً. يرجى المحاولة لاحقاً.' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          analysis: 'عذراً، يرجى المحاولة لاحقاً.' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || 'تعذر إجراء التحليل. يرجى المحاولة مرة أخرى.';

    console.log('AI analysis completed for user:', userId);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in personality-test-analysis:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      analysis: 'تعذر إجراء التحليل بالذكاء الاصطناعي. النتائج المعروضة مبنية على إجاباتك فقط.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
