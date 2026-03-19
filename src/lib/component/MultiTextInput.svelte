<script lang="ts">
  import type {HTMLInputAttributes} from 'svelte/elements';
  import {toClassName} from '../utils/editor-utils.svelte';

  interface MultiTextInputProps extends Omit<HTMLInputAttributes, 'type' | 'value' | 'onkeydown'> {
    values: string[];
  }

  let {class: className, values = $bindable(), ...props}: MultiTextInputProps = $props();
</script>

<div class="d-flex flex-column justify-content-end h-100">
  <div class={[values.length > 0 && 'mb-2', 'p-0 overflow-x-auto max-h-24', className]}>
    {#each values as value, index}
      <button class="mx-1 badge rounded-pill bg-primary" onclick={() => values.splice(index, 1)}>{value}</button>
    {/each}
  </div>
  <input
    {...props}
    class={['form-control', className]}
    type="text"
    onkeydown={(e) => {
      if (e.key === 'Enter') {
        values.push(e.currentTarget.value);
        e.currentTarget.value = '';
      }
    }}
  />
</div>
