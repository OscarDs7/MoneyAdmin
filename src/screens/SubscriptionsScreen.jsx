import { useCallback, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSubscriptions, clearSubscriptions } from '../services/subscriptions.service';
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
  // Calculate total amount of subscriptions
  const total = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suscripciones</Text>
      <Text style={styles.total}>Total mensual: ${total}</Text>

      <Button
        title="Agregar suscripción"
        onPress={() => navigation.navigate('AddSubscription')}
      />
      <Button
      title="Borrar todas las suscripciones"
      onPress={() => {
        clearSubscriptions();
        loadSubscriptions();
        sendTestNotification('Suscripciones borradas', 'Se eliminaron todas.');
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
