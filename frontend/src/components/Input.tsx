import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS, METRICS, SPACING, TYPOGRAPHY, ANIMATION } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  containerStyle, 
  icon,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = error 
      ? COLORS.error 
      : interpolateColor(
          focusProgress.value,
          [0, 1],
          [COLORS.border, COLORS.primary]
        );
        
    const backgroundColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [COLORS.surface, COLORS.surfaceElevated]
    );

    return {
      borderColor,
      backgroundColor,
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, { duration: ANIMATION.normal });
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, { duration: ANIMATION.normal });
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <AnimatedView style={[styles.inputContainer, animatedContainerStyle]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </AnimatedView>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    width: '100%',
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xxs,
  },
  inputContainer: {
    height: 48,
    borderRadius: METRICS.baseRadius,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: METRICS.borderWidth,
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    ...TYPOGRAPHY.body,
    height: '100%', // Ensure it fills container height for tap area
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xxs,
    marginLeft: SPACING.xxs,
  },
});

export default Input;
