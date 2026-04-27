<script lang="ts">
  import {configuration, textDisplays, themes} from '@lib/page-state.svelte';
  import {createTableHeader} from '@utils/editor-utils.svelte';
  import {CircleAlert, X} from 'lucide-svelte';
  import Button from '@component/Button.svelte';

  interface SettingsMenuProps {
    open: boolean;
  }

  let {open = $bindable()}: SettingsMenuProps = $props();

  let settings = $derived(configuration.settings);

  $effect(() => {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        theme: settings.theme,
        previewCsv: settings.previewCsv,
        centerTables: settings.centerTables,
        textDisplay: settings.textDisplay,
      }),
    );
  });
</script>

{#if open}
  <div
    id="settings-menu"
    tabindex="-1"
    onfocusout={(e) => {
      e.stopImmediatePropagation();
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        open = false;
      }
    }}
  >
    <div class="row">
      <h2>Settings</h2>
      <Button color="danger" size="max" onclick={() => (open = false)} textcolor="danger" outlined title="Close">
        <X class="inline-icon" />
      </Button>
    </div>
    <fieldset>
      <legend>Editor</legend>
      <input bind:checked={settings.previewCsv} id="preview-csv" type="checkbox" />
      <label for="preview-csv">Preview CSV Text</label>
      <input bind:checked={settings.centerTables} id="center-tables" type="checkbox" />
      <label for="center-tables">Center Tables</label>
    </fieldset>
    <fieldset>
      <legend>Appearance</legend>
      <label for="theme">Theme</label>
      <select class="invert-text-dark" id="theme" name="theme" bind:value={settings.theme}>
        {#each themes as theme}
          <option class="invert-text-dark" value={theme}>{createTableHeader(theme)}</option>
        {/each}
      </select>
      <label for="text-display">Text Display</label>
      <select class="invert-text-dark" name="text-display" id="text-display" bind:value={settings.textDisplay}>
        {#each Object.entries(textDisplays) as [key, value]}
          <option class="invert-text-dark" value={key}>{value}</option>
        {/each}
      </select>
    </fieldset>
    <Button
      class="reset-button"
      color="danger"
      size="max"
      onclick={() => {
        localStorage.clear();
        location.reload();
      }}><CircleAlert /> Reset Settings</Button
    >
  </div>
{/if}

<style>
  div:has(fieldset) {
    position: absolute;
    background-color: var(--color-bg-light);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 1rem;
    height: max-content;
    bottom: 0rem;
    left: 100%;
    margin: 0.5rem;
  }

  div.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  fieldset {
    border: 1px solid var(--color-border);
    padding: 0.5rem;
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    column-gap: 0.25rem;
    row-gap: 0.5rem;
  }

  h2 {
    margin: 0 0 0.5em;
  }

  label {
    white-space: nowrap;
  }

  select {
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    padding: 0.125rem 0.25rem;
    background-color: transparent;
    color: var(--color-text-dark);
  }

  option {
    background-color: var(--color-bg-light);
  }

  :global(.reset-button) {
    margin-top: 0.5rem;
    margin-left: auto;
  }
</style>
