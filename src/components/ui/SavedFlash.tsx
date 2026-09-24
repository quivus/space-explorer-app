import { subscribeSaved } from '@/context/FavoritesContext';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Type } from './Type';

export function SavedFlash() {
  const [visible, setVisible] = useState(false);
  const [notice, setNotice] = useState<'saved' | 'removed'>('saved');
  const travel = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return subscribeSaved((next) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setNotice(next);
      travel.value = 0;
      if (next === 'saved') travel.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) });
      setVisible(true);
      timerRef.current = setTimeout(() => setVisible(false), 1600);
    });
  }, [travel]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const streak = useAnimatedStyle(() => ({
    opacity: travel.value > 0.05 && travel.value < 0.92 ? 1 : 0,
    transform: [{ translateX: -40 + travel.value * 220 }, { translateY: travel.value * 28 }, { rotate: '24deg' }],
  }));

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <View style={styles.card}>
        {notice === 'saved' ? (
          <Animated.View style={[styles.star, streak]}>
            <View style={styles.tail} />
            <View style={styles.head} />
          </Animated.View>
        ) : null}
        <Type variant="title" color="#fff" style={styles.label}>
          {notice === 'saved' ? 'Successfully saved!' : 'Removed from saved'}
        </Type>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 22,
    backgroundColor: 'rgba(12,12,12,0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  label: {
    fontSize: 15,
  },
  star: {
    position: 'absolute',
    left: 8,
    top: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tail: {
    width: 42,
    height: 1.5,
    borderRadius: 99,
    backgroundColor: '#fff',
    opacity: 0.8,
  },
  head: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#fff',
    marginLeft: -2,
  },
});
