<script lang="ts" generics="T extends object">
  import type {Snippet} from 'svelte';
  import {configuration} from '@lib/page-state.svelte';
  import {arrayToCsv} from '@utils/csv-utils';
  import {createTableHeader} from '@utils/editor-utils.svelte';
  import {FileText} from 'lucide-svelte';
  import {getColorPropertiesForTheme} from '@utils/utils.svelte';
  import EditorActions from './EditorActions.svelte';

  interface TableEditorProps<T extends object> {
    children: Snippet;
    currentIndex: number;
    entities: T[];
    fileData: {
      name: HTMLAnchorElement['download'];
      omittedColumns?: Array<keyof T>;
    };
    /**
     * A function that receives an empty array to populate with error messages.
     * @param entities the list of entities to validate.
     */
    fileValidator?: (entities: T[]) => void;
    filler: T;
    headers: string[];
    mapper: (data: string[], index: number) => T;
  }

  let {
    children,
    currentIndex = $bindable(),
    entities = $bindable(),
    fileData,
    fileValidator,
    filler,
    headers,
    mapper,
  }: TableEditorProps<T> = $props();

  let settings = $derived(configuration.settings);
  let fileErrors = $derived(fileValidator?.(entities) ?? []);

  const colors = $derived(
    getColorPropertiesForTheme({
      light: {
        file: 'bg-gray-100 hover:bg-gray-200 file:bg-gray-200 hover:file:bg-gray-300',
        outside: 'bg-zinc-100',
        header: 'bg-gray-300',
      },
      dark: {
        file: 'bg-zinc-800 hover:bg-zinc-700 file:bg-zinc-700 hover:file:bg-zinc-600',
        outside: 'bg-zinc-900',
        header: 'bg-zinc-600',
      },
    }),
  );
</script>

<div class="flex flex-col flex-1 overflow-hidden">
  {#if settings.previewCsv || fileErrors?.length > 0}
    <div>
      {#if settings.previewCsv}
        <div class="flex flex-col gap-y-2 px-4 border-b border-neutral-500 pb-2">
          <div>
            <h5 class="text-2xl font-medium">
              <FileText class="inline h-5 w-5 align-middle" strokeWidth="2.5" /> CSV Preview
            </h5>
          </div>
          <textarea class={['h-24 px-1 border border-neutral-500', colors.outside]} disabled readonly
            >{arrayToCsv(entities)}</textarea
          >
        </div>
      {/if}
      {#if fileErrors?.length > 0}
        <div class="flex flex-col gap-y-2 px-4 border-b border-neutral-500 pb-2">
          <h5 class="text-xl font-medium">The following errors were found within the file</h5>
          <ul>
            {#each fileErrors as error}
              <li>{error}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}
  <div class="flex-1 overflow-auto w-full">
    <table class={['border border-neutral-500 border-collapse m-4', configuration.settings.centerTables && 'mx-auto']}>
      <thead>
        <tr>
          {#each [''].concat(headers) as header}
            <th class={['border border-neutral-500 px-2 font-medium', colors.header]}>{createTableHeader(header)}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {@render children()}
      </tbody>
    </table>
  </div>
  <EditorActions {entities} {filler} {currentIndex} {fileData} {mapper} />
</div>
