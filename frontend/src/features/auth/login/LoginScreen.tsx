import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { APP_NAME, APP_TAGLINE } from '../../../constants';
import { COLORS, SPACING, METRICS } from '../../../theme';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import Card from '../../../components/Card';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/authNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if ((result as any)?.requiresMfa) {
        navigation.navigate('MfaVerification', {
          userId: (useAuthStore.getState() as any).pendingMfaUserId,
          method: (useAuthStore.getState() as any).pendingMfaMethod,
        });
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* ScrollView is best for forms. keyboardShouldPersistTaps allows taps on web & mobile seamlessly without blocking inputs. */}
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Typography variant="h1" style={styles.logoText}>🔱</Typography>
              </View>
              <Typography variant="h2" align="center" style={styles.title}>
                {APP_NAME}
              </Typography>
              <Typography variant="caption" color="textSecondary" align="center" style={styles.tagline}>
                {APP_TAGLINE}
              </Typography>
            </View>

            {/* Form Container */}
            <Card elevated style={styles.formCard}>
              <View style={styles.formHeader}>
                <Typography variant="h3">Welcome back</Typography>
                <Typography variant="body" color="textSecondary" style={styles.subtitle}>
                  Sign in to your account to continue
                </Typography>
              </View>

              <Input
                label="Email address"
                placeholder="Ex. admin@trishul.app"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {error && (
                <View style={styles.errorContainer}>
                  <Typography variant="caption" color="error" align="center">{error}</Typography>
                </View>
              )}

              <Button 
                title="Sign In" 
                onPress={handleLogin} 
                loading={loading} 
                style={styles.button} 
              />
            </Card>

            {/* Footer */}
            <View style={styles.footer}>
              <Typography variant="caption" color="textTertiary">
                Need help accessing your account?
              </Typography>
              <View style={styles.supportLink}>
                <Typography variant="caption" color="primary">Contact Support</Typography>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  container: {
    paddingHorizontal: SPACING.lg,
    maxWidth: 440, // Standard enterprise width constraint for forms
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: METRICS.largeRadius,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  logoText: {
    fontSize: 24,
    lineHeight: 32, // Fix vertical alignment of emoji
  },
  title: {
    letterSpacing: -0.5,
    marginBottom: SPACING.xxs,
  },
  tagline: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  formCard: {
    padding: SPACING.xl,
    paddingBottom: SPACING.lg + SPACING.md,
  },
  formHeader: {
    marginBottom: SPACING.xl,
  },
  subtitle: {
    marginTop: SPACING.xs,
  },
  errorContainer: {
    backgroundColor: COLORS.errorSubtle,
    padding: SPACING.sm,
    borderRadius: METRICS.baseRadius,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  button: {
    marginTop: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  supportLink: {
    marginLeft: SPACING.xs,
    padding: SPACING.xxs,
  },
});

export default LoginScreen;
