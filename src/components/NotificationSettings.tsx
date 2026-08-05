import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Smartphone, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  initializePushNotifications, 
  requestWebNotificationPermission,
  getPushToken 
} from '@/services/pushNotifications';
import { Capacitor } from '@capacitor/core';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    const token = getPushToken();
    setPushToken(token);
    
    // Check if notifications are already enabled
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
    
    // Load saved preferences
    const savedPrefs = localStorage.getItem('notification_preferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setMedicationReminders(prefs.medicationReminders ?? true);
      setAppointmentReminders(prefs.appointmentReminders ?? true);
      setNewMessages(prefs.newMessages ?? true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    let success = false;
    
    if (isNative) {
      success = await initializePushNotifications() ?? false;
    } else {
      success = await requestWebNotificationPermission();
    }
    
    setNotificationsEnabled(success);
    setPushToken(getPushToken());
    
    if (success) {
      toast({
        title: 'تم تفعيل الإشعارات',
        description: 'ستتلقى إشعارات بتذكيرات الأدوية والرسائل الجديدة'
      });
    } else {
      toast({
        title: 'فشل تفعيل الإشعارات',
        description: 'يرجى السماح بالإشعارات من إعدادات المتصفح أو الجهاز',
        variant: 'destructive'
      });
    }
  };

  const savePreferences = () => {
    const prefs = {
      medicationReminders,
      appointmentReminders,
      newMessages
    };
    localStorage.setItem('notification_preferences', JSON.stringify(prefs));
    
    toast({
      title: 'تم حفظ التفضيلات',
      description: 'سيتم تطبيق إعدادات الإشعارات الجديدة'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          إعدادات الإشعارات
        </CardTitle>
        <CardDescription>
          تحكم في الإشعارات التي تتلقاها
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <Bell className="w-6 h-6 text-primary" />
            ) : (
              <BellOff className="w-6 h-6 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">
                {notificationsEnabled ? 'الإشعارات مفعلة' : 'الإشعارات معطلة'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isNative ? 'إشعارات التطبيق' : 'إشعارات المتصفح'}
              </p>
            </div>
          </div>
          {!notificationsEnabled ? (
            <Button onClick={handleEnableNotifications}>
              تفعيل
            </Button>
          ) : (
            <Check className="w-5 h-5 text-green-500" />
          )}
        </div>

        {/* Push token info for native */}
        {isNative && pushToken && (
          <div className="p-3 bg-muted/50 rounded text-xs">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4" />
              <span className="font-medium">معرف الجهاز</span>
            </div>
            <code className="text-muted-foreground break-all">
              {pushToken.substring(0, 20)}...
            </code>
          </div>
        )}

        {/* Notification preferences */}
        {notificationsEnabled && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">أنواع الإشعارات</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="med-reminders" className="flex items-center gap-2">
                💊 تذكيرات الأدوية
              </Label>
              <Switch
                id="med-reminders"
                checked={medicationReminders}
                onCheckedChange={setMedicationReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="apt-reminders" className="flex items-center gap-2">
                📅 مواعيد الأطباء
              </Label>
              <Switch
                id="apt-reminders"
                checked={appointmentReminders}
                onCheckedChange={setAppointmentReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="new-messages" className="flex items-center gap-2">
                💬 الرسائل الجديدة
              </Label>
              <Switch
                id="new-messages"
                checked={newMessages}
                onCheckedChange={setNewMessages}
              />
            </div>

            <Button onClick={savePreferences} className="w-full mt-4">
              حفظ التفضيلات
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
