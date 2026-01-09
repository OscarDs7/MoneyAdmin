import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { addSubscription } from '../services/subscriptions.service';
import {
requestNotificationPermissions,
scheduleSubscriptionNotification,
scheduleBillingDayNotification
} from '../services/notifications.service';
import { getReminderDate } from '../utils/date.utils';

export default function AddSubscriptionScreen({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingDate, setBillingDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

const saveSubscription = async () => {
if (!name || !amount) return;

  // Fijar hora segura (9 am)
  billingDate.setHours(9, 0, 0, 0);

// Guardar en DB
addSubscription({
  name,
  amount: parseFloat(amount),
  billingDate: billingDate.toISOString(),
  frequency: 'Mensual',
});

/* NOTIFICACIONES */

// Solicitar permisos
const hasPermission = await requestNotificationPermissions();
if (hasPermission) {
  const reminderDate = getReminderDate(billingDate); // Fecha de recordatorio (2 días antes)
  // Notificación de recordatorio
  await scheduleSubscriptionNotification({
    title: '⏰ Recordatorio de pago',
    body: `“${name}” se cobrará el ${billingDate.toLocaleDateString()}`,
    triggerDate: reminderDate,
  });

  // Notificación el día de cobro
  await scheduleBillingDayNotification({
    title: '💳 Hoy se realiza el cobro',
    body: `Hoy se cobrará tu suscripción "${name} por $${amount}"`,
    billingDate: new Date(billingDate), // Copia de la fecha
  });
}
// Volver a la pantalla anterior
navigation.goBack();

};

return (
  <View style={styles.container}>
    <Text style={styles.title}>Nueva suscripción</Text>

    <TextInput
      placeholder="Nombre (Netflix, Spotify...)"
      placeholderTextColor="#000"
      value={name}
      onChangeText={setName}
      style={styles.input}
    />

    <TextInput
      placeholder="Monto"
      placeholderTextColor="#000"
      value={amount}
      onChangeText={setAmount}
      keyboardType="numeric"
      style={styles.input}
    />

    <Button
      title={`Fecha de pago: ${billingDate.toLocaleDateString()}`}
      onPress={() => setShowPicker(true)}
    />

    {showPicker && (
      <DateTimePicker
        value={billingDate}
        mode="date"
        display="default"
        onChange={(_, date) => {
          setShowPicker(false);
          if (date) setBillingDate(date);
        }}
      />
    )}

    <Button title="Guardar suscripción" onPress={saveSubscription} />
  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  },
});
