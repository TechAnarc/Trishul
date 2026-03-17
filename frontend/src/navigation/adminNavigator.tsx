import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type AdminTabParamList = {
  Dashboard: undefined;
  Vehicles: undefined;
  Drivers: undefined;
  Trips: undefined;
  Invoices: undefined;
  Settings: undefined;
};

export type AdminStackParamList = {
  AdminTabs: undefined;
  VehicleDetail: { vehicleId: string };
  DriverDetail: { driverId: string };
  TripDetail: { tripId: string };
  TripTracking: { tripId: string };
  CreateInvoice: { tripId: string };
  Ledger: undefined;
};

const AdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      {/* Tab screens - uncomment as implemented */}
      {/* <Tab.Screen name="Dashboard" component={AdminDashboard} /> */}
      {/* <Tab.Screen name="Vehicles" component={VehicleManagement} /> */}
      {/* <Tab.Screen name="Drivers" component={DriverManagement} /> */}
      {/* <Tab.Screen name="Trips" component={TripManagement} /> */}
      {/* <Tab.Screen name="Invoices" component={Invoices} /> */}
    </Tab.Navigator>
  );
};

export default AdminNavigator;
