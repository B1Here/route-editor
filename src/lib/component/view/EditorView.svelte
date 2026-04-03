<script lang="ts">
  import {MapPin, Waypoints} from 'lucide-svelte';
  import {configuration} from '@lib/page-state.svelte';
  import PointEditor from '@view/PointEditor.svelte';
  import RouteEditor from '@view/RouteEditor.svelte';
  import {getColorPropertiesForTheme} from '@utils/utils.svelte';
  import Tab from '@component/Tab.svelte';

  let editorView = $derived(configuration.currentEditorView);
  let settings = $derived(configuration.settings);

  $effect(() => {
    localStorage.setItem('currentEditorView', editorView);
  });

  $effect(() => {
    localStorage.setItem('settings', JSON.stringify({...settings, previewCsv: settings.previewCsv}));
  });

  const colors = $derived(
    getColorPropertiesForTheme({
      light: {
        darkBg: 'bg-zinc-100',
      },
      dark: {
        darkBg: 'bg-zinc-900',
      },
    }),
  );
</script>

<div class="overflow-hidden flex flex-col h-full w-full">
  <div class={['flex pt-2 relative border-neutral-500', colors.darkBg]}>
    <Tab empty />
    <Tab action={() => (editorView = 'points')} active={editorView === 'points'}>
      <MapPin class="inline h-5 w-5" /> Points
    </Tab>
    <Tab action={() => (editorView = 'routes')} active={editorView === 'routes'}>
      <Waypoints class="inline h-5 w-5" /> Routes
    </Tab>
    <Tab empty size="max" />
  </div>
  {#if editorView === 'routes'}
    <RouteEditor />
  {:else if editorView === 'points'}
    <PointEditor />
  {/if}
</div>
