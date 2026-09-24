import { useTheme } from '@/context/ThemeContext';
import type { Palette } from '@/theme';
import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

type Star = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  sparkle: boolean;
  animated: boolean;
};
type StarColors = Pick<Palette, 'starDot'>;

function buildStars(count: number): Star[] {
  const stars: Star[] = [];
  let seed = 17;
  for (let i = 0; i < count; i += 1) {
    seed = (seed * 16807) % 2147483647;
    stars.push({
      left: seed % 100,
      top: Math.floor(seed / 37) % 100,
      size: (seed % 3) + 1,
      delay: seed % 2600,
      duration: 1200 + (seed % 2000),
      sparkle: seed % 5 === 0,
      animated: i % 3 === 0,
    });
  }
  return stars;
}

const STARS = buildStars(96);

function StarMark({ star, colors, opacity }: { star: Star; colors: StarColors; opacity?: number }) {
  if (star.sparkle) {
    const arm = star.size + 4;
    return (
      <View
        style={[
          styles.sparkle,
          {
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: arm,
            height: arm,
            opacity: opacity ?? 0.7,
          },
        ]}
      >
        <View style={[styles.crossH, { width: arm, backgroundColor: colors.starDot }]} />
        <View style={[styles.crossV, { height: arm, backgroundColor: colors.starDot }]} />
        <View style={[styles.core, { width: star.size, height: star.size, backgroundColor: colors.starDot }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.star,
        {
          left: `${star.left}%`,
          top: `${star.top}%`,
          width: star.size,
          height: star.size,
          opacity: opacity ?? 0.55,
          backgroundColor: colors.starDot,
        },
      ]}
    />
  );
}

function AnimatedStar({ star, colors }: { star: Star; colors: StarColors }) {
  const opacity = useSharedValue(star.sparkle ? 0.35 : 0.3);

  useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(withTiming(star.sparkle ? 1 : 0.8, { duration: star.duration, easing: Easing.inOut(Easing.quad) }), -1, true),
    );
    return () => cancelAnimation(opacity);
  }, [opacity, star]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (star.sparkle) {
    const arm = star.size + 4;
    return (
      <Animated.View
        style={[
          styles.sparkle,
          style,
          { left: `${star.left}%`, top: `${star.top}%`, width: arm, height: arm },
        ]}
      >
        <View style={[styles.crossH, { width: arm, backgroundColor: colors.starDot }]} />
        <View style={[styles.crossV, { height: arm, backgroundColor: colors.starDot }]} />
        <View style={[styles.core, { width: star.size, height: star.size, backgroundColor: colors.starDot }]} />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.star,
        style,
        {
          left: `${star.left}%`,
          top: `${star.top}%`,
          width: star.size,
          height: star.size,
          backgroundColor: colors.starDot,
        },
      ]}
    />
  );
}

export function StarField({ meteors = true }: { meteors?: boolean }) {
  const { colors } = useTheme();
  const focused = useIsFocused();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {STARS.map((star, index) =>
        focused && star.animated ? (
          <AnimatedStar key={index} star={star} colors={colors} />
        ) : (
          <StarMark key={index} star={star} colors={colors} />
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    borderRadius: 99,
  },
  sparkle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossH: {
    position: 'absolute',
    height: StyleSheet.hairlineWidth * 2,
    opacity: 0.9,
  },
  crossV: {
    position: 'absolute',
    width: StyleSheet.hairlineWidth * 2,
    opacity: 0.9,
  },
  core: {
    borderRadius: 99,
  },
});
