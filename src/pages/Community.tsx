import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Header as SiteHeader } from '@/components/Header';
import { AdSlot } from '@/components/AdSlot';
import {
  Home, Send, Image, Mic, MicOff, Search, Flag, Reply, Trash2, 
  Shield, BarChart3, Ban, MessageCircle, ArrowRight, Loader2, X,
  Heart, Bell, BellDot, Check
} from 'lucide-react';

type Post = {
  id: string;
  user_id: string;
  category: string;
  content: string | null;
  image_url: string | null;
  voice_url: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

type ProfileInfo = {
  full_name: string | null;
  avatar_url: string | null;
};

type Notification = {
  id: string;
  user_id: string;
  post_id: string;
  reply_id: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
  actor_id: string;
};

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeCategory, setActiveCategory] = useState('doctors_and_users');
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileInfo>>({});
  const [newContent, setNewContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [bannedUsers, setBannedUsers] = useState<any[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [banUserId, setBanUserId] = useState('');
  const [banReason, setBanReason] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [postLikes, setPostLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    checkUserRoles();
    trackVisit();
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, activeCategory]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('community-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        const n = payload.new as Notification;
        setNotifications(prev => [n, ...prev]);
        toast({ title: '🔔 إشعار جديد', description: 'قام شخص بالرد على منشورك' });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, activeCategory]);

  const trackVisit = async () => {
    const hash = `${navigator.userAgent}-${new Date().toDateString()}`;
    await supabase.from('site_visits').insert({ visitor_hash: hash });
  };

  const checkUserRoles = async () => {
    if (!user) return;
    const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
    if (roles) {
      setIsDoctor(roles.some(r => r.role === 'doctor'));
      setIsAdmin(roles.some(r => r.role === 'admin'));
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('community_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setNotifications(data as Notification[]);
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase
      .from('community_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('community_posts')
      .select('*')
      .eq('category', activeCategory)
      .is('parent_id', null)
      .order('created_at', { ascending: false });
    
    if (data) {
      setPosts(data);
      const userIds = [...new Set(data.map(p => p.user_id))];
      await fetchProfiles(userIds);
      await fetchLikesForPosts(data.map(p => p.id));
    }
    setIsLoading(false);
  };

  const fetchLikesForPosts = async (postIds: string[]) => {
    if (!user || postIds.length === 0) return;
    const { data: allLikes } = await supabase
      .from('community_likes')
      .select('post_id, user_id')
      .in('post_id', postIds);
    
    const likesMap: Record<string, { count: number; liked: boolean }> = {};
    for (const pid of postIds) {
      const postLikesArr = allLikes?.filter(l => l.post_id === pid) || [];
      likesMap[pid] = {
        count: postLikesArr.length,
        liked: postLikesArr.some(l => l.user_id === user.id),
      };
    }
    setPostLikes(prev => ({ ...prev, ...likesMap }));
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const current = postLikes[postId];
    if (current?.liked) {
      await supabase.from('community_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      setPostLikes(prev => ({ ...prev, [postId]: { count: (prev[postId]?.count || 1) - 1, liked: false } }));
    } else {
      await supabase.from('community_likes').insert({ post_id: postId, user_id: user.id });
      setPostLikes(prev => ({ ...prev, [postId]: { count: (prev[postId]?.count || 0) + 1, liked: true } }));
    }
  };

  const fetchProfiles = async (userIds: string[]) => {
    const newProfiles: Record<string, ProfileInfo> = { ...profiles };
    for (const uid of userIds) {
      if (!newProfiles[uid]) {
        const { data } = await supabase.rpc('get_profile_public', { profile_user_id: uid });
        if (data && data.length > 0) {
          newProfiles[uid] = { full_name: data[0].full_name, avatar_url: data[0].avatar_url };
        } else {
          newProfiles[uid] = { full_name: 'مستخدم', avatar_url: null };
        }
      }
    }
    setProfiles(newProfiles);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];
        recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch {
        toast({ title: 'خطأ', description: 'لا يمكن الوصول للميكروفون', variant: 'destructive' });
      }
    }
  };

  const uploadFile = async (file: File | Blob, path: string) => {
    const { data, error } = await supabase.storage.from('community-media').upload(path, file);
    if (error) throw error;
    // Bucket is private: signed URL scoped to authenticated access
    const { data: signed, error: signErr } = await supabase.storage
      .from('community-media')
      .createSignedUrl(data.path, 60 * 60 * 24 * 365);
    if (signErr || !signed) throw signErr ?? new Error('failed to sign url');
    return signed.signedUrl;
  };

  const handleSendPost = async () => {
    if (!user || (!newContent.trim() && !imageFile && !audioBlob)) return;
    
    setIsLoading(true);
    try {
      let imageUrl: string | null = null;
      let voiceUrl: string | null = null;

      if (imageFile) {
        const path = `images/${user.id}/${Date.now()}-${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, path);
      }

      if (audioBlob) {
        const path = `voice/${user.id}/${Date.now()}.webm`;
        voiceUrl = await uploadFile(audioBlob, path);
      }

      const { data: newPost, error } = await supabase.from('community_posts').insert({
        user_id: user.id,
        category: activeCategory,
        content: newContent.trim() || null,
        image_url: imageUrl,
        voice_url: voiceUrl,
        parent_id: replyTo,
      }).select().single();

      if (error) throw error;

      // Send notification to the original post owner if replying
      if (replyTo && newPost) {
        const { data: parentPost } = await supabase
          .from('community_posts')
          .select('user_id')
          .eq('id', replyTo)
          .single();
        
        if (parentPost && parentPost.user_id !== user.id) {
          await supabase.from('community_notifications').insert({
            user_id: parentPost.user_id,
            post_id: replyTo,
            reply_id: newPost.id,
            type: 'reply',
            actor_id: user.id,
          });
        }
      }

      setNewContent('');
      setImageFile(null);
      setImagePreview(null);
      setAudioBlob(null);
      setReplyTo(null);
      fetchPosts();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.message || 'حدث خطأ', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const handleReport = async () => {
    if (!reportPostId || !reportReason.trim() || !user) return;
    await supabase.from('community_reports').insert({
      post_id: reportPostId,
      reporter_id: user.id,
      reason: reportReason.trim(),
    });
    toast({ title: 'تم الإبلاغ', description: 'سيتم مراجعة البلاغ من قبل الإدارة' });
    setReportPostId(null);
    setReportReason('');
  };

  const handleDeletePost = async (postId: string) => {
    await supabase.from('community_posts').delete().eq('id', postId);
    fetchPosts();
  };

  // Admin functions
  const loadAdminData = async () => {
    const { data: stats } = await supabase.rpc('get_community_stats');
    setAdminStats(stats);
    const { data: reps } = await supabase.from('community_reports').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    setReports(reps || []);
    const { data: bans } = await supabase.from('community_bans').select('*');
    setBannedUsers(bans || []);
    const { data: users } = await supabase.rpc('get_registered_users');
    setRegisteredUsers((users as any[]) || []);
  };

  const handleBanUser = async () => {
    if (!banUserId || !user) return;
    await supabase.from('community_bans').insert({ user_id: banUserId, banned_by: user.id, reason: banReason });
    toast({ title: 'تم الحظر', description: 'تم حظر المستخدم بنجاح' });
    setBanUserId('');
    setBanReason('');
    loadAdminData();
  };

  const handleUnban = async (userId: string) => {
    await supabase.from('community_bans').delete().eq('user_id', userId);
    loadAdminData();
  };

  const handleDismissReport = async (reportId: string) => {
    await supabase.from('community_reports').update({ status: 'dismissed' }).eq('id', reportId);
    loadAdminData();
  };

  const filteredPosts = searchQuery
    ? posts.filter(p => p.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts;

  const availableCategories = () => {
    const cats: { value: string; label: string }[] = [];
    cats.push({ value: 'doctors_and_users', label: 'الأطباء والمستخدمين' });
    if (isDoctor) {
      cats.push({ value: 'doctors_only', label: 'الأطباء فقط' });
    }
    if (!isDoctor) {
      cats.push({ value: 'users_only', label: 'المستخدمين فقط' });
    }
    return cats;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SiteHeader />
      <AdSlot id="community-top" format="banner" />

      {/* Page bar */}
      <header className="border-b border-border bg-background/95">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-medical bg-clip-text text-transparent flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              مجتمع إسعفني
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications Bell */}
            <div className="relative">
              <Button
                variant={showNotifications ? 'default' : 'ghost'}
                size="icon"
                onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }}
              >
                {unreadCount > 0 ? <BellDot className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
              </Button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            {isAdmin && (
              <Button
                variant={showAdmin ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setShowAdmin(!showAdmin); if (!showAdmin) loadAdminData(); }}
              >
                <Shield className="h-4 w-4 ml-1" />
                الإدارة
              </Button>
            )}
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute left-4 right-4 md:left-auto md:right-4 md:w-96 top-full bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm">الإشعارات</h3>
              {notifications.length > 0 && (
                <Button size="sm" variant="ghost" className="text-xs" onClick={markAllRead}>
                  <Check className="h-3 w-3 ml-1" /> قراءة الكل
                </Button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">لا توجد إشعارات</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`p-3 border-b border-border last:border-0 text-sm ${!n.is_read ? 'bg-primary/5' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Reply className="h-4 w-4 text-primary shrink-0" />
                    <span>{profiles[n.actor_id]?.full_name || 'شخص'} رد على منشورك</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(n.created_at)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {showAdmin && isAdmin ? (
          /* Admin Panel */
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> لوحة الإدارة
            </h2>
            
            {adminStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{adminStats.total_users}</p>
                  <p className="text-sm text-muted-foreground">مستخدم مسجل</p>
                </CardContent></Card>
                <Card><CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{adminStats.total_visitors}</p>
                  <p className="text-sm text-muted-foreground">زائر</p>
                </CardContent></Card>
                <Card><CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{adminStats.total_posts}</p>
                  <p className="text-sm text-muted-foreground">منشور</p>
                </CardContent></Card>
                <Card><CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-destructive">{adminStats.pending_reports}</p>
                  <p className="text-sm text-muted-foreground">بلاغ معلق</p>
                </CardContent></Card>
              </div>
            )}

            {/* Ban User */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold flex items-center gap-2"><Ban className="h-4 w-4" /> حظر مستخدم</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="معرف المستخدم (User ID)" value={banUserId} onChange={(e) => setBanUserId(e.target.value)} />
                <Input placeholder="السبب" value={banReason} onChange={(e) => setBanReason(e.target.value)} />
                <Button onClick={handleBanUser} variant="destructive" size="sm">
                  <Ban className="h-4 w-4 ml-1" /> حظر
                </Button>
              </CardContent>
            </Card>

            {bannedUsers.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="font-semibold">المستخدمون المحظورون ({bannedUsers.length})</h3>
                </CardHeader>
                <CardContent>
                  {bannedUsers.map(ban => (
                    <div key={ban.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-mono">{ban.user_id}</p>
                        <p className="text-xs text-muted-foreground">{ban.reason}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleUnban(ban.user_id)}>
                        إلغاء الحظر
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold flex items-center gap-2"><Flag className="h-4 w-4" /> البلاغات المعلقة</h3>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">لا توجد بلاغات معلقة</p>
                ) : reports.map(report => (
                  <div key={report.id} className="py-3 border-b border-border last:border-0">
                    <p className="text-sm"><strong>السبب:</strong> {report.reason}</p>
                    <p className="text-xs text-muted-foreground">منشور: {report.post_id}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="destructive" onClick={() => handleDeletePost(report.post_id)}>
                        حذف المنشور
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDismissReport(report.id)}>
                        تجاهل
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" /> المستخدمون المسجلون ({registeredUsers.length})
                </h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-auto">
                  {registeredUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">لا يوجد مستخدمون</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {registeredUsers.map((u) => (
                        <div key={u.user_id} className="p-3 space-y-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{u.full_name || 'بدون اسم'}</p>
                            <div className="flex gap-1 flex-wrap">
                              {(u.roles || []).map((r: string) => (
                                <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  {r === 'admin' ? 'مشرف' : r === 'doctor' ? 'طبيب' : 'مستخدم'}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground break-all">{u.email}</p>
                          <p className="text-[11px] text-muted-foreground font-mono break-all">{u.user_id}</p>
                          <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>سجّل: {new Date(u.created_at).toLocaleString('ar-EG')}</span>
                            {u.last_sign_in_at && (
                              <span>آخر دخول: {new Date(u.last_sign_in_at).toLocaleString('ar-EG')}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" onClick={() => setShowAdmin(false)} className="w-full">
              <ArrowRight className="h-4 w-4 ml-1" /> العودة للمجتمع
            </Button>
          </div>
        ) : (
          /* Community Feed */
          <div className="space-y-6">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${availableCategories().length}, 1fr)` }}>
                {availableCategories().map(cat => (
                  <TabsTrigger key={cat.value} value={cat.value} className="text-xs sm:text-sm">
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في المنشورات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                {replyTo && (
                  <div className="flex items-center justify-between bg-accent/50 p-2 rounded-md text-sm">
                    <span>رد على منشور</span>
                    <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Textarea
                  placeholder="اكتب منشورك هنا..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                {imagePreview && (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="preview" className="h-20 rounded-md" />
                    <Button size="icon" variant="destructive" className="absolute -top-2 -left-2 h-6 w-6" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {audioBlob && (
                  <div className="flex items-center gap-2 bg-accent/50 p-2 rounded-md">
                    <Mic className="h-4 w-4 text-primary" />
                    <span className="text-sm">رسالة صوتية مسجلة</span>
                    <Button size="sm" variant="ghost" onClick={() => setAudioBlob(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                    <Button size="icon" variant="ghost" onClick={() => imageInputRef.current?.click()}>
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant={isRecording ? 'destructive' : 'ghost'} onClick={toggleRecording}>
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button onClick={handleSendPost} disabled={isLoading || (!newContent.trim() && !imageFile && !audioBlob)} size="sm">
                    <Send className="h-4 w-4 ml-1" />
                    نشر
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isLoading && posts.length === 0 ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد منشورات بعد. كن أول من ينشر!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    profile={profiles[post.user_id]}
                    isOwner={post.user_id === user?.id}
                    isAdmin={isAdmin}
                    onReply={() => setReplyTo(post.id)}
                    onDelete={() => handleDeletePost(post.id)}
                    onReport={() => setReportPostId(post.id)}
                    
                    profiles={profiles}
                    fetchProfiles={fetchProfiles}
                    likes={postLikes[post.id] || { count: 0, liked: false }}
                    onToggleLike={() => toggleLike(post.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Dialog */}
      <Dialog open={!!reportPostId} onOpenChange={(open) => { if (!open) setReportPostId(null); }}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>الإبلاغ عن منشور</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="اكتب سبب الإبلاغ..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          <Button onClick={handleReport} disabled={!reportReason.trim()}>
            <Flag className="h-4 w-4 ml-1" /> إرسال البلاغ
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// PostCard sub-component
const PostCard = ({ post, profile, isOwner, isAdmin, onReply, onDelete, onReport, profiles, fetchProfiles, likes, onToggleLike }: {
  post: Post;
  profile?: ProfileInfo;
  isOwner: boolean;
  isAdmin: boolean;
  onReply: () => void;
  onDelete: () => void;
  onReport: () => void;
  
  profiles: Record<string, ProfileInfo>;
  fetchProfiles: (ids: string[]) => Promise<void>;
  likes: { count: number; liked: boolean };
  onToggleLike: () => void;
}) => {
  const [replies, setReplies] = useState<Post[]>([]);
  const [showReplies, setShowReplies] = useState(false);

  const loadReplies = async () => {
    const { data } = await supabase
      .from('community_posts')
      .select('*')
      .eq('parent_id', post.id)
      .order('created_at', { ascending: true });
    if (data) {
      setReplies(data);
      const uids = [...new Set(data.map(r => r.user_id))];
      await fetchProfiles(uids);
    }
  };

  const toggleReplies = () => {
    if (!showReplies) loadReplies();
    setShowReplies(!showReplies);
  };

  const name = profile?.full_name || 'مستخدم';
  const initials = name.slice(0, 2);
  const timeAgo = getTimeAgo(post.created_at);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <a href={`/profile/${post.user_id}`} onClick={(e) => { e.preventDefault(); window.location.href = `/profile/${post.user_id}`; }} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{name}</p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </a>
          <div className="flex items-center gap-1">
            {!isOwner && (
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onReport}>
                <Flag className="h-3 w-3" />
              </Button>
            )}
            {(isOwner || isAdmin) && (
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={onDelete}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {post.content && <p className="text-sm leading-relaxed">{post.content}</p>}
        
        {post.image_url && (
          <img src={post.image_url} alt="post" className="rounded-lg max-h-80 w-full object-cover" />
        )}
        
        {post.voice_url && (
          <audio controls className="w-full" src={post.voice_url} />
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button size="sm" variant="ghost" onClick={onToggleLike} className={`text-xs ${likes.liked ? 'text-red-500' : ''}`}>
            <Heart className={`h-4 w-4 ml-1 ${likes.liked ? 'fill-red-500 text-red-500' : ''}`} />
            {likes.count > 0 && likes.count}
          </Button>
          <Button size="sm" variant="ghost" onClick={onReply} className="text-xs">
            <Reply className="h-3 w-3 ml-1" /> رد
          </Button>
          <Button size="sm" variant="ghost" onClick={toggleReplies} className="text-xs">
            <MessageCircle className="h-3 w-3 ml-1" /> الردود {replies.length > 0 && `(${replies.length})`}
          </Button>
        </div>

        {showReplies && replies.length > 0 && (
          <div className="mr-6 space-y-3 border-r-2 border-primary/20 pr-4">
            {replies.map(reply => {
              const rProfile = profiles[reply.user_id];
              const rName = rProfile?.full_name || 'مستخدم';
              return (
                <div key={reply.id} className="space-y-1">
                  <a href={`/profile/${reply.user_id}`} onClick={(e) => { e.preventDefault(); window.location.href = `/profile/${reply.user_id}`; }} className="flex items-center gap-2 hover:opacity-80">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{rName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold">{rName}</span>
                    <span className="text-xs text-muted-foreground">{getTimeAgo(reply.created_at)}</span>
                  </a>
                  {reply.content && <p className="text-sm">{reply.content}</p>}
                  {reply.image_url && <img src={reply.image_url} alt="reply" className="rounded-md max-h-40" />}
                  {reply.voice_url && <audio controls className="w-full h-8" src={reply.voice_url} />}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  const diffDays = Math.floor(diffHours / 24);
  return `منذ ${diffDays} يوم`;
}

export default Community;
