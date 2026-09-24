import { Screen } from '@/components/ui/Screen';
import { Type } from '@/components/ui/Type';
import { useTheme } from '@/context/ThemeContext';
import { fonts, radius } from '@/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { beginExplore } from '@/utils/navigation';
import { router } from 'expo-router';
import { createElement, useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

function LandingSky({ leave }: { leave: SharedValue<number> }) {
  const mobile = Platform.OS !== 'web';
  const turn = useSharedValue(0);

  useEffect(() => {
    if (!mobile) return;
    turn.value = withRepeat(withTiming(360, { duration: 90000, easing: Easing.linear }), -1, false);
  }, [mobile, turn]);

  const spin = useAnimatedStyle(() => ({
    transform: [{ rotate: `${turn.value}deg` }],
  }));

  const drift = useAnimatedStyle(() => ({
    opacity: 1 - leave.value * 0.55,
    transform: [{ scale: 1 + leave.value * 0.08 }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, drift]}>
      <Animated.View style={[mobile ? styles.skyPlate : StyleSheet.absoluteFill, mobile ? spin : null]}>
        <Image source={require('../../assets/images/landing-earth.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
      </Animated.View>
      <LinearGradient colors={['rgba(0,0,0,0.28)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.72)']} style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const leave = useSharedValue(0);
  const leaving = useRef(false);

  const depart = useAnimatedStyle(() => ({
    flex: 1,
    opacity: 1 - leave.value,
    transform: [{ translateX: leave.value * 110 }],
  }));

  function openHome() {
    router.replace('/home');
  }

  function explore() {
    if (leaving.current) return;
    leaving.current = true;
    beginExplore();
    leave.value = withTiming(1, { duration: 240, easing: Easing.in(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(openHome)();
    });
  }

  return (
    <Screen
      tabInset={false}
      meteors={false}
      hasSky={false}
      settings={false}
      logo={false}
      backdrop={<LandingSky leave={leave} />}
    >
      <Image source={require('../../assets/images/SpaceExplorerMark.png')} style={styles.logo} contentFit="contain" />
      <Animated.View style={depart}>
          <View style={styles.hero}>
            <Type variant="micro" color={colors.gold} style={styles.kicker}>
              NASA Astronomy Picture of the Day
            </Type>
            <Type variant="headline" style={styles.title}>
              Discover to Remember, Our Daily Cosmos
            </Type>
            <Type variant="body" style={styles.intro}>
              NASA publishes a single astronomy image each day. Open today’s plate, step through recent dates, and save the nights you want to keep.
            </Type>
          </View>
          <View style={styles.dockWrap}>
          <View style={[styles.dock, { backgroundColor: colors.panel, borderColor: colors.hairlineStrong }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Lets Explore"
              onPress={explore}
              style={[styles.go, { backgroundColor: colors.spark }]}
            >
              {Platform.OS === 'web' ? (
                createElement('span', { className: 'explore-sheen' }, 'Lets Explore')
              ) : (
                <Text style={{ fontSize: 12, letterSpacing: 2.2, textTransform: 'uppercase', color: colors.onAccent }}>
                  Lets Explore
                </Text>
              )}
              <View style={[styles.triangle, { borderLeftColor: colors.onAccent }]} />
            </Pressable>
          </View>
          </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  skyPlate: {
    position: 'absolute',
    width: '170%',
    height: '170%',
    left: '-35%',
    top: '-35%',
  },
  hero: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: 18,
  },
  logo: {
    width: '48%',
    maxWidth: 210,
    aspectRatio: 274 / 85,
    alignSelf: 'flex-start',
  },
  kicker: {
    marginTop: 0,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'justify',
  },
  title: {
    marginTop: 14,
    textAlign: 'left',
    fontFamily: fonts.bold,
    fontSize: 33,
    lineHeight: 32,
  },
  intro: {
    marginTop: 14,
    textAlign: 'justify',
    fontSize: 16,
    lineHeight: 24,
  },
  dockWrap: {
    width: '100%',
    marginTop: 22,
  },
  dock: {
    width: '100%',
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 6,
  },
  go: {
    minHeight: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
});
