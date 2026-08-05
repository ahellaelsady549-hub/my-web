import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'غير مصرح. يرجى تسجيل الدخول.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');

    const anon = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );
    const { data: userData, error: userError } = await anon.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'جلسة غير صالحة.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Remove user-owned rows that are not cascade-deleted with auth.users.
    const tables = [
      'gym_food_logs', 'gym_workout_logs', 'gym_user_program', 'gym_video_analyses',
      'gym_nutrition_goals', 'user_diseases', 'user_medications', 'user_diet_plans',
      'user_personality_results', 'community_posts', 'community_likes', 'doctors',
    ];
    for (const table of tables) {
      const { error } = await admin.from(table).delete().eq('user_id', userId);
      if (error) console.error(`cleanup ${table}`, error.message);
    }

    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      console.error('deleteUser', delErr.message);
      return new Response(JSON.stringify({ error: 'تعذّر حذف الحساب. حاول مرة أخرى.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('delete-account error', error);
    return new Response(JSON.stringify({ error: 'خطأ غير متوقع' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
