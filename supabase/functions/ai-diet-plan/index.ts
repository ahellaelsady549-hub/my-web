import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per hour for diet plans
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
      return new Response(JSON.stringify({ error: 'تم تجاوز الحد المسموح. يمكنك إنشاء 10 أنظمة غذائية في الساعة.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { height, weight, age, gender, activityLevel, goal } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating AI diet plan for user:", userId);

    // Calculate BMI and determine body type
    const bmi = weight / Math.pow(height / 100, 2);
    let bodyType = 'normal';
    let goalDescription = '';
    
    if (bmi < 18.5) {
      bodyType = 'underweight';
      goalDescription = 'جسمك نحيف - سنعمل على زيادة وزنك بشكل صحي للوصول للوزن المثالي';
    } else if (bmi >= 18.5 && bmi < 25) {
      bodyType = 'normal';
      goalDescription = 'وزنك مثالي - سنعمل على الحفاظ عليه مع تحسين التغذية';
    } else {
      bodyType = 'overweight';
      goalDescription = 'لديك وزن زائد - سنعمل على تقليله تدريجياً للوصول للوزن الصحي';
    }

    // Calculate ideal weight using Devine formula
    const idealWeight = gender === 'male' 
      ? 50 + 2.3 * ((height / 2.54) - 60)
      : 45.5 + 2.3 * ((height / 2.54) - 60);

    // Weekly weight change prediction
    let weeklyChange = 0;
    if (bodyType === 'underweight') weeklyChange = 0.5;
    else if (bodyType === 'overweight') weeklyChange = -0.5;

    const predictedWeightAfterMonth = weight + (weeklyChange * 4);

    const systemPrompt = `أنت خبير تغذية معتمد. قم بإنشاء نظام غذائي دقيق بناءً على نوع الجسم.

## بيانات المستخدم:
- نوع الجسم: ${bodyType === 'underweight' ? 'نحيف' : bodyType === 'normal' ? 'طبيعي' : 'وزن زائد'}
- BMI: ${bmi.toFixed(1)}
- الوزن الحالي: ${weight} كجم
- الوزن المثالي: ${Math.round(idealWeight)} كجم

## القواعد:
1. إذا كان الجسم نحيف: زد السعرات 500+ مع بروتين عالي
2. إذا كان الجسم طبيعي: حافظ على السعرات مع توازن الماكروز
3. إذا كان الجسم زائد: قلل السعرات 500- مع بروتين عالي للحفاظ على العضلات

أعد JSON فقط:
{
  "dailyCalories": number,
  "bmi": ${bmi.toFixed(1)},
  "bmiCategory": "${bmi < 18.5 ? 'نحيف' : bmi < 25 ? 'طبيعي' : bmi < 30 ? 'وزن زائد' : 'سمنة'}",
  "bodyType": "${bodyType}",
  "goalDescription": "${goalDescription}",
  "weightPrediction": {
    "currentWeight": ${weight},
    "targetWeight": ${Math.round(idealWeight)},
    "predictedWeightAfterMonth": ${predictedWeightAfterMonth.toFixed(1)},
    "weeklyChange": ${weeklyChange}
  },
  "macros": {
    "protein": number,
    "carbs": number,
    "fats": number,
    "fiber": number
  },
  "waterIntake": "X لتر",
  "breakfast": {
    "title": "وجبة الإفطار",
    "items": ["طعام (كمية) - سعرات"],
    "calories": number
  },
  "lunch": {
    "title": "وجبة الغداء",
    "items": ["..."],
    "calories": number
  },
  "dinner": {
    "title": "وجبة العشاء",
    "items": ["..."],
    "calories": number
  },
  "snacks": {
    "title": "الوجبات الخفيفة",
    "items": ["..."],
    "calories": number
  },
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3"],
  "avoid": ["طعام 1", "طعام 2"]
}`;

    const userPrompt = `البيانات:
- الطول: ${height} سم
- الوزن: ${weight} كجم
- العمر: ${age} سنة
- الجنس: ${gender === 'male' ? 'ذكر' : 'أنثى'}
- مستوى النشاط: ${activityLevel}
- نوع الجسم: ${bodyType === 'underweight' ? 'نحيف - يحتاج زيادة وزن' : bodyType === 'normal' ? 'طبيعي - للحفاظ' : 'زائد - يحتاج نقص وزن'}

أنشئ نظام غذائي مناسب لنوع الجسم. أعد JSON فقط.`;

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
          { role: "user", content: userPrompt }
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
    const aiResponse = data.choices?.[0]?.message?.content || "";
    
    console.log("AI diet plan generated for user:", userId);

    let dietPlan;
    try {
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiResponse;
      dietPlan = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(JSON.stringify({ error: "خطأ في معالجة النظام الغذائي" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ dietPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-diet-plan function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "خطأ غير معروف" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
