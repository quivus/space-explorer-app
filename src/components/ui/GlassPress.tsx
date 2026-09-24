import { useTheme } from '@/context/ThemeContext';
import { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'none';
  disabled?: boolean;
  radius?: number;
  glass?: boolean;
};

const SNAP = { duration: 70, easing: Easing.out(Easing.cubic) };

export function GlassPress({
  children,
  onPress,
  style,
  accessibilityLabel,
  accessibilityRole = 'button',
  disabled,
  radius = 22,
  glass = true,
}: Props) {
  const { colors } = useTheme();
  const deepen = useSharedValue(0);

  const shell = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - deepen.value * 0.015 }],
  }));

  const veil = useAnimatedStyle(() => ({
    opacity: deepen.value * 0.7,
  }));

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        if (disabled) return;
        deepen.value = withTiming(1, SNAP);
      }}
      onPressOut={() => {
        deepen.value = withTiming(0, SNAP);
      }}
      {...(Platform.OS === 'web' && glass ? { dataSet: { glass: '1' } } : null)}
    >
      <Animated.View style={[styles.shell, { borderRadius: radius }, style, shell]}>
        {children}
        {glass ? (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.veil,
              {
                borderRadius: radius,
                backgroundColor: colors.panelSolid,
                borderColor: colors.hairlineStrong,
              },
              veil,
            ]}
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
  },
  veil: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
