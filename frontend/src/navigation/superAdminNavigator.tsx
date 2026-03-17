import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SuperAdminDashboard from '../features/super-admin/dashboard/SuperAdminDashboard';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator();

const SuperAdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
    </Stack.Navigator>
  );
};

export default SuperAdminNavigator;
