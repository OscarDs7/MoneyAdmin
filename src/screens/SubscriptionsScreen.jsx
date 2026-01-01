import { useCallback, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSubscriptions } from '../services/subscriptions.service';
import { checkNotificationPermissions, sendTestNotification } from '../services/notifications.service';

export default function SubscriptionsScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);

  const loadSubscriptions = () => {
    const data = getSubscriptions();
    setSubscriptions(data || []);
  };

  useFocusEffect(
    useCallback(() => {
      loadSubscriptions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suscripciones</Text>

      <Button
        title="Agregar suscripción"
        onPress={() => navigation.navigate('AddSubscription')}
      />

      <Button
        title="🚨 Prueba definitiva Android 15"
        onPress={async () => {
          await checkNotificationPermissions();
          await sendTestNotification();
        }}
      />

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No hay suscripciones registradas
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>${item.amount}</Text>
            <Text>Pago: {new Date(item.billingDate).toLocaleDateString()}</Text>
            <Text>Frecuencia: {item.frequency}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 36},
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  total: { fontSize: 18, marginBottom: 12 },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
    empty: {
    textAlign: 'center',
    marginTop: 20,
  },

});
