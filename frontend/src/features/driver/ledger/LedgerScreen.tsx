import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { COLORS, SPACING, METRICS } from '../../../theme';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LedgerScreen: React.FC = () => {
  return (
    <SafeView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>Analytics</Typography>
        </View>

        {/* Net Earnings Card */}
        <View style={styles.netEarningsCard}>
          <View style={styles.earningsTop}>
            <Typography variant="caption" color="textSecondary" style={styles.metricLabel}>NET EARNINGS • MARCH</Typography>
            <Typography variant="caption" color="error" style={styles.expenseText}>₹6,200 Expenses</Typography>
          </View>
          <View style={styles.amountRow}>
            <View>
              <Typography variant="h1" style={styles.amount}>₹42,330</Typography>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: COLORS.surfaceHighlight }]}>
                  <Typography variant="caption" style={{ color: COLORS.secondary }}>22 Trips</Typography>
                </View>
                <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Typography variant="caption" style={{ color: COLORS.success }}>↑ 14%</Typography>
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Typography variant="subtitle" style={{ color: COLORS.success }}>₹48,530</Typography>
              <Typography variant="caption" color="textTertiary">Gross</Typography>
            </View>
          </View>
        </View>

        {/* Daily Earnings Chart Block */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Typography variant="bodySemibold" style={{ color: '#FFF' }}>Daily earnings</Typography>
            <Typography variant="bodySemibold" style={{ color: COLORS.primary }}>₹26,090</Typography>
          </View>
          <View style={styles.chartArea}>
            {[40, 60, 45, 80, 100, 60, 50].map((height, i) => (
              <View key={i} style={styles.barContainer}>
                <View style={[styles.bar, { height: `${height}%`, backgroundColor: i === 4 ? COLORS.primary : COLORS.surfaceHighlight }]} />
                <Typography variant="caption" color={i === 4 ? "primary" : "textTertiary"} style={styles.dayLabel}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statSquare}>
            <Feather name="award" size={24} color="#FFD700" style={styles.statIcon} />
            <Typography variant="subtitle" style={{ color: '#FFF' }}>Friday</Typography>
            <Typography variant="caption" color="textSecondary">Best Day</Typography>
            <Typography variant="caption" style={{ color: COLORS.success, marginTop: 4 }}>₹8,200 earned</Typography>
          </View>

          <View style={styles.statSquare}>
            <Feather name="star" size={24} color="#10B981" style={styles.statIcon} />
            <Typography variant="subtitle" style={{ color: '#FFF' }}>4.9 / 5</Typography>
            <Typography variant="caption" color="textSecondary">Avg Rating</Typography>
            <Typography variant="caption" style={{ color: COLORS.textTertiary, marginTop: 4 }}>48 reviews</Typography>
          </View>

          <View style={styles.statSquare}>
            <Feather name="map" size={24} color="#00F0FF" style={styles.statIcon} />
            <Typography variant="subtitle" style={{ color: '#FFF' }}>178 km</Typography>
            <Typography variant="caption" color="textSecondary">Avg Trip</Typography>
            <Typography variant="caption" style={{ color: COLORS.textTertiary, marginTop: 4 }}>Per trip</Typography>
          </View>

          <View style={styles.statSquare}>
            <Feather name="droplet" size={24} color="#EF4444" style={styles.statIcon} />
            <Typography variant="subtitle" style={{ color: '#FFF' }}>₹4,200</Typography>
            <Typography variant="caption" color="textSecondary">Fuel Spend</Typography>
            <Typography variant="caption" style={{ color: COLORS.textTertiary, marginTop: 4 }}>This month</Typography>
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
  netEarningsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  earningsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  metricLabel: {
    letterSpacing: 1,
  },
  expenseText: {
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    color: COLORS.secondary,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: METRICS.pillRadius,
    marginRight: SPACING.xs,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  chartArea: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barContainer: {
    alignItems: 'center',
    height: '100%',
    width: 24,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statSquare: {
    width: (width - SPACING.lg * 2 - SPACING.sm) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  statIcon: {
    marginBottom: SPACING.sm,
  },
});

export default LedgerScreen;
