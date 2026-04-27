import {editorTabViews, textDisplays, themes, views} from "@lib/page-state.svelte";

export type Theme = typeof themes[number];
export type View = typeof views[number];
export type EditorTabView = typeof editorTabViews[number];
export type TextDisplay = keyof typeof textDisplays;

export type ColorType = 'primary' | 'success' | 'danger' | 'warning' | 'neutral' | 'transparent';
