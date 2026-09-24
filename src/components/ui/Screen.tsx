import { SettingsButton } from '@/components/ui/SettingsButton';
import { Image } from 'expo-image';
import { StarField } from '@/components/ui/StarField';
import { useTheme } from '@/context/ThemeContext';
import { layout } from '@/theme';
import { router, useIsFocused } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  tabInset?: boolean;
  settings?: boolean;
  hasSky?: boolean;
  meteors?: boolean;
  refreshControl?: ScrollViewProps['refreshControl'];
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  style?: ViewStyle;
  backdrop?: ReactNode;
  logo?: boolean;
};

export function SkyBackground({ meteors = true }: { meteors?: boolean }) {
  const { colors } = useTheme();

  return (
    <View pointerEvents="none" style={[styles.sky, { backgroundColor: colors.void }]}>
      <LinearGradient colors={[colors.sky[0], colors.sky[1], colors.sky[2]]} style={StyleSheet.absoluteFill} />
      <StarField meteors={meteors} />
    </View>
  );
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  tabInset = true,
  settings = true,
  hasSky = true,
  meteors = true,
  refreshControl,
  contentContainerStyle,
  style,
  backdrop,
  logo = true,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const focused = useIsFocused();
  const bottomGap = (tabInset ? layout.tabBar + 22 : 16) + insets.bottom;
  const padding = {
    paddingHorizontal: padded ? 20 : 0,
    paddingTop: logo ? 0 : Math.max(insets.top, 12),
    paddingBottom: bottomGap,
  };

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: hasSky ? colors.void : 'transparent',
          opacity: focused ? 1 : 0,
          pointerEvents: focused ? 'auto' : 'none',
        },
      ]}
    >
      {hasSky ? <SkyBackground meteors={meteors} /> : null}
      <View style={[styles.frame, backdrop ? styles.stage : null, style]}>
        {backdrop}
        {logo ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Space Explorer"
            onPress={() => router.replace('/')}
            style={{ marginTop: Math.max(insets.top, 12) }}
          >
            <Image
              source={require('../../../assets/images/SpaceExplorerMark.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </Pressable>
        ) : null}
        {scroll ? (
          <ScrollView
            style={styles.scroller}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[padding, contentContainerStyle]}
            refreshControl={refreshControl}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.fill, padding, contentContainerStyle as ViewStyle]}>{children}</View>
        )}
      </View>
      {settings ? <SettingsButton /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  sky: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? layout.phone : undefined,
    minHeight: 0,
  },
  scroller: {
    flex: 1,
    minHeight: 0,
  },
  stage: {
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  logo: {
    width: 132,
    aspectRatio: 274 / 85,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 36,
  },
});
