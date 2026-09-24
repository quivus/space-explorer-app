import { useTheme } from '@/context/ThemeContext';
import { radius } from '@/theme';
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Type } from './Type';

export function Hairline({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme();
  return <View style={[styles.line, { backgroundColor: colors.hairline }, style]} />;
}

export function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      {...(Platform.OS === 'web' && !active ? { dataSet: { glass: '1' } } : null)}
      style={[
        styles.pill,
        { borderColor: colors.hairline, backgroundColor: active ? colors.spark : colors.panel },
        active && { borderColor: colors.spark },
      ]}
    >
      <Type variant="micro" color={active ? colors.onAccent : colors.muted}>
        {label}
      </Type>
    </Pressable>
  );
}

export function Toast({ message }: { message: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.toast, { borderColor: colors.aurora, backgroundColor: colors.auroraDim }]}>
      <Type variant="micro" color={colors.aurora}>
        {message}
      </Type>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.full,
  },
  toast: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
