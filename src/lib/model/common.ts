import type {editorTabViews, themes, textDisplays, views} from "../page-state.svelte";
import {allFlags, rootCycles, routeAnimations} from "./route-info-data";

export type FlagKeys = keyof typeof allFlags;

export interface Route {
  name: string;
  animation: typeof routeAnimations[number]['jpName'];
  activeRootCycles: Array<typeof rootCycles[number]>;
}

export interface Point {
  id: number;
  name: string;
  flags: Array<FlagKeys>;
  levelsAfterClear: string;
  bonesAfterClear: string;
  /**
   * Unused. Animations are referenced by the "bonesAfterClear" field.
   */
  animationsAfterClear: null;
  levelsAfterSecretExit: string;
  bonesAfterSecretExit: string;
  /**
   * Unused. Animations are referenced by the "bonesAfterSecretExit" field.
   */
  animationsAfterSecretExit: null;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
};

export interface CombinedErrorsValidationResult {
  valid: boolean;
  errors: string[];
}

export type Theme = typeof themes[number];
export type View = typeof views[number];
export type EditorTabView = typeof editorTabViews[number];

export const tailwindColors = {
  red: 'bg-red-600 hover:bg-red-500 active:bg-red-400 disabled:bg-red-600 text-white',
  orange: 'bg-orange-600 hover:bg-orange-500 active:bg-orange-400 disabled:bg-orange-600 text-white',
  amber: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-400 disabled:bg-amber-600 text-white',
  yellow: 'bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-400 disabled:bg-yellow-600 text-white',
  lime: 'bg-lime-600 hover:bg-lime-500 active:bg-lime-400 disabled:bg-lime-600 text-white',
  green: 'bg-green-600 hover:bg-green-500 active:bg-green-400 disabled:bg-green-600 text-white',
  emerald: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 disabled:bg-emerald-600 text-white',
  teal: 'bg-teal-600 hover:bg-teal-500 active:bg-teal-400 disabled:bg-teal-600 text-white',
  cyan: 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-400 disabled:bg-cyan-600 text-white',
  sky: 'bg-sky-600 hover:bg-sky-500 active:bg-sky-400 disabled:bg-sky-600 text-white',
  blue: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-400 disabled:bg-blue-600 text-white',
  indigo: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-400 disabled:bg-indigo-600 text-white',
  violet: 'bg-violet-600 hover:bg-violet-500 active:bg-violet-400 disabled:bg-violet-600 text-white',
  purple: 'bg-purple-600 hover:bg-purple-500 active:bg-purple-400 disabled:bg-purple-600 text-white',
  fuchsia: 'bg-fuchsia-600 hover:bg-fuchsia-500 active:bg-fuchsia-400 disabled:bg-fuchsia-600 text-white',
  pink: 'bg-pink-600 hover:bg-pink-500 active:bg-pink-400 disabled:bg-pink-600 text-white',
  rose: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-400 disabled:bg-rose-600 text-white',
  slate: 'bg-slate-600 hover:bg-slate-500 active:bg-slate-400 disabled:bg-slate-600 text-white',
  gray: 'bg-gray-600 hover:bg-gray-500 active:bg-gray-400 disabled:bg-gray-600 text-white',
  zinc: 'bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-400 disabled:bg-zinc-600 text-white',
  neutral: 'bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-400 disabled:bg-neutral-600 text-white',
  stone: 'bg-stone-600 hover:bg-stone-500 active:bg-stone-400 disabled:bg-stone-600 text-white',
  taupe: 'bg-taupe-600 hover:bg-taupe-500 active:bg-taupe-400 disabled:bg-taupe-600 text-white',
  mauve: 'bg-mauve-600 hover:bg-mauve-500 active:bg-mauve-400 disabled:bg-mauve-600 text-white',
  mist: 'bg-mist-600 hover:bg-mist-500 active:bg-mist-400 disabled:bg-mist-600 text-white',
  olive: 'bg-olive-600 hover:bg-olive-500 active:bg-olive-400 disabled:bg-olive-600 text-white',
} as const;

export type TextDisplay = keyof typeof textDisplays;

export type Consumer<T> = (arg: T) => void;

export type FunctionWithArg<T, R> = (arg: T) => R;

export type Predicate<T> = (arg: T) => boolean;

export type Runnable = () => void;

export type Supplier<T> = () => T;
