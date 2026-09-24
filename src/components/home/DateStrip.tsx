import { Type } from '@/components/ui/Type';
import { useApod } from '@/context/ApodContext';
import { useTheme } from '@/context/ThemeContext';
import { previewUrl, SpaceItem } from '@/types/space';
import { detailsHref } from '@/utils/navigation';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export function DateStrip({ activeId, items: propItems }: { activeId?: string; items?: SpaceItem[] }) {
  const { colors } = useTheme();
  const { items: apodItems } = useApod();
  const items = propItems && propItems.length > 0 ? propItems : apodItems;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <Pressable key={item.id} onPress={() => router.push(detailsHref(item.id))} style={styles.chip}>
            <View
              style={[
                styles.orb,
                active && styles.orbActive,
                { borderColor: active ? colors.star : colors.hairline, backgroundColor: colors.panelHot },
              ]}
            >
              {previewUrl(item) ? (
                <Image source={{ uri: previewUrl(item) }} style={StyleSheet.absoluteFill} contentFit="cover" />
              ) : null}
            </View>
            <Type variant="micro" color={active ? colors.star : colors.faint} style={{ marginTop: 8 }} numberOfLines={1}>
              {item.date.slice(5)}
            </Type>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 16,
    paddingRight: 12,
  },
  chip: {
    width: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  orbActive: {
    borderWidth: 1.5,
  },
});
