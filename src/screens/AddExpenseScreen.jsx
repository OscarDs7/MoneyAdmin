// This screen allows users to add a new expense or edit an existing one.

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
import { Picker } from '@react-native-picker/picker';

// Categorías predefinidas para los gastos
const CATEGORIES = [
  'Comida',
  'Entretenimiento',
  'Suscripciones',
  'Viajes',
  'Otro',
];

export default function AddExpenseScreen({ navigation, route }) {
    const expense = route.params?.expense; // Gasto a editar, si existe
    const isEditing = !!expense; // Verifica si se está editando un gasto existente

    const [amount, setAmount] = useState(expense ? expense.amount.toString() : '');
    const [category, setCategory] = useState(expense ? expense.category : '');
    const [customCategory, setCustomCategory] = useState('');
    const [note, setNote] = useState(expense ? expense.note : '');
    const [date, setDate] = useState(expense ? new Date(expense.date) : new Date());
    const [showPicker, setShowPicker] = useState(false);

  // Función para guardar el gasto (nuevo o editado)
  const saveExpense = () => {
    if (!amount || !category) {
      alert('Por favor completa monto y categoría.');
      return;
    }

    if (category === 'Otro' && !customCategory) {
      alert('Por favor especifica la categoría.');
      return;
    }

    const finalCategory =
      category === 'Otro' ? customCategory : category;

    const data = {
      amount: parseFloat(amount),
      category: finalCategory,
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
  // Fin-SaveExpense


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

      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={category}
        onValueChange={(value) => {
          setCategory(value);
          if (value !== 'Otro') {
            setCustomCategory('');
          }
        }}
      >
        <Picker.Item label="Selecciona una categoría" value="" />
        {CATEGORIES.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
      {category === 'Otro' && (
      <TextInput
        placeholder="Especifica la categoría"
        value={customCategory}
        onChangeText={setCustomCategory}
        style={styles.input}
      />
    )}
    </View>
    
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
  pickerContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  marginBottom: 12,
},

});
