import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SubscriptionsScreen from '../screens/SubscriptionsScreen';
import AddSubscriptionScreen from '../screens/AddSubscriptionScreen';

const Stack = createNativeStackNavigator();

export default function SubscriptionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{ title: 'Suscripciones' }}
      />
      <Stack.Screen
        name="AddSubscription"
        component={AddSubscriptionScreen}
        options={{ title: 'Nueva suscripción' }}
      />
    </Stack.Navigator>
  );
}
