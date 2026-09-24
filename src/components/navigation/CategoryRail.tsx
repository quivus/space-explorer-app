import { Type } from '@/components/ui/Type';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useRef } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Item = { id: string; label: string };

type Box = { x: number; width: number; height: number };

export function CategoryRail({
  items,
  value,
  onChange,
  pinFirst = false,
}: {
  items: Item[];
  value: string;
  onChange: (id: string) => void;
  pinFirst?: boolean;
}) {
  const { colors } = useTheme();
  const pinned = pinFirst ? items[0] : undefined;
  const scrolling = pinFirst ? items.slice(1) : items;
  const scrollRef = useRef<ScrollView>(null);
  const boxes = useRef<Record<string, Box>>({});
  const x = useSharedValue(0);
  const width = useSharedValue(0);
  const ready = useRef(false);

  const place = (id: string, animate: boolean) => {
    const box = boxes.current[id];
    if (!box || pinned?.id === id) return;
    const timing = { duration: 160, easing: Easing.out(Easing.cubic) };
    x.value = animate ? withTiming(box.x, timing) : box.x;
    width.value = animate ? withTiming(box.width, timing) : box.width;
    scrollRef.current?.scrollTo({ x: Math.max(0, box.x - 24), animated: animate });
  };

  useEffect(() => {
    place(value, ready.current);
    ready.current = true;
  }, [value]);

  const orb = useAnimatedStyle(() => ({
    width: width.value,
    transform: [{ translateX: x.value }],
  }));

  const chip = (item: Item) => {
    const active = item.id === value;
    return (
      <Pressable
        key={item.id}
        accessibilityRole="button"
        accessibilityLabel={item.label}
        accessibilityState={{ selected: active }}
        onPress={() => onChange(item.id)}
        onLayout={(event) => {
          boxes.current[item.id] = event.nativeEvent.layout;
          if (item.id === value) place(value, ready.current);
        }}
        style={styles.chip}
      >
        <Type variant="micro" numberOfLines={1} color={active ? colors.star : colors.faint} style={styles.label}>
          {item.label}
        </Type>
      </Pressable>
    );
  };

  const glass = value !== pinned?.id;

  return (
    <View style={styles.row}>
      {pinned ? (
        <View style={styles.pin}>
          <View style={styles.pinChip}>
            {value === pinned.id ? (
              <View
                pointerEvents="none"
                {...(Platform.OS === 'web' ? { dataSet: { glass: '1' } } : null)}
                style={styles.pinGlass}
              />
            ) : null}
            {chip(pinned)}
          </View>
          <View style={[styles.bar, { backgroundColor: colors.hairlineStrong }]} />
        </View>
      ) : null}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.track}>
          {glass ? (
            <Animated.View
              pointerEvents="none"
              {...(Platform.OS === 'web' ? { dataSet: { glass: '1' } } : null)}
              style={[styles.orb, orb]}
            />
          ) : null}
          {scrolling.map(chip)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  pin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinChip: {
    position: 'relative',
  },
  pinGlass: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 7,
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  bar: {
    width: 1,
    height: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  scroll: {
    alignItems: 'center',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    position: 'relative',
    height: 40,
  },
  orb: {
    position: 'absolute',
    top: 7,
    left: 0,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  chip: {
    height: 40,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: {
    letterSpacing: 1.2,
    lineHeight: 16,
  },
});
