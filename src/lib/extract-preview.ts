export function extractPreview(pageContent: string): string {
  const trimmed = pageContent.trim();
  if (!trimmed) {
    return '';
  }

  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs) {
    const lines = paragraph
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (line.match(/^[-*•]\s/)) {
        continue;
      }
      if (line.startsWith('#')) {
        continue;
      }
      return line;
    }
  }

  return '';
}
