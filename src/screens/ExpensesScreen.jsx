// This screen displays the list of expenses, allows adding new expenses, editing existing ones, and deleting them.

import { useCallback, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses } from '../services/expenses.service';
import { deleteExpense } from '../services/expenses.service';


export default function ExpensesScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);

  // Función para cargar los gastos desde la base de datos
  const loadExpenses = () => {
    const data = getExpenses();
    setExpenses(data);
  };

  // Función para manejar la eliminación de un gasto
  const handleDelete = (id) => {
  deleteExpense(id);
  loadExpenses();
};

  // Se ejecuta cada vez que la pantalla vuelve a estar activa
  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos</Text>
      <Text style={styles.total}>Total: ${total}</Text>

      <Button
        title="Agregar gasto"
        onPress={() => navigation.navigate('AddExpense')}
      />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No hay gastos registrados
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddExpense', { expense: item })
            }
          >
            <View style={styles.item}>
              <Text style={styles.amount}>${item.amount}</Text>
              <Text>{item.category}</Text>
              <Text style={styles.note}>{item.note}</Text>
              <Text>{new Date(item.date).toLocaleDateString()}</Text>

              <Button
                title="Eliminar"
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </TouchableOpacity>
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
  amount: { fontWeight: 'bold', fontSize: 16 },
  note: { color: '#666' },
  total: { fontWeight: 'bold', fontSize: 18, marginBottom: 16},
  buttonDelete: { marginTop: 16, backgroundColor: 'blue', padding: 8, borderRadius: 4}
});
