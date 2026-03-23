import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DriverDashboard from '../features/driver/dashboard/DriverDashboard';
import { COLORS, TYPOGRAPHY } from '../theme';

import TripPlannerScreen from '../features/driver/tripPlanner/TripPlannerScreen';
import LedgerScreen from '../features/driver/ledger/LedgerScreen';
import EmergencyScreen from '../features/driver/emergency/EmergencyScreen';
import ProfileScreen from '../features/driver/profile/ProfileScreen';
import SettingsScreen from '../features/driver/settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DriverTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0F1A',
          borderTopWidth: 1,
          borderTopColor: COLORS.borderSubtle,
          height: 65,
          paddingBottom: 15,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: -4,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: any = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Trip') iconName = focused ? 'map' : 'map-outline';
          if (route.name === 'Ledger') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          if (route.name === 'Safety') iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DriverDashboard} />
      <Tab.Screen name="Trip" component={TripPlannerScreen} />
      <Tab.Screen name="Ledger" component={LedgerScreen} />
      <Tab.Screen name="Safety" component={EmergencyScreen} />
    </Tab.Navigator>
  );
};

import StartTripScreen from '../features/driver/startTrip/StartTripScreen';
import MyTripsScreen from '../features/driver/tripPlanner/MyTripsScreen';

const DriverNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="StartTrip" component={StartTripScreen} />
      <Stack.Screen name="MyTrips" component={MyTripsScreen} />
    </Stack.Navigator>
  );
};

export default DriverNavigator;
