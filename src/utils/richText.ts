/**
 * Safe inline rich-text HTML utilities for Process narratives.
 * Allows only inline text formatting (bold, italic, underline, strikethrough),
 * line/paragraph breaks, and bounded relative font-size deltas (-10px..+10px).
 */

export const MIN_FONT_SIZE_DELTA = -10;
export const MAX_FONT_SIZE_DELTA = 10;
export const FONT_SIZE_STEP = 2;

const ALLOWED_RICH_TAG_RE =
  /<\/?(?:b|strong|i|em|u|s|strike|del|span|br|p|div)(?:\s+[^>]*)?>/i;

export function clampFontSizeDelta(delta: number): number {
  if (!Number.isFinite(delta)) return 0;
  const rounded = Math.round(delta);
  return Math.max(MIN_FONT_SIZE_DELTA, Math.min(MAX_FONT_SIZE_DELTA, rounded));
}

export function formatDeltaFontSizeCss(delta: number): string {
  const clamped = clampFontSizeDelta(delta);
  if (clamped > 0) return `calc(1em + ${clamped}px)`;
  if (clamped < 0) return `calc(1em - ${Math.abs(clamped)}px)`;
  return '';
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseDeltaFromSpan(el: HTMLElement): number {
  const attr = el.getAttribute('data-fs-delta');
  if (attr !== null && attr.trim() !== '') {
    const parsed = parseInt(attr, 10);
    if (!Number.isNaN(parsed)) {
      return clampFontSizeDelta(parsed);
    }
  }

  const fontSize = el.style?.fontSize || '';
  const plusMatch = fontSize.match(/calc\(\s*1em\s*\+\s*(\d+)px\s*\)/i);
  if (plusMatch) {
    return clampFontSizeDelta(parseInt(plusMatch[1], 10));
  }
  const minusMatch = fontSize.match(/calc\(\s*1em\s*-\s*(\d+)px\s*\)/i);
  if (minusMatch) {
    return clampFontSizeDelta(-parseInt(minusMatch[1], 10));
  }
  return 0;
}

function serializeSanitizedNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtmlText(node.textContent || '');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  if (
    tag === 'script' ||
    tag === 'style' ||
    tag === 'iframe' ||
    tag === 'object' ||
    tag === 'embed' ||
    tag === 'svg'
  ) {
    return '';
  }

  if (tag === 'br') {
    return '<br>';
  }

  const childrenHtml = Array.from(el.childNodes).map(serializeSanitizedNode).join('');

  if (tag === 'strong' || tag === 'b') {
    return childrenHtml ? `<b>${childrenHtml}</b>` : '';
  }
  if (tag === 'em' || tag === 'i') {
    return childrenHtml ? `<i>${childrenHtml}</i>` : '';
  }
  if (tag === 'u') {
    return childrenHtml ? `<u>${childrenHtml}</u>` : '';
  }
  if (tag === 's' || tag === 'strike' || tag === 'del') {
    return childrenHtml ? `<s>${childrenHtml}</s>` : '';
  }
  if (tag === 'p' || tag === 'div') {
    // Preserve line breaks created by contentEditable Enter
    return `<${tag}>${childrenHtml || '<br>'}</${tag}>`;
  }
  if (tag === 'span') {
    if (!childrenHtml) return '';

    let wrapped = childrenHtml;
    const fontWeight = el.style?.fontWeight || '';
    const fontStyle = el.style?.fontStyle || '';
    const textDec = (el.style?.textDecorationLine || el.style?.textDecoration || '').toLowerCase();

    if (fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600) {
      wrapped = `<b>${wrapped}</b>`;
    }
    if (fontStyle === 'italic') {
      wrapped = `<i>${wrapped}</i>`;
    }
    if (textDec.includes('underline')) {
      wrapped = `<u>${wrapped}</u>`;
    }
    if (textDec.includes('line-through')) {
      wrapped = `<s>${wrapped}</s>`;
    }

    const delta = parseDeltaFromSpan(el);
    if (delta !== 0) {
      return `<span data-fs-delta="${delta}" style="font-size: ${formatDeltaFontSizeCss(delta)}">${wrapped}</span>`;
    }
    return wrapped;
  }

  return childrenHtml;
}

/**
 * Sanitizes a Process text string into safe inline rich-text HTML.
 * Legacy plain-text descriptions (including newlines and &, <, >) are preserved faithfully.
 */
export function sanitizeRichTextHtml(raw: string | undefined | null): string {
  if (!raw) return '';

  // Plain-text path for legacy descriptions without rich-text tags
  if (!ALLOWED_RICH_TAG_RE.test(raw)) {
    return escapeHtmlText(raw).replace(/\r?\n/g, '<br>');
  }

  if (typeof DOMParser === 'undefined') {
    return escapeHtmlText(raw).replace(/\r?\n/g, '<br>');
  }

  const doc = new DOMParser().parseFromString(raw, 'text/html');
  return Array.from(doc.body.childNodes).map(serializeSanitizedNode).join('');
}

/**
 * Strips rich-text HTML tags into plain text (for titles, alt text, and empty checks).
 */
export function stripRichTextHtml(raw: string | undefined | null): string {
  if (!raw) return '';
  if (!ALLOWED_RICH_TAG_RE.test(raw)) return raw;

  if (typeof DOMParser === 'undefined') {
    return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const normalized = raw.replace(/<(?:br|\/p|\/div)\s*\/?>/gi, ' ');
  const doc = new DOMParser().parseFromString(normalized, 'text/html');
  return (doc.body.textContent || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}

export function hasRichTextContent(raw: string | undefined | null): boolean {
  return stripRichTextHtml(raw).length > 0;
}
