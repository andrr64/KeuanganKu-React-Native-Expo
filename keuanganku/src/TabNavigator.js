import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Homepage from './screens/Homepage';
import Incomepage from './screens/Pemasukanpage';
import Expensepage from './screens/Pengeluaranpage';
import StatistikPage from './screens/Statistikpage';
import AboutPage from './screens/Aboutpage';

export default function TabNavigator() {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
          },
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
        }}>
        <Tab.Screen
          name="Home"
          component={Homepage}
          options={{
            headerShown: false,
            tabBarLabel: 'Beranda',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Statistik"
          component={StatistikPage}
          options={{
            headerShown: false,
            tabBarLabel: 'Statistik',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="bar-chart" color={color} size={size} />
              // Alternatif: "trending-down", "money-off", "payment"
            ),
          }}
        />
        <Tab.Screen
          name="Pemasukan"
          component={Incomepage}
          options={{
            headerShown: false,
            tabBarLabel: 'Pemasukan',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="arrow-upward" color={color} size={size} />
              // Alternatif: "trending-up", "paid", "attach-money"
            ),
          }}
        />
        <Tab.Screen
          name="Pengeluaran"
          component={Expensepage}
          options={{
            headerShown: false,
            tabBarLabel: 'Pengeluaran',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="arrow-downward" color={color} size={size} />
              // Alternatif: "trending-down", "money-off", "payment"
            ),
          }}
        />
        <Tab.Screen
          name="Tentang"
          component={AboutPage}
          options={{
            headerShown: false,
            tabBarLabel: 'Tentang',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="info" color={color} size={size} />
              // Alternatif: "trending-down", "money-off", "payment"
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}