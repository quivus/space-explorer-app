import { CategoryRail } from '@/components/navigation/CategoryRail';
import { SpaceCard } from '@/components/media/SpaceCard';
import { GlassPress } from '@/components/ui/GlassPress';
import { Screen } from '@/components/ui/Screen';
import { Type } from '@/components/ui/Type';
import { useApod } from '@/context/ApodContext';
import { useTheme } from '@/context/ThemeContext';
import { SOLAR_PLANETS, type SolarPlanet } from '@/data/planets';
import { CategoryFilter, SpaceItem } from '@/types/space';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'galaxy', label: 'Galaxies' },
  { id: 'nebula', label: 'Nebulae' },
  { id: 'planet', label: 'Planets' },
  { id: 'earth', label: 'Earth' },
  { id: 'moon', label: 'Moon' },
];

const LIVE_FILTERS = new Set<CategoryFilter>(['all', 'galaxy', 'nebula', 'planet', 'earth', 'moon']);

export default function GalleryScreen() {
  const { items: liveItems } = useApod();
  const params = useLocalSearchParams<{ filter?: string; at?: string }>();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const seen = useRef('');

  useEffect(() => {
    const next = params.filter;
    if (next && LIVE_FILTERS.has(next as CategoryFilter) && params.at && params.at !== seen.current) {
      seen.current = params.at;
      setFilter(next as CategoryFilter);
    }
  }, [params.filter, params.at]);

  const allItems = liveItems;

  const visible = useMemo(
    () => allItems.filter((item) => filter === 'all' || item.category === filter),
    [allItems, filter],
  );
  const header = (
    <CategoryRail
      items={FILTERS}
      value={filter}
      pinFirst
      onChange={(id) => setFilter(id as CategoryFilter)}
    />
  );

  return (
    <Screen hasSky={false}>
      <View style={styles.rail}>{header}</View>
      {filter === 'planet' ? (
        <FlatList
          data={SOLAR_PLANETS}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <PlanetCard planet={item} />}
          ItemSeparatorComponent={RowSeparator}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          key={filter}
          data={visible}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SpaceCard item={item} layout="plate" heart={false} />}
          ItemSeparatorComponent={RowSeparator}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}

function PlanetCard({ planet }: { planet: SolarPlanet }) {
  const { colors } = useTheme();
  return (
    <GlassPress
      accessibilityLabel={planet.name}
      onPress={() => router.push(`/planet/${planet.name}`)}
      radius={28}
      style={styles.planet}
    >
      <View style={[styles.planetPhoto, { backgroundColor: colors.panelHot }]}>
        <Image source={{ uri: planet.image }} style={StyleSheet.absoluteFill} contentFit="contain" />
      </View>
      <View style={styles.planetCopy}>
        <Type variant="title">{planet.name}</Type>
        <Type variant="title" color={colors.muted}>
          {planet.distance}
        </Type>
      </View>
    </GlassPress>
  );
}

function RowSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  rail: {
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  planet: {
    gap: 12,
  },
  planetPhoto: {
    width: '72%',
    maxWidth: 260,
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 999,
    overflow: 'hidden',
  },
  planetCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  columns: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  col: {
    flex: 1,
  },
  separator: {
    height: 22,
  },
});
