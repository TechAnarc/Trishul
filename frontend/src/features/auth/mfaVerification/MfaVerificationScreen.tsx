import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { COLORS } from '../../../constants';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import SafeView from '../../../components/SafeView';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/authNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'MfaVerification'>;

const MfaVerificationScreen = ({ route }: Props) => {
  const { method } = route.params;
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { verifyMfa } = useAuthStore();

  const handleVerify = async () => {
    if (token.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await verifyMfa(token);
      // AuthStore will automatically update isAuthenticated, which triggers navigator change
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMethodText = () => {
    switch (method) {
      case 'TOTP':
        return 'your authenticator app';
      case 'EMAIL_OTP':
        return 'your email';
      case 'SMS_OTP':
        return 'your phone';
      default:
        return 'your device';
    }
  };

  return (
    <SafeView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.icon}>🛡️</Text>
              <Text style={styles.title}>Verify it's you</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to {getMethodText()}
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Verification Code"
                placeholder="000000"
                value={token}
                onChangeText={setToken}
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                title="Verify"
                onPress={handleVerify}
                loading={loading}
                style={styles.button}
              />

              <Button
                title="Back to Login"
                onPress={() => useAuthStore.getState().logout()}
                variant="outline"
                style={styles.backButton}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  input: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 10,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 16,
  },
});

export default MfaVerificationScreen;
