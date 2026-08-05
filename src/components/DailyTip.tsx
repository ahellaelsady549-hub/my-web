import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { dailyHealthTips } from '@/data/dailyTips';
import { toast } from 'sonner';

export const DailyTip = () => {
  const { t, language } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentTip, setCurrentTip] = useState(dailyHealthTips[0]);

  useEffect(() => {
    // Check if notifications are already enabled
    const enabled = localStorage.getItem('dailyNotificationsEnabled') === 'true';
    setNotificationsEnabled(enabled);

    // Get current day of month (1-30)
    const currentDay = new Date().getDate();
    const tipIndex = (currentDay - 1) % 30;
    setCurrentTip(dailyHealthTips[tipIndex]);

    // Check if notification was shown today
    const lastNotificationDate = localStorage.getItem('lastNotificationDate');
    const today = new Date().toDateString();

    if (enabled && lastNotificationDate !== today && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        showDailyNotification();
      }
    }
  }, []);

  const showDailyNotification = () => {
    const currentDay = new Date().getDate();
    const tipIndex = (currentDay - 1) % 30;
    const tip = dailyHealthTips[tipIndex];
    
    const notification = new Notification(
      language === 'ar' ? 'نصيحة اليوم الصحية 💊' : 'Daily Health Tip 💊',
      {
        body: language === 'ar' ? tip.ar : tip.en,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'daily-health-tip',
        requireInteraction: false
      }
    );

    notification.onclick = () => {
      window.open('https://maps.google.com/', '_blank');
      notification.close();
    };

    localStorage.setItem('lastNotificationDate', new Date().toDateString());
  };

  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      toast.error(
        language === 'ar'
          ? 'المتصفح لا يدعم الإشعارات'
          : 'Browser does not support notifications'
      );
      return;
    }

    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('dailyNotificationsEnabled', 'true');
        showDailyNotification();
        toast.success(
          language === 'ar'
            ? 'تم تفعيل الإشعارات اليومية!'
            : 'Daily notifications enabled!'
        );
      } else {
        toast.error(
          language === 'ar'
            ? 'يجب السماح بالإشعارات لتفعيل هذه الميزة'
            : 'Please allow notifications to enable this feature'
        );
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('dailyNotificationsEnabled', 'false');
      toast.success(
        language === 'ar'
          ? 'تم إيقاف الإشعارات اليومية'
          : 'Daily notifications disabled'
      );
    }
  };

  return (
    <section id="daily-tip" className="py-16 md:py-24 bg-gradient-wellness">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto p-8 shadow-soft">
          <div className="flex items-start gap-4 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 flex-shrink-0">
              <Bell className="h-8 w-8 text-secondary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {t('dailyTip.title')}
              </h2>
              <p className="text-lg leading-relaxed mt-4">
                {language === 'ar' ? currentTip.ar : currentTip.en}
              </p>
            </div>
          </div>
          
          <Button
            onClick={toggleNotifications}
            className={`w-full md:w-auto ${
              notificationsEnabled
                ? 'bg-gradient-medical hover:opacity-90'
                : 'bg-gradient-wellness hover:opacity-90'
            }`}
          >
            {notificationsEnabled ? (
              <>
                <BellOff className="h-5 w-5 mr-2" />
                {t('dailyTip.disable')}
              </>
            ) : (
              <>
                <Bell className="h-5 w-5 mr-2" />
                {t('dailyTip.enable')}
              </>
            )}
          </Button>
        </Card>
      </div>
    </section>
  );
};
