// Función para calcular la fecha de recordatorio antes de la fecha de facturación
export const getReminderDate = (billingDate, daysBefore = 2) => {
  const date = new Date(billingDate.getTime()); // Crear una copia de la fecha
  date.setDate(date.getDate() - daysBefore); // Resta días correctamente
  return date;                              // Devuelve un Date usable para programar
};
