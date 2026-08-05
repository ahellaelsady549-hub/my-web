import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: 10 requests per hour per user
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

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
      return new Response(JSON.stringify({ error: 'تم تجاوز الحد المسموح (10 تشخيصات في الساعة). يرجى المحاولة لاحقاً.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { symptoms, symptomType } = await req.json();
    
    // Input validation
    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'يرجى وصف الأعراض بالتفصيل (10 أحرف على الأقل).' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (symptoms.length > 2000) {
      return new Response(JSON.stringify({ error: 'وصف الأعراض طويل جداً (الحد الأقصى 2000 حرف).' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Diagnosis request from user:", userId, "Type:", symptomType);

    const typeContext = symptomType === 'mental' 
      ? 'الأعراض النفسية والعقلية' 
      : symptomType === 'physical' 
        ? 'الأعراض الجسدية' 
        : 'الأعراض بشكل عام';

    const systemPrompt = `أنت طبيب متخصص في التشخيص الطبي لموقع "إسعفني" المصري. مهمتك هي تحليل ${typeContext} التي يصفها المستخدم وتقديم تشخيص أولي احترافي.

## مهامك:

1. **تحليل الأعراض**: اقرأ الأعراض بعناية وحللها طبياً.

2. **التشخيص المحتمل**: قدم قائمة بالأمراض المحتملة مع نسبة احتمالية تقريبية.

3. **التوصيات**: قدم نصائح فورية للتعامل مع الحالة.

4. **متى تزور الطبيب**: حدد إن كانت الحالة تستدعي زيارة طبيب فورية أم لا.

5. **العلاجات الأولية**: اقترح علاجات منزلية أو أدوية بدون وصفة طبية إن أمكن.

## تنسيق الرد:

📋 **تحليل الأعراض:**
[تحليل مفصل للأعراض المذكورة]

🔍 **التشخيص المحتمل:**
1. [المرض الأول] - نسبة الاحتمالية: XX%
2. [المرض الثاني] - نسبة الاحتمالية: XX%
3. [المرض الثالث] - نسبة الاحتمالية: XX%

💊 **التوصيات الفورية:**
- [نصيحة 1]
- [نصيحة 2]
- [نصيحة 3]

🏥 **هل تحتاج زيارة طبيب؟**
[نعم/لا مع التوضيح]

🩺 **العلاجات المقترحة:**
- [علاج 1]
- [علاج 2]

⚠️ **تحذير مهم:**
هذا تشخيص أولي بناءً على الأعراض المذكورة فقط. يرجى استشارة طبيب متخصص للتشخيص الدقيق والعلاج المناسب.

## ملاحظات:
- استخدم اللغة العربية الفصحى السهلة
- كن دقيقاً ومهنياً
- لا تقلل من أهمية أي عرض
- إذا كانت الأعراض خطيرة، أكد على ضرورة الذهاب للطوارئ فوراً
- أرقام الطوارئ المصرية: الإسعاف 123، الشرطة 122`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.6-sol",
        reasoning_effort: "none",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `أشعر بالأعراض التالية:\n\n${symptoms}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إضافة رصيد للمتابعة." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "حدث خطأ في الاتصال" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const diagnosis = data.choices?.[0]?.message?.content || "عذراً، لم أستطع تحليل الأعراض.";
    
    console.log("Diagnosis generated for user:", userId);

    return new Response(JSON.stringify({ diagnosis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-diagnosis function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "خطأ غير معروف" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
