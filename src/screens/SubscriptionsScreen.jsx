import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getSubscriptions,
  clearSubscriptions,
  deleteSubscription,
} from '../services/subscriptions.service';
import { sendTestNotification, sendSubscriptionDeletedNotification } from '../services/notifications.service';

export default function SubscriptionsScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);

  const loadSubscriptions = () => {
    setSubscriptions(getSubscriptions() || []);
  };

  useFocusEffect(
    useCallback(() => {
      loadSubscriptions();
    }, [])
  );

  const total = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  const confirmDelete = (subscription) => {
    Alert.alert(
      'Eliminar suscripción',
      `¿Seguro que deseas eliminar "${subscription.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteSubscription(subscription.id);
            loadSubscriptions();
           // sendSubscriptionDeletedNotification(subscription);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suscripciones</Text>
      <Text style={styles.total}>Total mensual: ${total}</Text>

      <Button
        title="Agregar suscripción"
        onPress={() => navigation.navigate('AddSubscription')}
      />

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay suscripciones</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate('AddSubscription', { subscription: item })
            }
            onLongPress={() => confirmDelete(item)}
            style={styles.item}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text>${item.amount}</Text>
            <Text>
              Pago: {new Date(item.billingDate).toLocaleDateString()}
            </Text>
          </Pressable>
        )}
      />

      <Button
        title="Borrar todas las suscripciones"
        onPress={() =>
          Alert.alert(
            'Eliminar todo',
            '¿Seguro que deseas borrar todas las suscripciones?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => {
                  clearSubscriptions();
                  loadSubscriptions();
                  sendTestNotification();
                },
              },
            ]
          )
        }
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
