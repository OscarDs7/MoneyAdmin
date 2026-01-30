import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';


import { addSubscription, updateSubscription } from '../services/subscriptions.service';
import {
requestNotificationPermissions,
scheduleSubscriptionNotification,
scheduleBillingDayNotification,
cancelNotification
} from '../services/notifications.service';
import { calculateNextBillingDate, getReminderDate } from '../utils/date.utils';

export default function AddSubscriptionScreen({ navigation, route }) {
  const editingSubscription = route.params?.subscription;
  const isEditing = !!editingSubscription;
  const [name, setName] = useState(editingSubscription ? editingSubscription.name : '');
  const [amount, setAmount] = useState(editingSubscription ? editingSubscription.amount.toString() : '');
  const [billingDate, setBillingDate] = useState(
    editingSubscription ?  new Date(editingSubscription.billingDate) : new Date());
  const [showPicker, setShowPicker] = useState(false);
  const parsedAmount = parseFloat(amount) || 0; // Valor numérico del monto
  const [saving, setSaving] = useState(false); // Estado de guardado
  // componente frecuencia (fijo a mensual por ahora)
  const [frequency, setFrequency] = useState(
  editingSubscription ? editingSubscription.frequency : 'Mensual'
);

//  Función para guardar la suscripción
const saveSubscription = async () => {
  if (saving) return;
  setSaving(true);

  try {
    /* ========= VALIDACIONES ========= */
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Datos inválidos', 'Ingresa un nombre y monto válido');
      return;
    }
    /* La fecha de facturación debe ser futura, después de hoy
    if (billingDate < new Date()) {
      Alert.alert('Fecha inválida', 'La fecha de cobro debe ser futura');
      return;
    } /*

    /* ========= DETERMINAR SI HAY QUE REPROGRAMAR ========= */
    const originalBillingDate = editingSubscription
      ? new Date(editingSubscription.billingDate)
      : null;

    const billingDateChanged = isEditing
      ? originalBillingDate.getTime() !== billingDate.getTime()
      : true;

    const frequencyChanged = isEditing
      ? editingSubscription.frequency !== frequency
      : true;

    const shouldRescheduleNotifications =
      !isEditing || billingDateChanged || frequencyChanged;

    const nextBillingDate = shouldRescheduleNotifications
      ? calculateNextBillingDate(billingDate, frequency)
      : new Date(billingDate);

    /* ========= CANCELAR NOTIFICACIONES PREVIAS ========= */
    if (isEditing && shouldRescheduleNotifications) {
      if (editingSubscription.reminderNotificationId) {
        await cancelNotification(editingSubscription.reminderNotificationId);
      }
      if (editingSubscription.billingNotificationId) {
        await cancelNotification(editingSubscription.billingNotificationId);
      }
    }

    /* ========= PROGRAMAR NOTIFICACIONES ========= */
    let reminderNotificationId =
      editingSubscription?.reminderNotificationId ?? null;
    let billingNotificationId =
      editingSubscription?.billingNotificationId ?? null;

    let finalBillingDate = billingDate;

    if (shouldRescheduleNotifications) {
      const hasPermission = await requestNotificationPermissions();

      if (hasPermission) {
        finalBillingDate = calculateNextBillingDate(billingDate, frequency);

        reminderNotificationId = await scheduleSubscriptionNotification({
          title: '⏰ Recordatorio de pago',
          body: `“${name}” se cobrará el ${finalBillingDate.toLocaleDateString()}`,
          triggerDate: getReminderDate(finalBillingDate),
        });

        billingNotificationId = await scheduleBillingDayNotification({
          title: '💳 Hoy se realiza el cobro',
          body: `Hoy se cobrará tu suscripción "${name}" por $${parsedAmount}`,
          nextBillingDate: finalBillingDate,
        });
      }
    }

    /* ========= GUARDAR EN BASE DE DATOS ========= */
    const payload = {
      name,
      amount: parsedAmount,
      billingDate: finalBillingDate.toISOString(),
      frequency,
      active: 1,
      reminderNotificationId,
      billingNotificationId,
    };

    if (isEditing) {
      await updateSubscription(editingSubscription.id, payload);
    } else {
      await addSubscription(payload);
    }

    navigation.goBack();
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Ocurrió un error al guardar la suscripción');
  } finally {
    setSaving(false);
  }
};
// Fin función guardar suscripción


// Renderizado del componente
return (
  <View style={styles.container}>
    <Text style = {styles.title}>
      {isEditing ? 'Editar suscripción' : 'Nueva suscripción'}
    </Text>

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
    <View style={styles.field}>
    <Text style={styles.label}>Frecuencia</Text>
      <Picker
        selectedValue={frequency}
        onValueChange={(value) => setFrequency(value)}
      >
        <Picker.Item label="Mensual" value="Mensual" />
        <Picker.Item label="Anual" value="Anual" />
      </Picker>
      <Text style={styles.helper}>
        {frequency === 'Mensual'
          ? 'Se cobrará cada mes'
          : 'Se cobrará una vez al año'}
      </Text>
    </View>

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

    <Button
    title={
      saving
        ? 'Guardando...'
        : isEditing
          ? 'Actualizar suscripción'
          : 'Guardar suscripción'
    }
    onPress={saveSubscription}
    disabled={saving}
  />

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
  color: '#000',
},
field: { marginBottom: 16 },
label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
picker: { height: 50, width: '100%' , color: '#000'},
helper: { fontSize: 12, color: '#666', marginTop: 4 },
});
