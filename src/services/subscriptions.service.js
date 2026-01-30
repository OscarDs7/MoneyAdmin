import * as Crypto from 'expo-crypto';
import { db } from '../database/db';

export const getSubscriptions = () => {
  return db.getAllSync(
    'SELECT * FROM subscriptions ORDER BY billingDate ASC'
  );
};

export const addSubscription = ({
  name,
  amount,
  billingDate,
  frequency,
  reminderNotificationId = null,
  billingNotificationId = null,
}) => {
  db.runSync(
    `INSERT INTO subscriptions
     (id, name, amount, billingDate, frequency, active, reminderNotificationId, billingNotificationId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      Crypto.randomUUID(),
      name,
      amount,
      billingDate,
      frequency,
      1, 
      reminderNotificationId,
      billingNotificationId,
    ]
  );
};

// Elimina todas las suscripciones
export const clearSubscriptions = () => {
  db.runSync('DELETE FROM subscriptions');
};

// Elimina una suscripción por ID
export const deleteSubscription = (id) => {
    db.runSync('DELETE FROM subscriptions WHERE id = ?', [id]);
}

/* Actualiza una suscripción existente */
export const updateSubscription = (id, subscription) => {
    db.runSync(
        `UPDATE subscriptions
            SET name = ?, amount = ?, billingDate = ?, frequency = ?, active = ?,
            reminderNotificationId = ?, billingNotificationId = ?
            WHERE id = ?`,
        [
            subscription.name,
            subscription.amount,
            subscription.billingDate,
            subscription.frequency,
            subscription.active ? 1 : 0,
            subscription.reminderNotificationId,
            subscription.billingNotificationId,
            id,
        ]
    );
};