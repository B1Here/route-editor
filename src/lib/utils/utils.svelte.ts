import type {ClassValue} from "svelte/elements";
import type {Theme} from "../model/common";
import {configuration} from "../page-state.svelte";

const theme = $derived(configuration.settings.theme);

interface ThemedColorObject<T extends string> {
  light: {
    [key in T]: ClassValue;
  };
  dark: {
    [key in T]: ClassValue;
  };
}

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
