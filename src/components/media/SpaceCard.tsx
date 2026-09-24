import { GlassPress } from '@/components/ui/GlassPress';
import { Mark } from '@/components/ui/Marks';
import { Type } from '@/components/ui/Type';
import { useIsFavorite, useToggleFavorite } from '@/context/FavoritesContext';
import { useTheme } from '@/context/ThemeContext';
import { radius } from '@/theme';
import { previewUrl, SpaceItem } from '@/types/space';
import { formatHudDate, formatShortDate } from '@/utils/dates';
import { detailsHref } from '@/utils/navigation';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { memo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

type Props = {
  item: SpaceItem;
  layout?: 'row' | 'tile' | 'poster' | 'orb' | 'plate';
  height?: number;
  heart?: boolean;
};

function SaveHeart({ kept, onToggle, floating = true }: { kept: boolean; onToggle: () => void; floating?: boolean }) {
  return (
    <View
      accessible
      accessibilityLabel={kept ? 'Remove saved' : 'Save'}
      {...(Platform.OS === 'web'
        ? {
            onClick: (event: { stopPropagation: () => void; preventDefault: () => void }) => {
              event.stopPropagation();
              event.preventDefault();
              onToggle();
            },
          }
        : {
            accessibilityRole: 'button' as const,
            onStartShouldSetResponder: () => true,
            onResponderTerminationRequest: () => false,
            onResponderRelease: () => onToggle(),
          })}
      style={floating ? styles.orbHeart : styles.inlineHeart}
    >
      <Mark name={kept ? 'heartFill' : 'heart'} active={kept} size={14} />
    </View>
  );
}

export const SpaceCard = memo(function SpaceCard({ item, layout = 'row', height = 168, heart = true }: Props) {
  const kept = useIsFavorite(item.id);
  const toggleFavorite = useToggleFavorite();
  const { colors } = useTheme();
  const open = () => router.push(detailsHref(item.id));
  const save = () => toggleFavorite(item);

  if (layout === 'plate') {
    return (
      <View style={styles.plate}>
        <GlassPress accessibilityLabel={item.title} onPress={open} radius={26}>
          <View style={[styles.platePhoto, { backgroundColor: colors.panelHot }]}>
            {previewUrl(item) ? (
              <Image source={{ uri: previewUrl(item) }} style={StyleSheet.absoluteFill} contentFit="cover" transition={160} />
            ) : null}
          </View>
          <View style={styles.plateCopy}>
            <Type variant="title" numberOfLines={1} style={styles.plateTitle}>
              {item.title}
            </Type>
            <Type variant="title" color={colors.muted} numberOfLines={1}>
              {formatShortDate(item.date)}
            </Type>
          </View>
        </GlassPress>
        {heart ? <SaveHeart kept={kept} onToggle={save} /> : null}
      </View>
    );
  }

  if (layout === 'orb') {
    return (
      <View style={styles.orbWrap}>
        <GlassPress accessibilityLabel={item.title} onPress={open} radius={999} style={styles.orbHit}>
          <View style={[styles.orb, { backgroundColor: colors.panelHot, borderColor: colors.hairline }]}>
            {previewUrl(item) ? (
              <Image source={{ uri: previewUrl(item) }} style={StyleSheet.absoluteFill} contentFit="cover" transition={160} />
            ) : null}
          </View>
        </GlassPress>
        {heart ? <SaveHeart kept={kept} onToggle={save} /> : null}
        <Type variant="title" numberOfLines={2} style={styles.orbTitle}>
          {item.title}
        </Type>
      </View>
    );
  }

  return (
    <GlassPress
      accessibilityLabel={item.title}
      onPress={open}
      radius={layout === 'poster' ? 22 : radius.md}
      style={[
        layout === 'poster' ? styles.poster : layout === 'tile' ? styles.tile : styles.row,
        { borderColor: colors.hairline, backgroundColor: colors.panel },
      ]}
    >
      <View
        style={[
          styles.media,
          { backgroundColor: colors.panelHot },
          layout === 'poster' ? styles.posterMedia : layout === 'tile' ? { height } : styles.rowMedia,
        ]}
      >
        {previewUrl(item) ? (
          <Image source={{ uri: previewUrl(item) }} style={StyleSheet.absoluteFill} contentFit="cover" transition={160} />
        ) : null}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={styles.fade} />
        {layout === 'poster' ? null : (
          <View style={[styles.badge, { borderColor: colors.hairline }]}>
            <Type variant="micro" color="#F4F7FF">
              {item.mediaType}
            </Type>
          </View>
        )}
        {item.mediaType === 'video' ? (
          <View style={styles.play}>
            <Mark name="play" size={16} />
          </View>
        ) : null}
      </View>
      <View style={styles.copy}>
        <View style={styles.copyTop}>
          <Type variant="micro">{formatHudDate(item.date)}</Type>
          {heart ? <SaveHeart kept={kept} onToggle={save} floating={false} /> : null}
        </View>
        <Type variant="title" numberOfLines={layout === 'tile' ? 3 : 2} style={{ marginTop: 6, fontSize: layout === 'poster' ? 14 : undefined }}>
          {item.title}
        </Type>
        <Type variant="micro" style={{ marginTop: 8 }} numberOfLines={1}>
          {item.credit}
        </Type>
      </View>
    </GlassPress>
  );
});

const styles = StyleSheet.create({
  row: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    borderRadius: radius.md,
  },
  tile: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    borderRadius: radius.md,
  },
  poster: {
    width: 156,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    borderRadius: 22,
  },
  posterMedia: {
    height: 148,
  },
  media: {
    overflow: 'hidden',
  },
  rowMedia: {
    height: 168,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
  },
  badge: {
    position: 'absolute',
    left: 10,
    top: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.62)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.full,
  },
  play: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.62)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(186, 210, 255, 0.16)',
    borderRadius: 14,
  },
  copy: {
    padding: 14,
  },
  copyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orbWrap: {
    alignItems: 'center',
    position: 'relative',
  },
  orbHit: {
    width: '100%',
    alignItems: 'center',
  },
  orb: {
    width: '78%',
    aspectRatio: 1,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  orbHeart: {
    position: 'absolute',
    top: 8,
    right: '11%',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  inlineHeart: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    gap: 12,
    position: 'relative',
  },
  platePhoto: {
    height: 188,
    borderRadius: 26,
    overflow: 'hidden',
  },
  plateCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 4,
    marginTop: 12,
  },
  plateTitle: {
    flex: 1,
  },
  orbTitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 19,
  },
});
