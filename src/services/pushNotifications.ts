import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const initializePushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications are only available on native platforms');
    return null;
  }

  try {
    // Request permission
    const permStatus = await PushNotifications.requestPermissions();
    
    if (permStatus.receive === 'granted') {
      // Register for push notifications
      await PushNotifications.register();
      
      // Listen for push token
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        // Store token for later use (e.g., send to server)
        localStorage.setItem('push_token', token.value);
      });
      
      // Listen for registration errors
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });
      
      // Listen for push notifications received
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ' + JSON.stringify(notification));
        // Handle notification display
        showLocalNotification(notification.title || '', notification.body || '');
      });
      
      // Listen for action performed on push notification
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed: ' + JSON.stringify(notification));
        // Handle notification tap - navigate to relevant page
        handleNotificationAction(notification.notification.data);
      });
      
      return true;
    } else {
      console.log('Push notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
};

const showLocalNotification = (title: string, body: string) => {
  // For web, use browser notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
};

const handleNotificationAction = (data: any) => {
  // Handle different notification types
  if (data?.type === 'medication_reminder') {
    window.location.href = '/dashboard?tab=medications';
  } else if (data?.type === 'new_message') {
    window.location.href = `/chat/${data.conversationId}`;
  } else if (data?.type === 'doctor_verified') {
    window.location.href = '/dashboard';
  }
};

export const getPushToken = (): string | null => {
  return localStorage.getItem('push_token');
};

export const removePushNotificationListeners = async () => {
  if (Capacitor.isNativePlatform()) {
    await PushNotifications.removeAllListeners();
  }
};

// Schedule a local notification (useful for medication reminders)
export const scheduleMedicationReminder = async (
  medicationName: string,
  time: string,
  id: number
) => {
  if (!Capacitor.isNativePlatform()) {
    // For web, use the Notification API with setTimeout
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);
    
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const delay = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('تذكير بالدواء 💊', {
          body: `حان موعد تناول ${medicationName}`,
          icon: '/favicon.ico',
          tag: `medication-${id}`
        });
      }
    }, delay);
    
    return;
  }
  
  // For native, we would use local notifications
  // This requires @capacitor/local-notifications package
  console.log(`Scheduled reminder for ${medicationName} at ${time}`);
};

// Request web notification permission
export const requestWebNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};
