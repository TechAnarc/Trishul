import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, METRICS } from '../../../theme';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const EmergencyScreen: React.FC = () => {
  return (
    <SafeView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>Safety Center</Typography>
        </View>

        {/* SOS Button Area */}
        <View style={styles.sosContainer}>
          <TouchableOpacity activeOpacity={0.8} style={styles.sosOuterRing}>
            <View style={styles.sosInnerCircle}>
              <MaterialCommunityIcons name="alarm-light" size={48} color="#FFF" style={{ marginBottom: 4 }} />
              <Typography variant="subtitle" style={{ color: '#FFF' }}>EMERGENCY SOS</Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Hold for 3 seconds</Typography>
            </View>
          </TouchableOpacity>
        </View>

        {/* Health / Shift Metrics */}
        <View style={styles.metricsCard}>
          
          <View style={styles.metricRow}>
            <View style={styles.metricIconBox}>
              <Ionicons name="time" size={20} color={COLORS.secondary} />
            </View>
            <View style={styles.metricDetails}>
              <Typography variant="bodySemibold" style={{ color: '#FFF' }}>Driving Hours</Typography>
              <Typography variant="caption" color="textSecondary">Take a break soon</Typography>
            </View>
            <Typography variant="h3" style={{ color: COLORS.secondary }}>8h 20m</Typography>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricRow}>
            <View style={[styles.metricIconBox, { backgroundColor: COLORS.primarySubtle }]}>
              <Ionicons name="cafe" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.metricDetails}>
              <Typography variant="bodySemibold" style={{ color: '#FFF' }}>Break Due</Typography>
              <Typography variant="caption" color="textSecondary">Last break: 2:00 PM</Typography>
            </View>
            <Typography variant="h3" style={{ color: COLORS.primary }}>45 min</Typography>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricRow}>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="speedometer" size={20} color={COLORS.success} />
            </View>
            <View style={styles.metricDetails}>
              <Typography variant="bodySemibold" style={{ color: '#FFF' }}>Avg Speed</Typography>
              <Typography variant="caption" color="textSecondary">Within safe limits</Typography>
            </View>
            <Typography variant="h3" style={{ color: COLORS.success }}>74 km/h</Typography>
          </View>

        </View>

        {/* Emergency Contacts */}
        <Typography variant="subtitle" style={styles.sectionTitle}>Emergency Contacts</Typography>
        <View style={styles.contactsGrid}>
          
          <View style={styles.contactSquare}>
            <Ionicons name="business" size={24} color={COLORS.secondary} style={styles.contactIcon} />
            <Typography variant="bodySemibold" style={{ color: '#FFF' }}>Admin</Typography>
            <Typography variant="caption" color="textSecondary">+91 987...</Typography>
          </View>

          <View style={[styles.contactSquare, { borderColor: COLORS.error, backgroundColor: 'rgba(239, 68, 68, 0.05)' }]}>
            <Ionicons name="call" size={24} color={COLORS.error} style={styles.contactIcon} />
            <Typography variant="bodySemibold" style={{ color: COLORS.error }}>Emergency</Typography>
            <Typography variant="caption" style={{ color: COLORS.error }}>112</Typography>
          </View>

          <View style={styles.contactSquare}>
            <Ionicons name="people" size={24} color={COLORS.primary} style={styles.contactIcon} />
            <Typography variant="bodySemibold" style={{ color: '#FFF' }}>Family</Typography>
            <Typography variant="caption" color="textSecondary">+91 876...</Typography>
          </View>

        </View>

      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 40,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    color: '#FFF',
  },
  sosContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
    marginBottom: 40,
  },
  sosOuterRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  sosInnerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  metricsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.xl,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  metricDetails: {
    flex: 1,
  },
  metricDivider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
  },
  sectionTitle: {
    color: '#FFF',
    marginBottom: SPACING.md,
  },
  contactsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  contactSquare: {
    width: '31%',
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.baseRadius,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  contactIcon: {
    marginBottom: SPACING.xs,
  },
});

export default EmergencyScreen;
