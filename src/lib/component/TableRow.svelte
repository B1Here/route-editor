<script lang="ts">
  import TableCell from '@component/TableCell.svelte';
  import type {HTMLAttributes} from 'svelte/elements';

  interface TableRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, 'onclick' | 'onfocuscapture'> {
    index: number;
    onselect: () => void;
    selected: boolean;
  }

  const {children, class: className, index, onselect, selected, ...props}: TableRowProps = $props();
</script>

<tr {...props} class={[className, selected && 'selected']} onclick={onselect} onfocuscapture={onselect}>
  <TableCell class="invert-text-dark row-id">{index + 1}</TableCell>
  {@render children?.()}
</tr>

<style>
  tr:nth-child(even):not(.selected) {
    background-color: var(--color-bg-light);
  }

  tr.selected {
    background-color: color-mix(in srgb, var(--color-bg-light), var(--color-text-medium) 12%);
  }

  :global(.table-editor table tbody tr .row-id) {
    color: var(--color-text-light);
    text-align: right;
    padding-inline: 0.25rem;
  }
</style>
