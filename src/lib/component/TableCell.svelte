<script lang="ts">
  import type {HTMLAttributes} from 'svelte/elements';
  import {TriangleAlert} from 'lucide-svelte';

  interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
    /**
     * A supplier function that returns an array of error messages.
     */
    validator?: () => string[];
  }

  const {children, class: className, validator, ...props}: TableCellProps = $props();
  let errors = $derived<string[]>(validator?.() ?? []);
</script>

<td class={['p-0 border border-neutral-500 m-0 align-middle relative', className]} {...props}>
  {@render children?.()}
  {#if errors.length > 0}
    <span
      class="absolute top-0 right-0 bg-yellow-500 rounded-sm"
      title={errors.join('\n')}
    >
      <TriangleAlert />
    </span>
  {/if}
</td>
