import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/* 🔹 HANDLER GLOBAL */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/* 🔐 PEDIR PERMISOS (OBLIGATORIO ANDROID 13+) */
export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  console.log('🔐 Notification permission status:', status);
  return status === 'granted';
}

/* 📡 CANAL ANDROID (SIN BYPASS DND) */
export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    console.log('📡 Creando canal Android');

    await Notifications.setNotificationChannelAsync('subscriptions', {
      name: 'Suscripciones',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 500, 500, 500],
      lockscreenVisibility:
        Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

/* 🧪 NOTIFICACIÓN DE PRUEBA REAL */
export async function sendTestNotification() {
  console.log('🚨 Programando notificación REAL');

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    console.log('❌ Sin permiso para notificaciones');
    return;
  }

  await setupNotificationChannel();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🚨 MoneyAdmin',
      body: 'Notificación de prueba en producción',
      sound: 'default',
      channelId: 'subscriptions',
    },
    trigger: {
      seconds: 5,
    },
  });
}
