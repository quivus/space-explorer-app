import { useTheme } from '@/context/ThemeContext';
import { fonts } from '@/theme';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

type Run = { text: string; bold?: boolean; italic?: boolean };

const MEASURE =
  /\d[\d,.]*(?:\s*(?:to|-|–)\s*\d[\d,.]*)?\s*(?:million|billion|thousand)?\s*(?:km|light-years?|hours?|days?|years?|moons?|m\/s²|AU)\b/gi;

export function paragraphsOf(text: string): string[] {
  const body = text.replace(/\r\n/g, '\n').trim();
  const blocks = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/[ \t]*\n[ \t]*/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  return blocks.flatMap((paragraph) => {
    if (paragraph.length < 320) return [paragraph];
    const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length < 3) return [paragraph];
    const grouped: string[] = [];
    for (let index = 0; index < sentences.length; index += 2) {
      grouped.push(sentences.slice(index, index + 2).join(' '));
    }
    return grouped;
  });
}

function emphasize(paragraph: string): Run[] {
  const marked = paragraph.includes('**') || /\*[^*]+\*/.test(paragraph);
  return marked ? parseMarks(paragraph) : autoEmphasis(paragraph);
}

function parseMarks(paragraph: string): Run[] {
  const runs: Run[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let cursor = 0;
  for (const match of paragraph.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) runs.push({ text: paragraph.slice(cursor, start) });
    if (match[1]) runs.push({ text: match[1], bold: true });
    else if (match[2]) runs.push({ text: match[2], italic: true });
    cursor = start + match[0].length;
  }
  if (cursor < paragraph.length) runs.push({ text: paragraph.slice(cursor) });
  return runs;
}

function autoEmphasis(paragraph: string): Run[] {
  const spans: { start: number; end: number; bold?: boolean; italic?: boolean }[] = [];

  for (const match of paragraph.matchAll(MEASURE)) {
    const start = match.index ?? 0;
    spans.push({ start, end: start + match[0].length, bold: true });
  }

  for (const match of paragraph.matchAll(/"([^"]+)"/g)) {
    const start = match.index ?? 0;
    spans.push({ start: start + 1, end: start + 1 + match[1].length, italic: true });
  }

  const known = paragraph.match(/(?:known as|called|nicknamed)\s+(?:the\s+)?([^.,;]+)/i);
  if (known?.index != null) {
    const lead = known[0].length - known[1].length;
    spans.push({ start: known.index + lead, end: known.index + known[0].length, italic: true });
  }

  const sorted = spans
    .filter((span) => span.end > span.start)
    .sort((a, b) => a.start - b.start)
    .filter((span, index, list) => index === 0 || span.start >= list[index - 1].end);

  if (!sorted.length) return [{ text: paragraph }];

  const runs: Run[] = [];
  let cursor = 0;
  for (const span of sorted) {
    if (span.start > cursor) runs.push({ text: paragraph.slice(cursor, span.start) });
    runs.push({ text: paragraph.slice(span.start, span.end), bold: span.bold, italic: span.italic });
    cursor = span.end;
  }
  if (cursor < paragraph.length) runs.push({ text: paragraph.slice(cursor) });
  return runs;
}

export function Prose({ text, style }: { text: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  const paragraphs = paragraphsOf(text);

  return (
    <View style={style}>
      {paragraphs.map((paragraph, index) => (
        <Text
          key={`${index}-${paragraph.slice(0, 24)}`}
          style={{
            marginTop: index === 0 ? 0 : 12,
            color: colors.star,
            fontFamily: fonts.regular,
            fontSize: 15,
            lineHeight: 23,
            textAlign: 'justify',
          }}
        >
          {emphasize(paragraph).map((run, runIndex) => (
            <Text
              key={runIndex}
              style={{
                fontFamily: run.bold ? fonts.bold : fonts.regular,
                fontStyle: run.italic ? 'italic' : 'normal',
              }}
            >
              {run.text}
            </Text>
          ))}
        </Text>
      ))}
    </View>
  );
}
