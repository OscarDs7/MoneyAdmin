import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addExpense, updateExpense } from '../services/expenses.service';

export default function AddExpenseScreen({ navigation, route }) {
    const expense = route.params?.expense; // Gasto a editar, si existe
    const isEditing = !!expense; // Verifica si se está editando un gasto existente

    const [amount, setAmount] = useState(expense ? expense.amount.toString() : '');
    const [category, setCategory] = useState(expense ? expense.category : '');
    const [note, setNote] = useState(expense ? expense.note : '');
    const [date, setDate] = useState(expense ? new Date(expense.date) : new Date());
    const [showPicker, setShowPicker] = useState(false);

    // Función para guardar el gasto (nuevo o editado)
    const saveExpense = () => {
    if (!amount || !category) {
        alert('Por favor completa monto y categoría.');
        return;
    }
    const data = {
        amount: parseFloat(amount),
        category,
        note,
        date: date.toISOString(),
    };

    if (isEditing) {
        updateExpense(expense.id, data);
    } else {
        addExpense(data);
    }

    navigation.goBack();
    };

    // Función para manejar el cambio de fecha
  const onChangeDate = (_, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>

    <Text style={styles.title}>{isEditing ? 'Editar Gasto' : 'Nuevo Gasto'}</Text>
    
      <TextInput
        placeholder="Monto"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <TextInput
        placeholder="Categoría"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <Pressable
        onPress={() => setShowPicker(true)}
        style={styles.dateButton}
      >
        <Text>Fecha: {date.toLocaleDateString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}

      <TextInput
        placeholder="Nota (opcional)"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Button title="Guardar gasto" onPress={saveExpense} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
  },
});
