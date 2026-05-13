import {
  MONEY_REGEX,
  PERCENT_REGEX,
  MULTIPLIER_REGEX,
  KEYWORDS_PROFIT,
  KEYWORDS_HOOK,
} from './constants';

export type Kind = 'money' | 'percent' | 'multiplier' | 'profit' | 'hook' | 'normal';

export const classifyWord = (raw: string): Kind => {
  const w = raw.trim();
  const lower = w.toLowerCase();
  if (MONEY_REGEX.test(w)) return 'money';
  if (PERCENT_REGEX.test(w)) return 'percent';
  if (MULTIPLIER_REGEX.test(w)) return 'multiplier';
  if (KEYWORDS_PROFIT.some((k) => lower.includes(k))) return 'profit';
  if (KEYWORDS_HOOK.some((k) => lower.includes(k))) return 'hook';
  return 'normal';
};

export const isHighlighted = (kind: Kind) => kind !== 'normal';
