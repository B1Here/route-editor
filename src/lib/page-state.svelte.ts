import type {Point, Route} from "@model/nsmbw";
import type {EditorTabView, TextDisplay, Theme, View} from "@model/common";

export const themes = ['system', 'light', 'dark'] as const;
export const views = ['info', 'editor', 'settings'] as const;
export const editorTabViews = ['routes', 'points'] as const;
export const textDisplays = {
  display: 'Display names',
  internal: 'Internal names',
  both: 'Both',
} as const;

interface Settings {
  theme: Theme;
  previewCsv: boolean;
  centerTables: boolean;
  textDisplay: TextDisplay;
}

export const routeFiller: Route = {name: '', animation: '道', activeRootCycles: []};
export const pointFiller: Point = {
  id: 0,
  name: '',
  flags: [],
  levelsAfterClear: '',
  bonesAfterClear: '',
  animationsAfterClear: null,
  levelsAfterSecretExit: '',
  bonesAfterSecretExit: '',
  animationsAfterSecretExit: null,
};

function loadSettings(): Settings {
  const localStorageSettings = localStorage.getItem('settings') || '{}';
  let defaultOptions: Settings = {theme: 'system', previewCsv: false, centerTables: false, textDisplay: 'display'};

  let options = $state<Settings>({...defaultOptions, ...JSON.parse(localStorageSettings)});

  return options;
}

export const entityData = $state({
  routes: [routeFiller],
  points: [pointFiller],
});

export const configuration = $state({
  settings: loadSettings(),
  currentView: (localStorage.getItem('currentView') || 'editor') as View,
  currentEditorView: (localStorage.getItem('currentEditorView') || 'points') as EditorTabView,
});
