/**
 * An object defining the internal japanese names of all possible route animations as well as a rough translation of them.
 */
export const routeAnimations = [
  {translatedName: "Jump", jpName: "ジャンプ"},
  {translatedName: "Walk (Grass)", jpName: "道"},
  {translatedName: "Walk (Sand)", jpName: "砂"},
  {translatedName: "Walk (Quicksand)", jpName: "流砂"},
  {translatedName: "Walk (Snow)", jpName: "雪"},
  {translatedName: "Walk (Ice)", jpName: "氷"},
  {translatedName: "Walk (Wood)", jpName: "木"},
  {translatedName: "Walk (Dirt)", jpName: "土"},
  {translatedName: "Snow Slope", jpName: "坂"},
  {translatedName: "Ice Slope", jpName: "氷坂"},
  {translatedName: "Ladder Up", jpName: "はしご"},
  {translatedName: "Rock Ladder Up", jpName: "はしご岩"},
  {translatedName: "Rope Ladder Up", jpName: "はしご縄"},
  {translatedName: "Ladder Left", jpName: "はしご左"},
  {translatedName: "Ladder Right", jpName: "はしご右"},
  {translatedName: "Beanstalk", jpName: "ツタ"},
  {translatedName: "Switch Block (unused)", jpName: "スイッチブロック"},
  {translatedName: "Cloud (unused)", jpName: "雲"},
  {translatedName: "Water (unused)", jpName: "水"},
] as const;

/**
 * A list of all available point flags New Super Mario Bros. Wii has.
 */
export const allFlags = {
  stop: 'Stops player',
  crossroad: 'Stop (3+ active paths)',
  dokan: 'Pipe',
  scrollY: 'Scroll camera up/down',
  scrollA: 'Scroll camera left/right',
  scroll: 'Free camera movement',
  focus: 'Focus camera on the player',
  camstop: 'Stop camera movement',
  demo1: 'Koopaling jump point 1',
  demo2: 'Koopaling jump point 2',
  demo3: 'Koopaling jump point 3',
  demo4: 'Koopaling jump point 4',
  demo5: 'Koopaling jump point 5',
  demo6: 'Koopaling jump point 6',
  demo7: 'Koopaling jump point 7',
  sand: 'Quicksand landing particles',
  noshift: 'Unknown (prevents camera shift?)',
  link1: 'Subworld link',
  switch: 'Red Switch',
  ura: 'Unknown (secret exit related)',
  scale: 'Shrink player',
  demostop: '8-Airship cutscene related',
  tilt: 'Tilts camera',
  board: 'Has star board',
  link2: 'Subworld link (2) (unused)',
  link3: 'Subworld link (3) (unused)',
  link4: 'Subworld link (4) (unused)',
  link5: 'Subworld link (5) (unused)',
  ice: 'Ice landing particles (unused)',
  anchor: 'Anchor? (unused)',
} as const;

/**
 * A list of all point flags that end with a number and can only be used once per (sub)world.
 */
export const numberedFlags = Object.keys(allFlags).filter(f => !Number.isNaN(parseInt(f.charAt(f.length - 1))));

/**
 * A list of available root cycles used for some routes in World 5 exclusively.
 */
export const rootCycles = ['A', 'B', 'C'] as const;
