import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('moneyadmin.db');

export const initDatabase = () => {
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
