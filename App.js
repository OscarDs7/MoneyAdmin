import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/db';
import { setupNotificationChannel } from './src/services/notifications.service';
import * as Updates from 'expo-updates';

export default function App() {
  useEffect(() => {
    async function initApp() {
      console.log('🟢 App iniciada');

      // Mostrar info de actualización
      console.log('📦 Update ID:', Updates.updateId);
      console.log('🌍 Channel:', Updates.channel);

      // Verificar si hay update disponible
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          console.log('⬆️ Update disponible, descargando...');
          await Updates.fetchUpdateAsync();
          console.log('✅ Update descargado, recargando app...');
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.error('⚠️ Error al verificar/apply update:', e);
      }

      // Inicializar base de datos
      initDatabase();
      console.log('🗄️ Base de datos inicializada');

      // Configurar canal de notificaciones
      setupNotificationChannel();
    }

    initApp();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
