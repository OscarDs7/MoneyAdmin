import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('moneyadmin.db');

export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT
      );
    `);

    console.log('Base de datos inicializada');
  } catch (error) {
    console.error('Error al inicializar DB', error);
  }
};
