import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants';

// Screen imports
import LoginScreen from '../features/auth/login/LoginScreen';
import MfaVerificationScreen from '../features/auth/mfaVerification/MfaVerificationScreen';

const Stack = createNativeStackNavigator();

export type AuthStackParamList = {
  Login: undefined;
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
      <Stack.Screen name="Login" component={LoginScreen as any} />
      <Stack.Screen name="MfaVerification" component={MfaVerificationScreen as any} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
