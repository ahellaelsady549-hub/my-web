import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Loader2, MessageCircle, Heart, Image as ImageIcon, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Header as SiteHeader } from '@/components/Header';
import { AdSlot } from '@/components/AdSlot';

type Profile = {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

type Post = {
  id: string;
  user_id: string;
  category: string;
  content: string | null;
  image_url: string | null;
  voice_url: string | null;
  parent_id: string | null;
  created_at: string;
};

const categoryLabels: Record<string, string> = {
  doctors_only: 'أطباء فقط',
  doctors_and_users: 'أطباء ومستخدمين',
  users_only: 'مستخدمين فقط',
};

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (userId) load();
  }, [userId, user]);

  useEffect(() => {
    if (!userId) return;

    const postsChannel = supabase
      .channel(`profile-posts-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_posts', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const np = payload.new as Post;
            if (!np.parent_id) setPosts((prev) => [np, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((p) => p.id !== (payload.old as any).id));
          } else if (payload.eventType === 'UPDATE') {
            const np = payload.new as Post;
            setPosts((prev) => prev.map((p) => (p.id === np.id ? np : p)));
          }
        }
      )
      .subscribe();

    const likesChannel = supabase
      .channel(`profile-likes-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_likes' },
        (payload) => {
          const row: any = payload.new || payload.old;
          if (!row?.post_id) return;
          setLikeCounts((prev) => {
            const cur = prev[row.post_id] || 0;
            const delta = payload.eventType === 'INSERT' ? 1 : payload.eventType === 'DELETE' ? -1 : 0;
            return { ...prev, [row.post_id]: Math.max(0, cur + delta) };
          });
        }
      )
      .subscribe();

    const repliesChannel = supabase
      .channel(`profile-replies-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_posts' },
        (payload) => {
          const np = payload.new as Post;
          if (np.parent_id) {
            setReplyCounts((prev) => ({ ...prev, [np.parent_id!]: (prev[np.parent_id!] || 0) + 1 }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(repliesChannel);
    };
  }, [userId]);

  const load = async () => {
    setLoading(true);
    try {
      const { data: profData, error: profErr } = await supabase.rpc('get_profile_public', {
        profile_user_id: userId,
      });
      if (profErr) throw profErr;
      const p = (profData as any)?.[0];
      setProfile(p ?? null);

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId!)
        .eq('role', 'doctor')
        .maybeSingle();
      setIsDoctor(!!roleData);

      const { data: postsData, error: postsErr } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', userId!)
        .is('parent_id', null)
        .order('created_at', { ascending: false });
      if (postsErr) throw postsErr;
      setPosts(postsData || []);

      if (postsData && postsData.length > 0) {
        const ids = postsData.map((p) => p.id);
        const [{ data: likes }, { data: replies }] = await Promise.all([
          supabase.from('community_likes').select('post_id').in('post_id', ids),
          supabase.from('community_posts').select('parent_id').in('parent_id', ids),
        ]);
        const lc: Record<string, number> = {};
        likes?.forEach((l: any) => { lc[l.post_id] = (lc[l.post_id] || 0) + 1; });
        const rc: Record<string, number> = {};
        replies?.forEach((r: any) => { if (r.parent_id) rc[r.parent_id] = (rc[r.parent_id] || 0) + 1; });
        setLikeCounts(lc);
        setReplyCounts(rc);
      }
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">المستخدم غير موجود</p>
        <Button onClick={() => navigate('/community')}>العودة للمجتمع</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SiteHeader />
      <AdSlot id="profile-top" format="banner" />
      <div className="container max-w-3xl mx-auto py-6 px-4">
        <Button variant="ghost" onClick={() => navigate('/community')} className="mb-4">
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للمجتمع
        </Button>

        <Card className="mb-6">
          <CardContent className="pt-6 flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {profile.full_name?.charAt(0) || 'م'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{profile.full_name || 'مستخدم'}</h1>
                {isDoctor && <Badge variant="secondary">طبيب</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                عضو منذ {new Date(profile.created_at).toLocaleDateString('ar-EG')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {posts.length} منشور
              </p>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mb-4">المنشورات</h2>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              لا توجد منشورات بعد
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{categoryLabels[post.category]}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleString('ar-EG')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {post.content && <p className="whitespace-pre-wrap">{post.content}</p>}
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="منشور"
                      className="rounded-lg max-h-80 object-cover"
                    />
                  )}
                  {post.voice_url && (
                    <audio controls src={post.voice_url} className="w-full" />
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {likeCounts[post.id] || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {replyCounts[post.id] || 0}
                    </span>
                    {post.image_url && <ImageIcon className="w-4 h-4" />}
                    {post.voice_url && <Mic className="w-4 h-4" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <AdSlot id="profile-bottom" format="inline" />
    </div>
  );
};

export default UserProfile;
