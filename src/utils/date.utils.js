// Función para calcular la fecha de recordatorio antes de la fecha de facturación
export const getReminderDate = (billingDate, daysBefore = 2) => {
  const date = new Date(billingDate.getTime()); // Crear una copia de la fecha
  date.setDate(date.getDate() - daysBefore); // Resta días correctamente
  date.setHours(10, 0, 0, 0); // Establece a las 10:00 AM exacto
  return date;                              // Devuelve un Date usable para programar
};

// Función para calcular la próxima fecha de facturación según la frecuencia
export function calculateNextBillingDate(billingDate, frequency) {
  const base = new Date(billingDate.getTime());
  const day = base.getDate();

  let next;

  if (frequency === 'Mensual') {
    next = new Date(
      base.getFullYear(),
      base.getMonth() + 1,
      1
    );

    // Último día del mes destino
    const lastDayOfMonth = new Date(
      next.getFullYear(),
      next.getMonth() + 1,
      0
    ).getDate();

    next.setDate(Math.min(day, lastDayOfMonth));
  }

  if (frequency === 'Anual') {
    next = new Date(
      base.getFullYear() + 1,
      base.getMonth(),
      base.getDate()
    );
  }

  // Hora consistente
  next.setHours(9, 0, 0, 0);
  return next;
}
