<script lang="ts" generics="T extends object">
  import {ArrowDownFromLine, ArrowUpFromLine, Copy, FileDown, Minus, Plus} from 'lucide-svelte';
  import Button from '@component/Button.svelte';
  import {addEntity, moveEntity, removeEntity} from '@utils/entity-utils.svelte';
  import {isDefined} from '@utils/utils.svelte';
  import {arrayToCsv, csvSplit, toSjisBase64String, toUnicode} from '@utils/csv-utils';

  interface EditorActionsProps<T extends object> {
    entities: T[];
    filler: T;
    currentindex: number;
    filedata: {
      name: HTMLAnchorElement['download'];
      omittedColumns?: Array<keyof T>;
    };
    mapper: (data: string[], index: number) => T;
  }

  let {entities, filler, currentindex, filedata, mapper}: EditorActionsProps<T> = $props();
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
    const href = `data:text/plain;base64,${toSjisBase64String(arrayToCsv(entities, filedata.omittedColumns))}`;
    link.href = href;
    link.download = filedata.name;
    link.click();
    window.URL.revokeObjectURL(href);
  }
</script>

<div class="action-bar">
  <section class="row">
    <Button
      color="success"
      onclick={() => {
        addEntity(entities, filler, currentindex);
        currentindex++;
      }}
      disabled={entities.length >= 256}
    >
      <Plus class="inline-icon" /><span>Add Row</span>
    </Button>
    <Button
      color="primary"
      onclick={() => {
        const snapshot = $state.snapshot(entities[currentindex]) as T;
        addEntity(entities, snapshot, currentindex);
        currentindex++;
      }}
      disabled={entities.length >= 256}
    >
      <Copy class="inline-icon" /><span>Duplicate Row</span>
    </Button>
    <Button
      color="danger"
      disabled={entities.length <= 1}
      onclick={() => {
        removeEntity(entities, currentindex);
        if (currentindex > 0) {
          currentindex--;
        }
      }}
    >
      <Minus class="inline-icon" /><span>Remove Row</span>
    </Button>
    <Button
      color="neutral"
      disabled={entities.length <= 0 || currentindex <= 0}
      onclick={() => {
        moveEntity(entities, currentindex, 'up');
        currentindex = currentindex - 1;
      }}
    >
      <ArrowUpFromLine class="inline-icon" /><span>Move Up</span>
    </Button>
    <Button
      color="neutral"
      disabled={entities.length <= 0 || currentindex < 0 || currentindex >= entities.length - 1}
      onclick={() => {
        moveEntity(entities, currentindex, 'down');
        currentindex = currentindex + 1;
      }}
    >
      <ArrowDownFromLine class="inline-icon" /><span>Move Down</span>
    </Button>
  </section>
  <section class="column">
    <div class="file-row">
      <input accept="text/csv" id="file_input" type="file" onchange={handleUpload} />
      <Button textalign="center" onclick={() => downloadFile()}
        ><FileDown class="inline-icon" />Download</Button
      >
    </div>
    {#if isDefined(fileUploadError)}
      <span class="file-upload-error">
        {fileUploadError}
      </span>
    {/if}
  </section>
</div>

<style>
  div.action-bar {
    padding: 0.8125rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    row-gap: 0.5rem;
    background-color: var(--color-bg-light);
    align-items: start;
    overflow-x: auto;
  }

  .row,
  .file-row {
    display: flex;
    gap: 0.5rem;
  }

  .column {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }

  input[type='file'],
  input[type='file']::file-selector-button {
    transition:
      color 150ms,
      fill 150ms,
      background-color 150ms;
    font-size: 1rem;
  }

  input[type='file'] {
    cursor: pointer;
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    background-color: var(--color-bg-medium);
  }

  input[type='file']:hover {
    background-color: var(--color-bg-dark);
  }

  input[type='file']::file-selector-button {
    height: 100%;
    cursor: pointer;
    border: none;
    border-right: 1px solid var(--color-border);
    padding: 0.25rem 0.5rem;
    margin-right: 0.5rem;
    background-color: var(--color-bg-light);
  }

  input[type='file']:hover::file-selector-button {
    background-color: var(--color-bg-medium);
  }

  input[type='file']:active::file-selector-button {
    background-color: var(--color-bg-dark);
  }

  .file-upload-error {
    color: var(--color-danger);
  }

  @media screen and (max-width: 48rem) {
    div.action-bar {
      align-items: center;
    }

    :global(div.action-bar .row button) {
      font-size: 1.5rem;
    }

    :global(div.action-bar button > span) {
      display: none;
    }

    .file-row {
      display: grid;
      justify-content: center;
      align-items: center;
      grid-template-rows: repeat(2, 1fr);
    }
  }
</style>
