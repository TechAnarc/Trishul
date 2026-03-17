import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator();

export type DriverTabParamList = {
  Dashboard: undefined;
  ActiveTrip: undefined;
  TripPlanner: undefined;
  Expenses: undefined;
  Ledger: undefined;
  Emergency: undefined;
};

const DriverNavigator: React.FC = () => {
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
      {/* <Tab.Screen name="Dashboard" component={DriverDashboard} /> */}
      {/* <Tab.Screen name="ActiveTrip" component={StartTrip} /> */}
      {/* <Tab.Screen name="TripPlanner" component={TripPlanner} /> */}
      {/* <Tab.Screen name="Expenses" component={Expenses} /> */}
      {/* <Tab.Screen name="Ledger" component={DriverLedger} /> */}
      {/* <Tab.Screen name="Emergency" component={Emergency} /> */}
    </Tab.Navigator>
  );
};

export default DriverNavigator;
