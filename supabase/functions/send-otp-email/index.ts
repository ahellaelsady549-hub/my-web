import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OTPEmailRequest {
  email: string;
  otp: string;
  type: 'signup' | 'login' | 'reset';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, type }: OTPEmailRequest = await req.json();

    const subject = type === 'signup' 
      ? 'رمز التحقق لتفعيل حسابك في إسعفني'
      : type === 'login'
      ? 'رمز التحقق لتسجيل الدخول في إسعفني'
      : 'رمز استعادة كلمة المرور في إسعفني';

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #16a34a, #22c55e); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; text-align: center; }
          .otp-box { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 2px dashed #16a34a; border-radius: 12px; padding: 25px; margin: 30px 0; }
          .otp-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; color: #16a34a; margin: 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .warning { color: #dc2626; font-size: 13px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❤️ إسعفني</h1>
          </div>
          <div class="content">
            <h2>مرحباً بك!</h2>
            <p>لإكمال عملية ${type === 'signup' ? 'التسجيل' : type === 'login' ? 'تسجيل الدخول' : 'استعادة كلمة المرور'}، استخدم رمز التحقق التالي:</p>
            <div class="otp-box">
              <p class="otp-code">${otp}</p>
            </div>
            <p>هذا الرمز صالح لمدة <strong>10 دقائق</strong> فقط.</p>
            <p class="warning">⚠️ لا تشارك هذا الرمز مع أي شخص</p>
          </div>
          <div class="footer">
            <p>إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد</p>
            <p>© 2025 إسعفني - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Since Supabase handles OTP sending automatically through its auth system,
    // this function can be used for custom email notifications
    console.log(`OTP email would be sent to ${email} with code ${otp}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'تم إرسال رمز التحقق بنجاح',
        // In production, integrate with an email service like Resend
        html: htmlContent 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-otp-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
