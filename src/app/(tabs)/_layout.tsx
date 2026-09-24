import { SpaceTabBar } from '@/components/navigation/TabBar';
import { SkyBackground } from '@/components/ui/Screen';
import { useTheme } from '@/context/ThemeContext';
import { BlurTargetView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

export default function TabsLayout() {
  const { colors } = useTheme();
  const blurTarget = useRef<View | null>(null);

  return (
    <BlurTargetView ref={blurTarget} style={[styles.container, { backgroundColor: colors.void }]}>
      <SkyBackground />
      <Tabs
        tabBar={(props) => <SpaceTabBar {...props} blurTarget={blurTarget} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="gallery" options={{ title: 'Gallery' }} />
        <Tabs.Screen name="search" options={{ title: 'Search' }} />
        <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
      </Tabs>
    </BlurTargetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
