<script lang="ts">
  import type {HTMLAttributes} from 'svelte/elements';
  import {TriangleAlert} from 'lucide-svelte';

  interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
    /**
     * A supplier function that returns an array of error messages.
     */
    validator?: () => string[];
    textalign?: 'left' | 'center' | 'right';
  }

  const {children, class: className, validator, textalign, ...props}: TableCellProps = $props();
  let errors = $derived<string[]>(validator?.() ?? []);
</script>

<td {...props} class={[className, textalign && `align-${textalign}`]}>
  {@render children?.()}
  {#if errors.length > 0}
    <span title={errors.join('\n')}>
      <TriangleAlert />
    </span>
  {/if}
</td>

<style>
  td {
    padding: 0;
    border: 1px solid var(--color-border);
    margin: 0;
    vertical-align: middle;
    position: relative;
  }

  span {
    position: absolute;
    top: 0;
    right: 0;
    background-color: var(--color-warning);
    border-radius: 0.25rem;
    width: 1.5em;
    height: 1.5em;
    padding: 1px;
  }

  :global(.table-editor table tbody input),
  :global(.table-editor table tbody select) {
    height: 1.5rem;
    margin: 0;
    border: none;
    background-color: transparent;
    font-size: 1rem;
    box-sizing: content-box;
  }
</style>
