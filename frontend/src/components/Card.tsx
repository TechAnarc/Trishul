import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { COLORS, METRICS, SHADOWS, SPACING } from '../theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  padded?: boolean;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  elevated = true,
  padded = true,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        padded && styles.padded,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  elevated: {
    backgroundColor: COLORS.surfaceElevated,
    ...SHADOWS.md,
  },
  padded: {
    padding: SPACING.lg,
  },
});

export default Card;
