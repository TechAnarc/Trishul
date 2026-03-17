import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, Platform, Alert } from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { COLORS, SPACING, METRICS } from '../../../theme';
import Button from '../../../components/Button';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import api from '../../../services/api';
import { API_BASE_URL } from '../../../constants';

const SuperAdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<any[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin`);
      setAdmins(res.data.data || []);
    } catch (err) {
      console.error('Failed to load agencies', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAdmins().then(() => setRefreshing(false));
  }, []);

  const handleCreateAdmin = async () => {
    if (!name || !email || !password || !agencyName) {
      if (Platform.OS === 'web') {
        window.alert('Please fill all fields');
      } else {
        Alert.alert('Validation', 'Please fill all fields');
      }
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(`/admin`, {
        name,
        email,
        password,
        agencyName
      });

      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setAgencyName('');
      
      // Refresh list
      fetchAdmins();
    } catch (err: any) {
      console.error('Create error', err);
      const msg = err.response?.data?.error?.message || 'Failed to create agency';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeView>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.container}>
          
          <View style={styles.header}>
            <View>
              <Typography variant="caption" color="primary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Platform Control
              </Typography>
              <Typography variant="h2" style={styles.title}>Super Admin Dashboard</Typography>
            </View>
            <Button title="Logout" variant="outline" onPress={logout} style={styles.logoutButton} textStyle={{ fontSize: 13 }} />
          </View>

          <View style={styles.dashboardBody}>
            
            {/* Agency Creation Form */}
            <View style={styles.formColumn}>
              <Animated.View entering={FadeInDown.springify()}>
                <Card elevated style={styles.formCard}>
                  <Typography variant="h3" style={{ marginBottom: SPACING.lg }}>Create New Travel Agency</Typography>
                  
                  <Input 
                    label="Agency Name" 
                    placeholder="Ex. Elite Travels"
                    value={agencyName}
                    onChangeText={setAgencyName}
                  />
                  
                  <Input 
                    label="Admin Contact Name" 
                    placeholder="Ex. Amit Singh"
                    value={name}
                    onChangeText={setName}
                  />

                  <Input 
                    label="Admin Email" 
                    placeholder="agency@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <Input 
                    label="Initial Password" 
                    placeholder="Secure password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <Button 
                    title="Create Agency" 
                    onPress={handleCreateAdmin} 
                    loading={isSubmitting} 
                    style={{ marginTop: SPACING.md }} 
                  />
                </Card>
              </Animated.View>
            </View>

            {/* Existing Agencies List */}
            <View style={styles.listColumn}>
              <View style={styles.sectionHeader}>
                <Typography variant="h3">Registered Agencies</Typography>
                <Typography variant="caption" color="textSecondary">{admins.length} Total</Typography>
              </View>

              <Card style={styles.listCard} padded={false}>
                {loading && admins.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Typography variant="body" color="textTertiary">Loading agencies...</Typography>
                  </View>
                ) : admins.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Typography variant="body" color="textTertiary">No agencies registered yet.</Typography>
                  </View>
                ) : (
                  admins.map((admin, index) => (
                    <Animated.View 
                      key={admin.id} 
                      entering={FadeInDown.delay(index * 100).springify()}
                      style={[styles.listItem, index !== admins.length - 1 && styles.borderBottom]}
                    >
                      <View style={styles.agencyInfo}>
                        <Typography variant="bodySemibold">{admin.agencyName}</Typography>
                        <Typography variant="caption" color="textSecondary">Admin: {admin.user.name} • {admin.user.email}</Typography>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: admin.user.isActive ? COLORS.successSubtle : COLORS.errorSubtle }]}>
                        <Typography variant="caption" style={{ color: admin.user.isActive ? COLORS.success : COLORS.error, fontWeight: '700' }}>
                          {admin.user.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Typography>
                      </View>
                    </Animated.View>
                  ))
                )}
              </Card>
            </View>

          </View>

        </View>
      </ScrollView>
    </SafeView>
  );
};

const isWeb = Platform.OS === 'web';
const screenWidth = Dimensions.get('window').width;
const isDesktop = isWeb && screenWidth > 900;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    maxWidth: 1200, 
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.xxs,
  },
  logoutButton: {
    width: 100,
    height: 40,
  },
  dashboardBody: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: SPACING.xl,
  },
  formColumn: {
    flex: isDesktop ? 1 : 1,
  },
  listColumn: {
    flex: isDesktop ? 1.5 : 1,
  },
  formCard: {
    padding: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  listCard: {
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  borderBottom: {
    borderBottomWidth: METRICS.borderWidth,
    borderBottomColor: COLORS.borderSubtle,
  },
  agencyInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: METRICS.pillRadius,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
});

export default SuperAdminDashboard;
