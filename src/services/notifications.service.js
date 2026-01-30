import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/* 🔹 HANDLER GLOBAL (ADAPTADO CORRECTAMENTE) */
Notifications.setNotificationHandler({
  handleNotification: async () => {
    if (Platform.OS === 'ios') {
      return {
        shouldShowBanner: true,   // banner visual
        shouldShowList: true,     // aparece en Notification Center
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    }

    // ANDROID
    return {
      shouldShowAlert: true,     // muestra notificación normal
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

/* 🔐 PEDIR PERMISOS */
export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  console.log('🔐 Notification permission status:', status);
  return status === 'granted';
}

/* 📡 CANAL ANDROID */
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

/* 🧪 NOTIFICACIÓN DE PRUEBA */
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
      body: 'Se borraron todas las suscripciones',
      sound: 'default',
    },
    trigger: {
      seconds: 5,
      channelId: 'subscriptions',
    },
  });
}

// 📆 PROGRAMAR NOTIFICACIÓN DE SUSCRIPCIÓN
export async function scheduleSubscriptionNotification({ title, body, triggerDate }) {
  //console.log('📆 Programando notificación de suscripción para:', triggerDate);
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await setupNotificationChannel();

  const notificatioId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      //channelId: 'subscriptions',
    },
    trigger: {
      date: triggerDate,   // Usa fecha exacta
      channelId: 'subscriptions',
    },
  });

  return notificatioId;
}

/* 📅 PROGRAMAR NOTIFICACIÓN PARA EL DÍA DE COBRO */
export async function scheduleBillingDayNotification({ title, body, billingDate }) {
  //console.log('📅 Programando notificación para el día de cobro:', billingDate);
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await setupNotificationChannel();

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      //channelId: 'subscriptions',
    },
    trigger: {
      date: billingDate,   // FECHA EXACTA DEL COBRO
      channelId: 'subscriptions',
    },
  });
  console.log(`📅 Notificación programada para: ${billingDate}`);

  return notificationId;

}

// CANCELAR NOTIFICACIÓN POR ID
export async function cancelNotification(notificationId) {
  if (!notificationId) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('🗑️ Notificación cancelada:', notificationId);
  } catch (error) {
    console.log('⚠️ Error cancelando notificación', error);
  }
}

// REPROGRAMAR NOTIFICACIONES DE SUSCRIPCIÓN
export async function rescheduleSubscriptionNotifications(subscription) {
  // Cancelar anteriores
  await cancelNotification(subscription.reminderNotificationId);
  await cancelNotification(subscription.billingNotificationId);

  // Calcular fechas
  const reminderDate = subscription.reminderDate;
  const billingDate = new Date(subscription.billingDate);

  // Programar nuevas
  const reminderNotificationId =
    await scheduleSubscriptionNotification({
      title: '⏰ Recordatorio de pago',
      body: `“${subscription.name}” se cobrará pronto`,
      triggerDate: reminderDate,
    });

  const billingNotificationId =
    await scheduleBillingDayNotification({
      title: '💳 Hoy se realiza el cobro',
      body: `Hoy se cobrará tu suscripción "${subscription.name}"`,
      billingDate,
    });

  return {
    reminderNotificationId,
    billingNotificationId,
  };
}
