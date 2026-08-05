import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Trash2, Maximize2, Minimize2, Loader2, MessageCircle, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  text: string;
  isBot: boolean;
  imageUrl?: string;
}

const SUGGESTED_QUESTIONS = [
  'ما هي أعراض الإنفلونزا؟',
  'كيف أتعامل مع الحروق؟',
  'ما هي أرقام الطوارئ؟',
  'ما هي أعراض الاكتئاب؟'
];

const STORAGE_KEY = 'es3efny_chat_history';
const GUEST_MSG_COUNT_KEY = 'es3efny_guest_msg_count';
const GUEST_MSG_LIMIT = 5;

interface SiteGuideBotProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export const SiteGuideBot = ({ onOpenChange }: SiteGuideBotProps = {}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [{ text: 'مرحباً! أنا طمنّي 🏥 مساعدك الصحي الذكي\n\nكيف يمكنني مساعدتك اليوم؟', isBot: true }];
  });
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ base64: string; type: string; preview: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);
  useEffect(() => { onOpenChange?.(isOpen); }, [isOpen, onOpenChange]);

  const getGuestMessageCount = (): number => {
    try { return parseInt(localStorage.getItem(GUEST_MSG_COUNT_KEY) || '0', 10); } catch { return 0; }
  };

  const incrementGuestMessageCount = () => {
    const current = getGuestMessageCount();
    localStorage.setItem(GUEST_MSG_COUNT_KEY, String(current + 1));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "خطأ", description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setSelectedImage({ base64, type: file.type, preview: result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if ((!textToSend.trim() && !selectedImage) || isProcessing) return;

    const userMessage: Message = {
      text: textToSend || (selectedImage ? '📷 صورة مرفقة' : ''),
      isBot: false,
      imageUrl: selectedImage?.preview
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const isGuest = !session?.access_token;

      if (isGuest) {
        const guestCount = getGuestMessageCount();
        if (guestCount >= GUEST_MSG_LIMIT) {
          const botMessage: Message = {
            text: `لقد استخدمت ${GUEST_MSG_LIMIT} رسائل مجانية. سجل دخولك للحصول على رسائل غير محدودة! 🔐\n\nيمكنك التسجيل من خلال زر "تسجيل الدخول" في أعلى الصفحة.`,
            isBot: true
          };
          setMessages(prev => [...prev, botMessage]);
          setIsProcessing(false);
          return;
        }
      }

      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.isBot ? 'assistant' : 'user',
        content: m.text
      }));

      const body: any = {
        message: textToSend || (currentImage ? "ما هذا؟ اشرح لي هذه الصورة من الناحية الطبية." : ''),
        history: conversationHistory
      };

      if (currentImage) {
        body.imageBase64 = currentImage.base64;
        body.imageType = currentImage.type;
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: 'POST',
          headers: {
            ...headers,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'حدث خطأ في الاتصال');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const botResponse = data?.response || 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
      const botMessage: Message = { text: botResponse, isBot: true };
      setMessages(prev => [...prev, botMessage]);

      if (isGuest) incrementGuestMessageCount();
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      toast({ title: "خطأ", description: errorMessage, variant: "destructive" });
      const botMessage: Message = { text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    const initialMessage: Message = { text: 'مرحباً! أنا طمنّي 🏥 مساعدك الصحي الذكي\n\nكيف يمكنني مساعدتك اليوم؟', isBot: true };
    setMessages([initialMessage]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    toast({ title: "تم مسح المحادثة", description: "تم حذف سجل المحادثة من هذا الجهاز" });
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsFullScreen(false);
  };

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 h-11 w-11 rounded-full shadow-lg z-50 bg-gradient-to-r from-primary to-accent hover:scale-105 transition-transform"
        size="icon"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card dir="rtl" className={`fixed z-50 flex flex-col overflow-hidden border border-primary/20 shadow-xl transition-all duration-300 ease-in-out
          ${isFullScreen
            ? 'inset-0 rounded-none'
            : 'bottom-4 left-4 right-4 top-20 rounded-xl sm:top-auto sm:right-auto sm:bottom-4 sm:left-4 sm:w-80 sm:h-[420px]'
          }
        `}>
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="h-5 w-5" />
                <Sparkles className="h-2 w-2 absolute -top-1 -right-1 text-yellow-300" />
              </div>
              <span className="font-semibold text-sm">طمنّي</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(!isFullScreen)} className="h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground" title={isFullScreen ? "تصغير" : "ملء الشاشة"}>
                {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={clearHistory} className="h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground" title="مسح المحادثة">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={closeChat} className="h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground" title="إغلاق">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-background to-accent/5">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl shadow-sm ${
                    message.isBot
                      ? 'bg-card text-card-foreground rounded-tr-sm border border-border/50'
                      : 'bg-primary text-primary-foreground rounded-tl-sm'
                  }`}
                >
                  {message.imageUrl && (
                    <img src={message.imageUrl} alt="مرفق" className="max-w-full rounded-lg mb-1.5 max-h-32 object-cover" />
                  )}
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl rounded-tr-sm bg-card border border-border/50 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">يفكر...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="px-2 py-1.5 border-t bg-accent/10 flex items-center gap-2">
              <img src={selectedImage.preview} alt="معاينة" className="h-10 w-10 rounded object-cover" />
              <span className="text-xs text-muted-foreground flex-1">صورة مرفقة</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedImage(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Suggested Questions */}
          <div className="px-2 py-1.5 border-t bg-accent/5">
            <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(question)}
                  disabled={isProcessing}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-2 border-t bg-card">
            <div className="flex gap-1.5">
              <Button
                onClick={() => imageInputRef.current?.click()}
                size="icon"
                variant="outline"
                className="rounded-full h-8 w-8 shrink-0"
                disabled={isProcessing}
                title="إرسال صورة"
              >
                <ImageIcon className="h-3.5 w-3.5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك..."
                className="flex-1 rounded-full h-8 text-xs"
                disabled={isProcessing}
              />
              <Button
                onClick={() => handleSend()}
                size="icon"
                className="rounded-full h-8 w-8 shrink-0"
                disabled={isProcessing || (!input.trim() && !selectedImage)}
              >
                {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
