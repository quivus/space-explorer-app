import { SpaceGrotesk_300Light, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold, useFonts } from '@expo-google-fonts/space-grotesk';
import { ApodProvider } from '@/context/ApodContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { SavedFlash } from '@/components/ui/SavedFlash';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ApodProvider>
          <FavoritesProvider>
            <ThemedStack />
          </FavoritesProvider>
        </ApodProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function ThemedStack() {
  const { colors, mode, ready } = useTheme();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <SavedFlash />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.void },
          animation: 'fade',
          animationDuration: 140,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="details/[id]" options={{ animation: 'fade', animationDuration: 150 }} />
        <Stack.Screen name="planet/[name]" options={{ animation: 'fade', animationDuration: 150 }} />
      </Stack>
    </>
  );
}
