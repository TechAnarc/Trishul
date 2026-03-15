import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator();

// Screen imports (create these files next)
// import LoginScreen from '../screens/auth/login/LoginScreen';
// import AdminLoginScreen from '../screens/auth/adminLogin/AdminLoginScreen';
// import DriverLoginScreen from '../screens/auth/driverLogin/DriverLoginScreen';
// import MfaVerificationScreen from '../screens/auth/mfaVerification/MfaVerificationScreen';

export type AuthStackParamList = {
  Login: undefined;
  AdminLogin: undefined;
  DriverLogin: undefined;
  MfaVerification: { userId: string; method: string };
};

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'fade',
      }}
    >
      {/* Uncomment screens as you implement them */}
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      {/* <Stack.Screen name="AdminLogin" component={AdminLoginScreen} /> */}
      {/* <Stack.Screen name="DriverLogin" component={DriverLoginScreen} /> */}
      {/* <Stack.Screen name="MfaVerification" component={MfaVerificationScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
