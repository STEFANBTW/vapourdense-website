import { Project } from '../types/portfolio';

export interface UploadedMediaItem {
  url: string;
  label: string;
  source: 'gallery' | 'process';
}

/**
 * Returns all unique visual media items currently present in the project's
 * Gallery and Process sections. If the user has deleted all pictures from
 * both sections, this returns an empty array `[]`.
 */
export function getUploadedProjectMedia(project: Project): UploadedMediaItem[] {
  const items: UploadedMediaItem[] = [];
  const seen = new Set<string>();

  const gallery =
    project.galleryPictures !== undefined
      ? project.galleryPictures
      : (project.images || []).map((url, idx) => ({
          id: `gal-${idx}`,
          url,
          caption: '',
        }));

  gallery.forEach((pic, idx) => {
    const url = pic?.url?.trim();
    if (url && !seen.has(url)) {
      seen.add(url);
      items.push({
        url,
        label: pic.caption?.trim() || `Gallery #${idx + 1}`,
        source: 'gallery',
      });
    }
  });

  const steps = project.processSteps !== undefined ? project.processSteps : [];
  steps.forEach((step, sIdx) => {
    (step?.pictures || []).forEach((pic, pIdx) => {
      const url = pic?.url?.trim();
      if (url && !seen.has(url)) {
        seen.add(url);
        items.push({
          url,
          label: pic.caption?.trim() || `${step.name || `Phase ${sIdx + 1}`} #${pIdx + 1}`,
          source: 'process',
        });
      }
    });
  });

  return items;
}

/**
 * Resolves the thumbnail URL for a project strictly from its uploaded media.
 * - If there is no uploaded media in Gallery or Process, returns `null` (no thumbnail).
 * - If the project's selected `imageUrl` (or `images[0]`) is present in the uploaded media, returns it.
 * - Otherwise falls back to the first available uploaded media item.
 */
export function getProjectThumbnail(project: Project): string | null {
  const media = getUploadedProjectMedia(project);
  if (media.length === 0) {
    return null;
  }

  const preferred = project.imageUrl?.trim() || project.images?.[0]?.trim();
  if (preferred && media.some(item => item.url === preferred)) {
    return preferred;
  }

  return media[0].url;
}

// ---------------------------------------------------------------------------
// Currency options & formatting
// ---------------------------------------------------------------------------

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCY_OPTIONS: readonly CurrencyOption[] = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham' },
] as const;

/**
 * Infers the currency code from an explicit `currency` field or a legacy `price` string.
 */
export function detectCurrencyCode(price?: string, explicitCurrency?: string): string {
  if (explicitCurrency && CURRENCY_OPTIONS.some(c => c.code === explicitCurrency)) {
    return explicitCurrency;
  }
  const raw = (price || '').trim();
  if (!raw) return 'NGN';

  for (const opt of CURRENCY_OPTIONS) {
    const codeRegex = new RegExp(`\\b${opt.code}\\b`, 'i');
    if (codeRegex.test(raw)) return opt.code;
  }
  if (raw.includes('₦')) return 'NGN';
  if (raw.includes('GH₵')) return 'GHS';
  if (raw.startsWith('CA$')) return 'CAD';
  if (raw.startsWith('A$')) return 'AUD';
  if (raw.includes('£')) return 'GBP';
  if (raw.includes('€')) return 'EUR';
  if (raw.includes('$')) return 'USD';

  return 'NGN';
}

/**
 * Strips leading currency symbols and trailing currency codes so the input field
 * edits just the amount value cleanly.
 */
export function extractPriceAmount(price?: string): string {
  if (!price) return '';
  return price
    .replace(/^\s*(?:CA\$|A\$|GH₵|AED\s+|[₦$£€R])\s*/i, '')
    .replace(/\s+(?:NGN|USD|GBP|EUR|CAD|AUD|GHS|ZAR|AED)\s*$/i, '');
}

/**
 * Formats a project's valuation with its selected currency symbol and code.
 * Returns `''` if the price amount is empty.
 */
export function formatProjectValuation(price?: string, currency?: string): string {
  const amount = extractPriceAmount(price).trim();
  if (!amount) return '';
  const code = detectCurrencyCode(price, currency);
  const opt = CURRENCY_OPTIONS.find(c => c.code === code) || CURRENCY_OPTIONS[0];
  return `${opt.symbol}${amount} ${opt.code}`;
}
