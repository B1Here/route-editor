<script lang="ts" generics="T extends object">
  import type {Snippet} from 'svelte';
  import {configuration} from '@lib/page-state.svelte';
  import Button from '@component/Button.svelte';
  import {addEntity, moveEntity, removeEntity} from '@utils/entity-utils.svelte';
  import {csvSplit, arrayToCsv, toSjisBase64String, toUnicode} from '@utils/csv-utils';
  import {createTableHeader} from '@utils/editor-utils.svelte';
  import {ArrowDownFromLine, ArrowUpFromLine, FileDown, FileText, Minus, Plus} from 'lucide-svelte';
  import {getColorPropertiesForTheme, isDefined} from '@utils/utils.svelte';

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
     * @param entities the list entities to validate.
     * @param errors an empty array to populate with error messages.
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
  let fileUploadError = $state<string | undefined>(undefined);

  function handleFile(file: File | null): void {
    if (file) {
      const extension = file.name.split('.').pop();
      if (extension?.toLowerCase() !== 'csv') {
        fileUploadError = 'Invalid file type. Please upload a CSV file.';
        return;
      }

      fileUploadError = undefined;

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result != null && typeof e.target.result === 'object') {
          const tempCsvString = toUnicode(new Uint8Array(e.target.result));

          try {
            const csvRows = tempCsvString
              .split('\r\n')
              .filter((row) => Boolean(row.trim()))
              .map((row, i) => csvSplit(row, i + 1, Object.keys(filler).length));

            entities.splice(0, entities.length, ...csvRows.map(mapper));
          } catch (error) {
            fileUploadError = `Failed to parse CSV file: ${(error as Error).message}`;
            return;
          }
        }
      };

      reader.readAsArrayBuffer(file);
    }
  }

  function handleUpload(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target != null && target.files) {
      handleFile(target.files[0]);
    }
  }

  function downloadFile(): void {
    const link = document.createElement('a');
    const href = `data:text/plain;base64,${toSjisBase64String(arrayToCsv(entities, fileData.omittedColumns))}`;
    link.href = href;
    link.download = fileData.name;
    link.click();
    window.URL.revokeObjectURL(href);
  }

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
  <div class={['p-4 border-t border-neutral-500 flex flex-col gap-y-2', colors.outside]}>
    <div class="flex gap-x-2">
      <Button
        color="green"
        onclick={() => {
          addEntity(entities, filler, currentIndex);
          currentIndex++;
        }}
        disabled={entities.length >= 256}
      >
        <Plus class="inline align-bottom" /> Add Row
      </Button>
      <Button
        color="red"
        disabled={entities.length <= 1}
        onclick={() => {
          removeEntity(entities, currentIndex);
          if (currentIndex > 0) {
            currentIndex--;
          }
        }}
      >
        <Minus class="inline align-bottom" /> Remove Row
      </Button>
      <Button
        disabled={entities.length <= 0 || currentIndex <= 0}
        onclick={() => {
          moveEntity(entities, currentIndex, 'up');
          currentIndex = currentIndex - 1;
        }}
      >
        <ArrowUpFromLine class="inline align-bottom" /> Move Up
      </Button>
      <Button
        disabled={entities.length <= 0 || currentIndex < 0 || currentIndex >= entities.length - 1}
        onclick={() => {
          moveEntity(entities, currentIndex, 'down');
          currentIndex = currentIndex + 1;
        }}
      >
        <ArrowDownFromLine class="inline align-bottom" /> Move Down
      </Button>
    </div>
    <div class="flex flex-col gap-y-2">
      <div class="flex gap-x-2">
        <input
          accept="text/csv"
          class={[
            'file:h-full file:cursor-pointer cursor-pointer border border-neutral-500 rounded-lg file:px-2 file:border-r file:border-neutral-500 file:mr-2 file:py-1',
            colors.file,
          ]}
          id="file_input"
          type="file"
          onchange={handleUpload}
        />
        <Button color="sky" onclick={() => downloadFile()}><FileDown class="inline align-bottom" /> Download</Button>
      </div>
      {#if isDefined(fileUploadError)}
        <span class="text-red-500">
          {fileUploadError}
        </span>
      {/if}
    </div>
  </div>
</div>
