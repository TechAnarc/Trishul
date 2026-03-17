import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, METRICS, SPACING, TYPOGRAPHY, ANIMATION } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  icon,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.surfaceElevated,
          borderWidth: METRICS.borderWidth,
          borderColor: COLORS.border,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: METRICS.borderWidth,
          borderColor: COLORS.primary,
        };
      case 'danger':
        return { backgroundColor: COLORS.error };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      default:
        return {
          backgroundColor: COLORS.primary,
        };
    }
  };

  const getTextColor = (): string => {
    if (variant === 'outline' || variant === 'ghost') return COLORS.primary;
    if (variant === 'secondary') return COLORS.text;
    if (variant === 'danger') return COLORS.textInverse;
    return COLORS.textInverse;
  };

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: ANIMATION.fast });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: ANIMATION.fast });
        }}
        style={({ pressed }) => [
          styles.button,
          getVariantStyles(),
          (disabled || loading) && styles.disabled,
          pressed && variant !== 'primary' && { opacity: 0.8 },
          pressed && variant === 'primary' && { backgroundColor: COLORS.primaryDark },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {icon && <Animated.View style={styles.iconContainer}>{icon}</Animated.View>}
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
              {title}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    height: 48, // Standard enterprise button height
    borderRadius: METRICS.baseRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  text: {
    ...TYPOGRAPHY.button,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: SPACING.xs,
  },
});

export default Button;
