<script lang="ts">
  import TableCell from '@component/TableCell.svelte';
  import type {HTMLAttributes} from 'svelte/elements';
  import {getColorPropertiesForTheme} from '@utils/utils.svelte';

  interface TableRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, 'onclick' | 'onfocuscapture'> {
    index: number;
    onselect: () => void;
    selected: boolean;
  }

  const {children, class: className, index, onselect, selected, ...props}: TableRowProps = $props();

  const colors = $derived(
    getColorPropertiesForTheme({
      light: {
        selected: 'bg-gray-200',
        even: 'even:bg-gray-100',
        id: 'text-neutral-700',
      },
      dark: {
        selected: 'bg-zinc-700',
        even: 'even:bg-zinc-900',
        id: 'text-zinc-300',
      },
    }),
  );
</script>

<tr
  {...props}
  class={[className, !selected && colors.even, selected && colors.selected]}
  onclick={onselect}
  onfocuscapture={onselect}
>
  <TableCell class={['text-center px-2', colors.id]}>{index + 1}</TableCell>
  {@render children?.()}
</tr>
