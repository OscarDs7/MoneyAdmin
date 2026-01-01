// Función para calcular la fecha de recordatorio antes de la fecha de facturación
export const getReminderDate = (billingDate, daysBefore = 2) => {
  const date = new Date(billingDate);
  date.setDate(date.getDate() - daysBefore);
  return date;
};
// Fin-to-end de la función