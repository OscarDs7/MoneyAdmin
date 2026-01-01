import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { addSubscription } from '../services/subscriptions.service';
import {
  requestNotificationPermissions,
  scheduleSubscriptionNotification,
} from '../services/notifications.service';
import { getReminderDate } from '../utils/date.utils';
import { testImmediateNotification } from '../services/notifications.service';


export default function AddSubscriptionScreen({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingDate, setBillingDate] = useState(new Date());
  const [frequency, setFrequency] = useState('Mensual');
  const [showPicker, setShowPicker] = useState(false);

  const saveSubscription = async () => {
    if (!name || !amount) return;

    // 1️⃣ Guardar en SQLite
    addSubscription({
      name,
      amount: parseFloat(amount),
      billingDate: billingDate.toISOString(),
      frequency,
    });

    // 2️⃣ Pedir permisos
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      // 3️⃣ Calcular recordatorio (2 días antes)
      const reminderDate = new Date(Date.now() + 10 * 1000); // 10 segundos para pruebas
      // const reminderDate = getReminderDate(billingDate, 2);

      // 4️⃣ Programar notificación
      await scheduleSubscriptionNotification({
        title: 'Pago próximo',
        body: `Tu suscripción a ${name} se cobrará pronto`,
        triggerDate: reminderDate,
      });
    }

    // 5️⃣ Probar notificación inmediata (opcional)
    await testImmediateNotification();

    // Volver atrás
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva suscripción</Text>

      <TextInput
        placeholder="Nombre (Netflix, Spotify...)"
        placeholderTextColor={"#000"}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Monto"
        placeholderTextColor={"#000"}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button
        title={`Fecha de pago: ${billingDate.toLocaleDateString()}`}
        onPress={() => setShowPicker(true)}
        style = {styles.paybutton}
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

      <Button title="Guardar la suscripción" onPress={saveSubscription} />
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
  paybutton: {
    padding: 35
  }
});
