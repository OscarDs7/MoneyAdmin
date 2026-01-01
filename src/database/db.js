import { Platform } from 'react-native';

let db;

if (Platform.OS !== 'web') {
  // Import dinámico solo en Android/iOS
  const SQLite = require('expo-sqlite');
  db = SQLite.openDatabaseSync('moneyadmin.db');
} else {
  // Mock para web
  db = {
    execSync: () => {},
  };
}

export const initDatabase = () => {
  if (Platform.OS === 'web') return; // No hacer nada en web

  try {
    // Tabla de gastos
    db.execSync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT
      );
    `);

    // Tabla de suscripciones
    db.execSync(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        billingDate TEXT NOT NULL,
        frequency TEXT NOT NULL,
        active INTEGER NOT NULL
      );
    `);

    console.log('Base de datos inicializada');
  } catch (error) {
    console.error('Error al inicializar DB', error);
  }
};

export { db };
