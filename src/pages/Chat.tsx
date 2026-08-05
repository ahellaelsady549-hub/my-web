import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { AdSlot } from '@/components/AdSlot';
import { 
  Send, 
  ArrowRight, 
  Paperclip, 
  Image as ImageIcon,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  content: string | null;
  file_url: string | null;
  file_type: string | null;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string | null;
  isDoctor: boolean;
}

const Chat = () => {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [otherParticipant, setOtherParticipant] = useState<Participant | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (conversationId) {
      fetchConversation();
      subscribeToMessages();
    }
  }, [conversationId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = async () => {
    if (!conversationId || !user) return;

    try {
      // Fetch conversation details
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Determine the other participant
      const isUserDoctor = conv.doctor_id === user.id;
      const otherUserId = isUserDoctor ? conv.user_id : conv.doctor_id;

      // Fetch other participant's profile
      if (isUserDoctor) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('user_id', otherUserId)
          .maybeSingle();
        
        setOtherParticipant({
          id: otherUserId,
          name: profile?.full_name || 'مستخدم',
          avatar: profile?.avatar_url,
          isDoctor: false
        });
      } else {
        const { data: doctor } = await supabase
          .from('doctors')
          .select('user_id')
          .eq('id', conv.doctor_id)
          .single();
        
        if (doctor) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', doctor.user_id)
            .maybeSingle();
          
          setOtherParticipant({
            id: doctor.user_id,
            name: profile?.full_name || 'طبيب',
            avatar: profile?.avatar_url,
            isDoctor: true
          });
        }
      }

      // Fetch messages
      const { data: msgs, error: msgsError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgsError) throw msgsError;
      setMessages(msgs || []);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل المحادثة',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const checkContentModeration = async (content: string): Promise<{ isSafe: boolean; reason?: string }> => {
    // Simple content moderation - check for inappropriate words
    const inappropriatePatterns = [
      /\b(سب|شتم|قذف|إساءة)\b/i,
      /\b(تهديد|قتل|ضرب)\b/i,
    ];

    for (const pattern of inappropriatePatterns) {
      if (pattern.test(content)) {
        return { isSafe: false, reason: 'محتوى غير لائق' };
      }
    }

    return { isSafe: true };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !conversationId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Check content moderation
      const moderation = await checkContentModeration(messageContent);

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: messageContent,
          is_flagged: !moderation.isSafe,
          flag_reason: moderation.reason || null
        });

      if (error) throw error;

      if (!moderation.isSafe) {
        toast({
          title: 'تحذير',
          description: 'تم إرسال رسالتك لكنها تم تمييزها للمراجعة',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الرسالة',
        variant: 'destructive'
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowRight className="w-5 h-5" />
          </Button>
          {otherParticipant && (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={otherParticipant.avatar || ''} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {otherParticipant.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">
                  {otherParticipant.isDoctor ? 'د. ' : ''}{otherParticipant.name}
                </h2>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-green-500" />
                  محادثة مشفرة
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <AdSlot id="chat-top" format="banner" className="my-2" />

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-start' : 'justify-end'}`}
              >
                <Card
                  className={`max-w-[80%] p-3 ${
                    isOwn 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } ${message.is_flagged ? 'border-yellow-500 border-2' : ''}`}
                >
                  {message.is_flagged && (
                    <div className="flex items-center gap-1 text-xs text-yellow-500 mb-1">
                      <AlertTriangle className="w-3 h-3" />
                      تم تمييز هذه الرسالة
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.file_url && (
                    <div className="mt-2">
                      {message.file_type?.startsWith('image/') ? (
                        <img 
                          src={message.file_url} 
                          alt="مرفق" 
                          className="max-w-full rounded-lg"
                        />
                      ) : (
                        <a 
                          href={message.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm underline"
                        >
                          تحميل المرفق
                        </a>
                      )}
                    </div>
                  )}
                  <span className={`text-xs ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'} mt-1 block`}>
                    {new Date(message.created_at).toLocaleTimeString('ar-EG', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </Card>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-background p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Input
            placeholder="اكتب رسالتك..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            size="icon" 
            className="bg-gradient-medical"
            onClick={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
