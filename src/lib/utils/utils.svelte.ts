import {configuration} from "@lib/page-state.svelte";

const theme = $derived(configuration.settings.theme);
const textDisplay = $derived(configuration.settings.textDisplay);

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Returns the display text for a given key and value based on the current text display setting. If both is selected by the user, the display text will be in the format of "[key] - value".
 * @param key the internal name of the item to get the display text for.
 * @param value the display name of the item to get the display text for.
 * @returns the display text based on the current text display setting.
 */
export function getDisplayText(key: string, value: string): string {
  switch (textDisplay) {
    case 'internal':
      return key;
    case 'display':
      return value;
    case 'both':
      return `[${key}] - ${value}`;
  }
}

export function isDarkTheme(): boolean {
  const currentTheme = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
  return currentTheme === 'dark';
}

export function getScreenSizeInRem(): number {
  return window.innerWidth / parseFloat(getComputedStyle(document.documentElement).fontSize);
}
