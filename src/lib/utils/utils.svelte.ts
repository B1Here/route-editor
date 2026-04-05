import type {ClassValue} from "svelte/elements";
import type {Theme} from "@model/common";
import {configuration} from "@lib/page-state.svelte";

const theme = $derived(configuration.settings.theme);
const textDisplay = $derived(configuration.settings.textDisplay);

interface ThemedColorObject<T extends string> {
  light: {
    [key in T]: ClassValue;
  };
  dark: {
    [key in T]: ClassValue;
  };
}

/**
 * Returns whether the given object is defined, meaning it is neither null nor undefined.
 * @param obj the object to check for being defined.
 * @returns whether the object is defined.
 */
export function isDefined<T>(obj: T | null | undefined): obj is T {
  return obj !== null && obj !== undefined;
}

export function getColorPropertiesForTheme<T extends string>(colors: ThemedColorObject<T>): ThemedColorObject<T>[Exclude<Theme, 'system'>] {
  let evaluatedTheme: Exclude<Theme, 'system'>;
  if (theme === 'system') {
    evaluatedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    evaluatedTheme = theme;
  }

  return colors[evaluatedTheme];
}

/**
 * Returns the display text for a given key and value based on the current text display setting. If both is selected by the user, the display text will be in the format of "[key] - value".
 * @param key the internal name of the item to get the display text for.
 * @param value the display name of the item to get the display text for.
 * @returns the display text based on the current text display setting.
 */
export function getDisplayText(key: string, value: string) {
  switch (textDisplay) {
    case 'internal':
      return key;
    case 'display':
      return value;
    case 'both':
      return `[${key}] - ${value}`;
  }
}
