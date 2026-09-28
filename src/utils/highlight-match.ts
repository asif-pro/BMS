// Simple replacement for autosuggest-highlight

export function match(text: string, query: string): [number, number][] {
  if (!query || !text) return [];

  const matches: [number, number][] = [];
  const words = query.trim().toLowerCase().split(/\s+/);
  const lowerText = text.toLowerCase();

  for (const word of words) {
    if (!word) continue;
    let index = lowerText.indexOf(word);
    while (index !== -1) {
      matches.push([index, index + word.length]);
      index = lowerText.indexOf(word, index + 1);
    }
  }

  // Sort matches by start index
  matches.sort((a, b) => a[0] - b[0]);

  // Merge overlapping or adjacent matches
  const merged: [number, number][] = [];
  for (const [start, end] of matches) {
    if (merged.length === 0) {
      merged.push([start, end]);
    } else {
      const prev = merged[merged.length - 1];
      if (start <= prev[1]) {
        prev[1] = Math.max(prev[1], end);
      } else {
        merged.push([start, end]);
      }
    }
  }

  return merged;
}

export function parse(text: string, matches: [number, number][]): { text: string; highlight: boolean }[] {
  if (!matches || matches.length === 0) {
    return [{ text, highlight: false }];
  }

  const parts: { text: string; highlight: boolean }[] = [];
  let lastIndex = 0;

  for (const [start, end] of matches) {
    if (start > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, start),
        highlight: false,
      });
    }
    parts.push({
      text: text.slice(start, end),
      highlight: true,
    });
    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlight: false,
    });
  }

  return parts;
}
