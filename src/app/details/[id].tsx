import { Toast } from '@/components/ui/Chrome';
import { GlassPress } from '@/components/ui/GlassPress';
import { Mark } from '@/components/ui/Marks';
import { paragraphsOf, Prose } from '@/components/ui/Prose';
import { Screen } from '@/components/ui/Screen';
import { Type } from '@/components/ui/Type';
import { useApod } from '@/context/ApodContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useTheme } from '@/context/ThemeContext';
import { getById } from '@/data/catalog';
import { fetchApodByDate, getCachedApodItems } from '@/services/apod';
import { detailImageUrl, SpaceItem } from '@/types/space';
import { formatHudDate, formatShortDate } from '@/utils/dates';
import { detailsHref } from '@/utils/navigation';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, useWindowDimensions, View } from 'react-native';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItemById, getNeighbors } = useApod();
  const contextItem = id ? getItemById(id) : undefined;
  const [fetchedItem, setFetchedItem] = useState<SpaceItem | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const { items: favoriteItems, hydrated: favoritesHydrated, error: favoritesError, isFavorite, toggleFavorite } = useFavorites();
  const { colors } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const [notice, setNotice] = useState<string | null>(null);

  const catalogItem = id ? getById(id) : undefined;
  const favoriteItem = id ? favoriteItems.find((favorite) => favorite.id === id) : undefined;
  const savedItem = favoriteItem && !isCatalogItem(favoriteItem, catalogItem) ? favoriteItem : undefined;
  const item = contextItem || savedItem || (fetchedItem?.id === id ? fetchedItem : null) || catalogItem;

  useEffect(() => {
    if (contextItem || savedItem) return;
    if ((!favoritesHydrated && !favoritesError) || !id) return;

    let cancelled = false;
    getCachedApodItems()
      .then((cached) => {
        const cachedItem = cached.find((candidate) => candidate.id === id);
        if (cachedItem) {
          if (!cancelled) setFetchedItem(cachedItem);
          return null;
        }
        if (catalogItem) return null;
        return fetchApodByDate(id);
      })
      .then((result) => {
        if (!cancelled && result?.id === id) setFetchedItem(result);
      })
      .finally(() => {
        if (!cancelled) setLoadedId(id);
      });

    return () => {
      cancelled = true;
    };
  }, [contextItem, savedItem, catalogItem, favoritesHydrated, favoritesError, id]);

  const handleShare = async () => {
    if (!item) return;
    try {
      await Share.share({
        title: item.title,
        message: `${item.title} (${item.date})\n${item.explanation}\n\nNASA APOD: ${item.url}`,
      });
    } catch {
      setNotice('Unable to share item.');
    }
  };

  const handleOpenVideo = async () => {
    if (!item || item.mediaType !== 'video') return;
    try {
      await WebBrowser.openBrowserAsync(item.url);
    } catch {
      setNotice('Could not open video URL.');
    }
  };

  if ((!item && id && loadedId !== id) || (!item && !favoritesHydrated && !favoritesError)) {
    return (
      <Screen tabInset={false}>
        <BackBar />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.spark} />
          <Type variant="micro" color={colors.muted} style={{ marginTop: 12 }}>
            Loading plate from NASA…
          </Type>
        </View>
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen tabInset={false}>
        <BackBar />
        <Type variant="headline" style={{ marginTop: 18 }}>
          This plate drifted out of the archive.
        </Type>
      </Screen>
    );
  }

  const kept = isFavorite(item.id);
  const { prev, next } = getNeighbors(item.id);
  const plate = Math.min(280, Math.max(220, windowHeight * 0.34));

  return (
    <Screen tabInset={false} scroll settings={false} contentContainerStyle={{ paddingTop: 8 }}>
      <View style={styles.topBar}>
        <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Close" style={styles.iconHit}>
          <Mark name="back" size={18} />
        </Pressable>
        <Type variant="title" numberOfLines={1} style={styles.topTitle}>
          {item.title}
        </Type>
        <View style={styles.tools}>
          <Pressable onPress={handleShare} accessibilityRole="button" accessibilityLabel="Share" style={styles.iconHit}>
            <Mark name="share" size={18} />
          </Pressable>
          <Pressable
            onPress={() => toggleFavorite(item)}
            accessibilityRole="button"
            accessibilityLabel={kept ? 'Remove saved' : 'Save'}
            style={styles.iconHit}
          >
            <Mark name={kept ? 'heartFill' : 'heart'} active={kept} size={20} />
          </Pressable>
        </View>
      </View>

      <View style={styles.heroBlock}>
        <View style={[styles.hero, { width: plate, height: plate, backgroundColor: colors.panelHot, borderColor: colors.hairline }]}>
          {detailImageUrl(item) ? (
            <Image source={{ uri: detailImageUrl(item) }} style={StyleSheet.absoluteFill} contentFit="cover" transition={350} />
          ) : null}
          {item.mediaType === 'video' ? (
            <Pressable onPress={handleOpenVideo} accessibilityRole="button" accessibilityLabel="Play Video" style={styles.watchPill}>
              <Mark name="play" size={16} />
            </Pressable>
          ) : null}
        </View>
        <Type variant="headline" numberOfLines={3} style={styles.heroTitle}>
          {item.title}
        </Type>
        <View style={styles.stats}>
          <Stat label="Date" value={formatShortDate(item.date)} />
          <Stat label="Field" value={cap(item.category)} />
        </View>
      </View>

      <View style={[styles.about, { backgroundColor: colors.panel, borderColor: colors.hairline }]}>
        <Type variant="micro">About</Type>
        <Type variant="micro" color={colors.gold} style={{ marginTop: 8 }}>
          {item.credit}
        </Type>
        <Explanation key={item.id} text={item.explanation} />
        <Type variant="micro" color={colors.faint} style={{ marginTop: 12 }}>
          {formatHudDate(item.date)}
        </Type>
      </View>
      {notice ? <Toast message={notice} /> : null}

      {prev || next ? (
        <View style={styles.thumbs}>
          {prev ? <Neighbor item={prev} /> : <View style={styles.thumbSlot} />}
          {next ? <Neighbor item={next} /> : <View style={styles.thumbSlot} />}
        </View>
      ) : null}
    </Screen>
  );
}

function shortPassage(text: string): { preview: string; canExpand: boolean } {
  const paragraphs = paragraphsOf(text);
  const first = paragraphs[0] ?? text.trim();
  const sentences = first.split(/(?<=[.!?])\s+/).filter(Boolean);
  const preview = sentences.length > 2 && first.length > 220 ? sentences.slice(0, 2).join(' ') : first;
  const full = paragraphs.join(' ');
  return { preview, canExpand: preview.length < full.length };
}

function Explanation({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const { preview, canExpand } = shortPassage(text);

  return (
    <View>
      <Prose text={open ? text : preview} style={{ marginTop: 10 }} />
      {canExpand ? (
        <Pressable
          onPress={() => setOpen((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel={open ? 'Show less' : 'Show more'}
          hitSlop={8}
          style={styles.more}
        >
          <Type variant="title" style={styles.moreLabel}>
            {open ? 'Show less' : 'Show more'}
          </Type>
        </Pressable>
      ) : null}
    </View>
  );
}

function cap(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Type variant="micro">{label}</Type>
      <Type variant="title" numberOfLines={1} style={styles.statValue}>
        {value}
      </Type>
    </View>
  );
}

function Neighbor({ item }: { item: SpaceItem }) {
  const { colors } = useTheme();
  return (
    <GlassPress
      onPress={() => router.replace(detailsHref(item.id))}
      style={styles.thumbSlot}
      accessibilityLabel={item.title}
      radius={18}
    >
      <View style={[styles.thumb, { backgroundColor: colors.panelHot, borderColor: colors.hairline }]}>
        {detailImageUrl(item) ? (
          <Image source={{ uri: detailImageUrl(item) }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : null}
      </View>
    </GlassPress>
  );
}

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/home');
}

function isCatalogItem(item: SpaceItem | undefined, catalogItem: SpaceItem | undefined): boolean {
  return Boolean(
    item &&
      catalogItem &&
      item.id === catalogItem.id &&
      item.date === catalogItem.date &&
      item.title === catalogItem.title &&
      item.explanation === catalogItem.explanation &&
      item.credit === catalogItem.credit &&
      item.url === catalogItem.url &&
      item.hdurl === catalogItem.hdurl &&
      item.mediaType === catalogItem.mediaType &&
      item.category === catalogItem.category &&
      item.thumbnail === catalogItem.thumbnail,
  );
}

function BackBar() {
  const { colors } = useTheme();
  return (
    <Pressable onPress={goBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Close">
      <Mark name="back" size={16} />
      <Type variant="micro" color={colors.star}>
        Close
      </Type>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
  },
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconHit: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBlock: {
    alignItems: 'center',
    marginTop: 12,
  },
  hero: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    marginTop: 22,
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 32,
  },
  stats: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 22,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    textAlign: 'center',
    fontSize: 15,
  },
  about: {
    marginTop: 28,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
  },
  more: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  moreLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  thumbs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 22,
  },
  thumbSlot: {
    width: 72,
    alignItems: 'center',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  watchPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
});
