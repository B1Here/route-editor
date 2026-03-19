<script lang="ts">
  import {type Supplier, type ValidationResult} from '../model/common';
  import type {HTMLAttributes} from 'svelte/elements';
  import {TriangleAlert} from 'lucide-svelte';

  interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
    validators?: Array<Supplier<ValidationResult>>;
  }

  const {children, class: className, validators, ...props}: TableCellProps = $props();
  const invalidResults = $derived(validators?.filter((v) => !v().valid).map((v) => v()) || []);
</script>

<!--
@component
A simple table cell element that can have validators for its children's contents attached to it.
-->
<td class={['p-0 border border-neutral-500 m-0 align-middle relative', className]} {...props}>
  {@render children?.()}
  {#if invalidResults.length > 0}
    <span
      class="absolute top-0 right-0 bg-yellow-500 rounded-sm"
      title={invalidResults.map((result) => result.message).join('\n')}
    >
      <TriangleAlert />
    </span>
  {/if}
</td>
