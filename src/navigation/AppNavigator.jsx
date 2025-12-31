// This navigator sets up the main application navigation with bottom tabs and a stack for expenses.

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import SubscriptionsStack from './SubscriptionsStack';
import SubscriptionsScreen from '../screens/SubscriptionsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Stack exclusivo para Gastos
 */
function ExpensesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExpensesHome"
        component={ExpensesScreen}
        options={{ title: 'Gastos' }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: 'Nuevo gasto' ?? 'Editar gasto' }}
      />
      <Stack.Screen
        name="AddSubscription"
        component="SubscriptionsScreen"
        options={{ title: 'Suscripciones' }}
      />  
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Gastos" component={ExpensesStack} />
      <Tab.Screen
        name="Suscripciones"
        component={SubscriptionsStack}
      />
    </Tab.Navigator>
  );
}
