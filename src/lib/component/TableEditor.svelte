<script lang="ts" generics="T extends object">
  import type {Snippet} from 'svelte';
  import {configuration} from '@lib/page-state.svelte';
  import {arrayToCsv} from '@utils/csv-utils';
  import {createTableHeader} from '@utils/editor-utils.svelte';
  import {FileText} from 'lucide-svelte';
  import EditorActions from '@component/EditorActions.svelte';

  interface TableEditorProps<T extends object> {
    children: Snippet;
    currentindex: number;
    entities: T[];
    filedata: {
      name: HTMLAnchorElement['download'];
      omittedColumns?: Array<keyof T>;
    };
    /**
     * A function that receives an empty array to populate with error messages.
     * @param entities the list of entities to validate.
     */
    filevalidator?: (entities: T[]) => void;
    filler: T;
    headers: string[];
    mapper: (data: string[], index: number) => T;
  }

  let {
    children,
    currentindex = $bindable(),
    entities = $bindable(),
    filedata,
    filevalidator,
    filler,
    headers,
    mapper,
  }: TableEditorProps<T> = $props();

  let settings = $derived(configuration.settings);
  let fileErrors = $derived(filevalidator?.(entities) ?? []);
</script>

<div class="table-editor">
  {#if settings.previewCsv || fileErrors?.length > 0}
    <div>
      {#if settings.previewCsv}
        <section>
          <div>
            <h5>
              <FileText class="inline-icon" strokeWidth="2.5" /> CSV Preview
            </h5>
          </div>
          <textarea class="invert-text-dark" disabled readonly>{arrayToCsv(entities)}</textarea>
        </section>
      {/if}
      {#if fileErrors?.length > 0}
        <section>
          <h5>The following errors were found within the file</h5>
          <ul>
            {#each fileErrors as error}
              <li>{error}</li>
            {/each}
          </ul>
        </section>
      {/if}
    </div>
  {/if}
  <section>
    <table class={[configuration.settings.centerTables && 'centered', 'invert-bg-dark']}>
      <thead>
        <tr>
          {#each [''].concat(headers) as header}
            <th>{createTableHeader(header)}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {@render children()}
      </tbody>
    </table>
  </section>
  <EditorActions {entities} {filler} {currentindex} {filedata} {mapper} />
</div>

<style>
  div.table-editor {
    flex: 1;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  section:not(:has(table)) {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    padding-inline: 1rem;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.5rem;
  }

  textarea {
    font-family: monospace;
    height: 6rem;
    padding-inline: 0.25rem;
    border: 1px solid var(--color-border);
    background-color: var(--color-bg-light);
    color: var(--color-text-dark);
  }

  section:has(table) {
    flex: 1;
    overflow-x: auto;
    width: 100%;
  }

  table {
    border: 1px solid var(--color-border);
    border-collapse: collapse;
    margin: 1rem;
  }

  table.centered {
    margin-inline: auto;
  }

  th {
    white-space: nowrap;
    border: 1px solid var(--color-border);
    padding-inline: 0.5rem;
  }
</style>
