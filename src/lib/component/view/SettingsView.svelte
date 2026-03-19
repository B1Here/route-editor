<script>
  import {CircleAlert} from 'lucide-svelte';
  import {themes, configuration} from '../../page-state.svelte';
  import {createTableHeader} from '../../utils/editor-utils.svelte';
  import Button from '../Button.svelte';
  import {getColorPropertiesForTheme} from '../../utils/utils.svelte';

  let settings = $derived(configuration.settings);

  $effect(() => {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        theme: settings.theme,
        previewCsv: settings.previewCsv,
        centerTables: settings.centerTables,
      }),
    );
  });

  const colors = $derived(
    getColorPropertiesForTheme({
      light: {
        option: '',
      },
      dark: {
        option: 'bg-black text-white',
      },
    }),
  );
</script>

<div class="ml-4">
  <h2 class="text-3xl font-medium my-2">Settings</h2>
  <section>
    <h4 class="text-xl font-medium my-2">Editor</h4>
    <div>
      <input type="checkbox" id="preview-csv" name="preview-csv" bind:checked={settings.previewCsv} />
      <label for="preview-csv">Preview CSV Text</label>
    </div>
    <div>
      <input type="checkbox" id="center-tables" name="center-tables" bind:checked={settings.centerTables} />
      <label for="center-tables">Center Tables</label>
    </div>
    <h4 class="text-xl font-medium my-2">Appearance</h4>
    <div>
      <label for="theme">Theme</label>
      <select class="border rounded-lg border-neutral-500 px-1 py-0.5" id="theme" name="theme" bind:value={settings.theme}>
        {#each themes as theme}
          <option class={colors.option} value={theme}>{createTableHeader(theme)}</option>
        {/each}
      </select>
    </div>
  </section>
  <Button
    class="mt-4"
    color="rose"
    onclick={() => {
      localStorage.clear();
      location.reload();
    }}
  >
    <CircleAlert class="inline align-bottom" /> Reset to Default
  </Button>
</div>
