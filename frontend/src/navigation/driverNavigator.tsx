import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverDashboard from '../features/driver/dashboard/DriverDashboard';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator();

const DriverNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
    </Stack.Navigator>
  );
};

export default DriverNavigator;
