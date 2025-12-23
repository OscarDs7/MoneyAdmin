// This service handles CRUD operations for expenses in the database.

import { db } from '../database/db';
import * as Crypto from 'expo-crypto';

// Función para obtener todos los gastos
export const getExpenses = () => {
  return db.getAllSync('SELECT * FROM expenses ORDER BY date DESC');
};

// Función para agregar un nuevo gasto
export const addExpense = ({ amount, category, date, note }) => {
  const id = Crypto.randomUUID(); // Genera un ID único para el gasto
  db.runSync(
    `INSERT INTO expenses (id, amount, category, date, note)
     VALUES (?, ?, ?, ?, ?)`,
    [id, amount, category, date, note]
  );
};

// Función para actualizar un gasto existente
export const updateExpense = (id, expense) => {
  db.runSync(
    `UPDATE expenses
     SET amount = ?, category = ?, date = ?, note = ?
     WHERE id = ?`,
    [
      expense.amount,
      expense.category,
      expense.date,
      expense.note,
      id,
    ]
  );
};

// Función para eliminar un gasto
export const deleteExpense = (id) => {
  db.runSync(
    'DELETE FROM expenses WHERE id = ?',
    [id]
  );
};
