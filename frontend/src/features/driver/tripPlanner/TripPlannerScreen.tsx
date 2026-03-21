import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, METRICS } from '../../../theme';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TripPlannerScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>Plan Trip</Typography>
        </View>

        {/* Route Preview Card */}
        <View style={styles.mapCard}>
          <View style={styles.routeHeader}>
            <View style={styles.cityBadge}>
              <Ionicons name="location" size={14} color={COLORS.secondary} />
              <Typography variant="caption" style={styles.cityText}>Ahmedabad</Typography>
            </View>
            <View style={styles.lineConnector} />
            <View style={[styles.cityBadge, { borderColor: COLORS.primary }]}>
              <Ionicons name="location" size={14} color={COLORS.primary} />
              <Typography variant="caption" style={styles.cityText}>Mumbai</Typography>
            </View>
          </View>
          <Typography variant="caption" color="textTertiary" align="center" style={styles.routeSubtext}>
            534 km • 8h 20m • 4 stops
          </Typography>
        </View>

        {/* Route Stops */}
        <Typography variant="subtitle" style={styles.sectionTitle}>Route stops</Typography>
        <View style={styles.stopsCard}>
          {[
            { id: 1, label: 'Pickup', name: 'Ahmedabad', color: COLORS.secondary },
            { id: 2, label: 'Stop 1', name: 'Vadodara', color: COLORS.success },
            { id: 3, label: 'Stop 2', name: 'Surat', color: COLORS.success },
            { id: 4, label: 'Drop', name: 'Mumbai', color: COLORS.primary },
          ].map((stop, index, arr) => (
            <View key={stop.id} style={styles.stopRow}>
              <View style={styles.stopTimeline}>
                <View style={[styles.stopDot, { backgroundColor: stop.color }]} />
                {index !== arr.length - 1 && <View style={styles.stopLine} />}
              </View>
              <View style={styles.stopContent}>
                <Typography variant="caption" color="textSecondary">{stop.label}</Typography>
                <Typography variant="bodySemibold" style={{ color: '#FFF' }}>{stop.name}</Typography>
              </View>
            </View>
          ))}
        </View>

        {/* Fare Estimate */}
        <Typography variant="subtitle" style={styles.sectionTitle}>Fare estimate</Typography>
        <View style={styles.fareCard}>
          <View style={styles.fareRow}>
            <Typography variant="body" color="textSecondary">Distance (534 × ₹12)</Typography>
            <Typography variant="bodySemibold" style={{ color: '#FFF' }}>₹6,408</Typography>
          </View>
          <View style={styles.fareRow}>
            <Typography variant="body" color="textSecondary">Toll + Fuel</Typography>
            <Typography variant="bodySemibold" style={{ color: '#FFF' }}>₹740</Typography>
          </View>
          <View style={[styles.fareRow, styles.totalRow]}>
            <Typography variant="subtitle" style={{ color: '#FFF' }}>Total</Typography>
            <Typography variant="h2" style={{ color: COLORS.success }}>₹7,548</Typography>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('StartTrip')}
        >
          <Typography variant="button" style={styles.startButtonText}>Start Trip Now 🏎️</Typography>
        </TouchableOpacity>

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
  mapCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHighlight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: METRICS.baseRadius,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  cityText: {
    color: '#FFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  lineConnector: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: 8,
  },
  routeSubtext: {
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: '#FFF',
    marginBottom: SPACING.md,
  },
  stopsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  stopRow: {
    flexDirection: 'row',
    height: 60,
  },
  stopTimeline: {
    width: 20,
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 2,
  },
  stopLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.borderSubtle,
    marginTop: -4,
    marginBottom: -4,
    zIndex: 1,
  },
  stopContent: {
    flex: 1,
    paddingBottom: SPACING.md,
  },
  fareCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingTop: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: 0,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: METRICS.baseRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  startButtonText: {
    color: COLORS.textInverse,
  },
});

export default TripPlannerScreen;
