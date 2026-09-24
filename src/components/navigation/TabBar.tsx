import { Mark } from '@/components/ui/Marks';
import { useTheme } from '@/context/ThemeContext';
import { layout } from '@/theme';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, Pressable, StyleSheet, View, type RefObject } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LABELS: Record<string, { label: string; mark: 'home' | 'gallery' | 'search' | 'saved' }> = {
  home: { label: 'Home', mark: 'home' },
  gallery: { label: 'Gallery', mark: 'gallery' },
  search: { label: 'Search', mark: 'search' },
  saved: { label: 'Saved', mark: 'saved' },
};

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0] & {
  blurTarget?: RefObject<View | null>;
};

export function SpaceTabBar({ state, navigation, blurTarget }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { pointerEvents: 'box-none' }]}>
      <View style={[styles.shell, { borderColor: 'rgba(255,255,255,0.28)' }]}>
        <BlurView
          intensity={Platform.OS === 'android' ? 48 : 64}
          tint="dark"
          {...(Platform.OS === 'android' ? { blurMethod: 'dimezisBlurView' as const, blurTarget } : null)}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.42)' }]} />
        <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10), borderColor: colors.hairlineStrong }]}>
          {state.routes.map((route, index) => {
            const meta = LABELS[route.name] ?? { label: route.name, mark: 'home' as const };
            const active = state.index === index;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityLabel={meta.label}
                onPress={() => {
                  const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!active && !event.defaultPrevented) navigation.navigate(route.name);
                }}
                style={styles.item}
              >
                <Mark name={meta.mark} active={active} size={24} />
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  shell: {
    width: '100%',
    maxWidth: layout.phone,
    overflow: 'hidden',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  bar: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});
