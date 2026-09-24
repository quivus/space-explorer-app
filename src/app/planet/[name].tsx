import { Mark } from '@/components/ui/Marks';
import { GlassPress } from '@/components/ui/GlassPress';
import { Screen } from '@/components/ui/Screen';
import { Prose } from '@/components/ui/Prose';
import { Type } from '@/components/ui/Type';
import { useTheme } from '@/context/ThemeContext';
import { planetByName, SOLAR_PLANETS } from '@/data/planets';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

export default function PlanetScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const planet = name ? planetByName(name) : undefined;
  const { colors } = useTheme();

  if (!planet) {
    return (
      <Screen tabInset={false} settings={false}>
        <Pressable onPress={goBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Close">
          <Mark name="back" size={18} />
        </Pressable>
        <Type variant="headline" style={{ marginTop: 18 }}>
          That planet is outside the catalog.
        </Type>
      </Screen>
    );
  }

  const similar = SOLAR_PLANETS.filter((item) => item.name !== planet.name).slice(0, 4);

  return (
    <Screen tabInset={false} scroll settings={false} contentContainerStyle={{ paddingTop: 8 }}>
      <Pressable onPress={goBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Close">
        <Mark name="back" size={18} />
      </Pressable>

      <View style={[styles.hero, { backgroundColor: colors.panelHot }]}>
        <Image source={{ uri: planet.image }} style={StyleSheet.absoluteFill} contentFit="contain" />
      </View>

      <View style={styles.titleRow}>
        <Type variant="headline" style={styles.name}>
          {planet.name}
        </Type>
        <Type variant="title" style={styles.distance}>
          {planet.distance}
        </Type>
      </View>
      <Type variant="micro" color={colors.faint}>
        from the Sun
      </Type>

      <Type variant="title" style={styles.section}>
        Specifications
      </Type>
      <View style={styles.grid}>
        {planet.specs.map((spec) => (
          <View
            key={spec.label}
            {...(Platform.OS === 'web' ? { dataSet: { glass: '1' } } : null)}
            style={[styles.spec, { backgroundColor: colors.panel, borderColor: colors.hairline }]}
          >
            <Type variant="micro">{spec.label}</Type>
            <Type variant="title" style={{ marginTop: 8 }}>
              {spec.value}
            </Type>
          </View>
        ))}
      </View>

      <Prose text={planet.description} style={{ marginTop: 18 }} />

      <Type variant="title" style={styles.section}>
        Similar planets
      </Type>
      <View style={styles.similar}>
        {similar.map((item) => (
          <GlassPress
            key={item.name}
            onPress={() => router.replace(`/planet/${item.name}`)}
            accessibilityLabel={item.name}
            radius={18}
            style={styles.thumbWrap}
          >
            <View style={[styles.thumb, { backgroundColor: colors.panelHot }]}>
              <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="contain" />
            </View>
            <Type variant="micro" numberOfLines={1} style={styles.thumbLabel}>
              {item.name}
            </Type>
          </GlassPress>
        ))}
      </View>
    </Screen>
  );
}

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/gallery');
}

const styles = StyleSheet.create({
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  hero: {
    width: '78%',
    maxWidth: 280,
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 999,
    overflow: 'hidden',
  },
  titleRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    fontSize: 32,
    lineHeight: 36,
    flex: 1,
  },
  distance: {
    textAlign: 'right',
  },
  section: {
    marginTop: 26,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  spec: {
    width: '48%',
    flexGrow: 1,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  similar: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbWrap: {
    width: 72,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  thumbLabel: {
    marginTop: 6,
    textAlign: 'center',
  },
});
