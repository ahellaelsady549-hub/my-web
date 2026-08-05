import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, Loader2 } from 'lucide-react';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  fullName: string | null;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onAvatarChange?: (url: string) => void;
}

export const ProfileAvatar = ({ 
  avatarUrl, 
  fullName, 
  size = 'md',
  editable = false,
  onAvatarChange
}: ProfileAvatarProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار صورة صالحة',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'خطأ',
        description: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for storage in profile (since we don't have storage bucket)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        // Update profile with avatar URL
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: base64 })
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: 'تم التحديث',
          description: 'تم تحديث صورة الملف الشخصي'
        });

        onAvatarChange?.(base64);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء رفع الصورة',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatarUrl || ''} />
        <AvatarFallback className="bg-primary/10 text-primary text-xl">
          {fullName?.charAt(0) || 'م'}
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Camera className="w-3 h-3" />
            )}
          </Button>
        </>
      )}
    </div>
  );
};
