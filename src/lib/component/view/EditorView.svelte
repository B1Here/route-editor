<script lang="ts">
  import {MapPin, Waypoints} from 'lucide-svelte';
  import {configuration} from '@lib/page-state.svelte';
  import PointEditor from '@view/PointEditor.svelte';
  import RouteEditor from '@view/RouteEditor.svelte';
  import Tab from '@component/Tab.svelte';

  let editorView = $derived(configuration.currentEditorView);

  $effect(() => {
    localStorage.setItem('currentEditorView', editorView);
  });
</script>

<div class="editor-view">
  <div class="tab-list">
    <Tab empty />
    <Tab action={() => (editorView = 'points')} active={editorView === 'points'}>
      <MapPin class="inline-icon" /> Points
    </Tab>
    <Tab action={() => (editorView = 'routes')} active={editorView === 'routes'}>
      <Waypoints class="inline-icon" /> Routes
    </Tab>
    <hr />
  </div>
  {#if editorView === 'routes'}
    <RouteEditor />
  {:else if editorView === 'points'}
    <PointEditor />
  {/if}
</div>

<style>
  :global(main:has(.editor-view)) {
    overflow-x: hidden;
  }

  .editor-view {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
  }

  .tab-list {
    background-color: var(--color-bg-dark);
    display: flex;
    padding-top: 1.375rem;
    position: relative;
    width: 100%;
  }

  .tab-list > hr:first-of-type {
    position: absolute;
    width: 100%;
    bottom: 0;
    border: 0;
    border-bottom: 1px solid var(--color-border);
    margin: 0;
    z-index: 0;
  }
</style>
