import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_AUTH = 20;
const RATE_LIMIT_GUEST = 5;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (entry.count >= limit) {
    return false;
  }
  
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history, imageBase64, imageType } = await req.json();
    
    // Determine if authenticated
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    let isGuest = true;

    if (authHeader?.startsWith('Bearer ')) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      });

      const token = authHeader.replace('Bearer ', '');
      const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
      
      if (!claimsError && claimsData?.claims) {
        userId = claimsData.claims.sub as string;
        isGuest = false;
      }
    }

    // Rate limit based on auth status
    const rateLimitKey = userId || (req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown');
    const limit = isGuest ? RATE_LIMIT_GUEST : RATE_LIMIT_AUTH;
    
    if (!checkRateLimit(rateLimitKey, limit)) {
      return new Response(JSON.stringify({ 
        error: isGuest 
          ? 'تم تجاوز الحد المسموح للزوار. سجل دخولك للحصول على المزيد من الرسائل.' 
          : 'تم تجاوز الحد المسموح. يرجى الانتظار دقيقة.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received message from:", userId || "guest");

    const systemPrompt = `أنت مساعد طبي ذكي ومتخصص لموقع "إسعفني" المصري. أنت طبيب افتراضي يتميز بالدقة والتعاطف.

قدراتك ومهامك:

1. **التشخيص الأولي**: استمع للأعراض بعناية واقترح الأمراض المحتملة مع التأكيد على أهمية زيارة الطبيب.

2. **العلاجات والأدوية**: قدم معلومات عن الأدوية المناسبة مع الجرعات والاحتياطات، لكن أكد دائماً على استشارة الصيدلي أو الطبيب.

3. **تحليل الصور الطبية**: إذا أرسل لك المستخدم صورة لدواء، اشرح اسمه واستخداماته وجرعاته والآثار الجانبية. إذا كانت صورة لأعراض جلدية أو إصابة، حاول تحديد الحالة واقترح العلاج المناسب مع التأكيد على زيارة الطبيب.

4. **الإسعافات الأولية**: قدم إرشادات مفصلة وعملية للتعامل مع الحالات الطارئة.

5. **الصحة النفسية**: تعامل بحساسية مع المشاكل النفسية وقدم الدعم النفسي الأولي.

6. **النظام الغذائي**: قدم نصائح غذائية مخصصة بناءً على الحالة الصحية.

7. **أرقام الطوارئ المصرية**:
   - الإسعاف: 123
   - الشرطة: 122
   - الإطفاء: 180
   - النجدة: 128
   - الغاز: 129

أسلوب الرد:
- استخدم اللغة العربية الفصحى السهلة
- كن ودوداً ومتعاطفاً
- قدم إجابات شاملة ومفصلة
- استخدم النقاط والترقيم لتنظيم المعلومات
- أضف إيموجي مناسبة للتوضيح 🏥💊🩺
- انصح دائماً بزيارة الطبيب للحالات الخطيرة

تحذير مهم: أنت لست بديلاً عن الطبيب الحقيقي. أكد دائماً على أهمية الاستشارة الطبية المتخصصة.`;

    // Build messages array
    const messages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    if (history && Array.isArray(history)) {
      history.forEach((msg: { role: string; content: string }) => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    // Build the user message content (text + optional image)
    if (imageBase64) {
      const mimeType = imageType || 'image/jpeg';
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message || "ما هذا؟ اشرح لي هذه الصورة من الناحية الطبية." },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
        ]
      });
    } else {
      messages.push({ role: "user", content: message });
    }

    // Use vision-capable model when image is present
    const model = imageBase64 ? "openai/gpt-5.6-sol" : "openai/gpt-5.6-sol";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, reasoning_effort: "none", messages }),
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
    const aiResponse = data.choices?.[0]?.message?.content || "عذراً، لم أستطع معالجة طلبك.";
    
    console.log("AI response generated for:", userId || "guest");

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "خطأ غير معروف" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
