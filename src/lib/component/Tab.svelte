<script lang="ts">
  import type {Snippet} from 'svelte';
  import type {Runnable} from '@model/common';
  import {getColorPropertiesForTheme} from '@utils/utils.svelte';
  import type {ClassValue} from 'svelte/elements';

  interface TabButtonProps {
    action: Runnable;
    active: boolean;
    children?: Snippet;
    toggleable?: boolean;
  }

  interface TabGapProps {
    empty: true;
    size?: 'small' | 'max';
  }

  type TabProps = TabButtonProps | TabGapProps;

  const colors = $derived(
    getColorPropertiesForTheme({
      light: {
        base: 'cursor-pointer bg-zinc-300 hover:bg-zinc-200 focus:bg-zinc-200 active:bg-zinc-100',
        selected: 'bg-white border-b-white',
        toggleableTab:
          'hover:bg-zinc-100 focus:bg-zinc-100 hover:border-b-zinc-500 focus:border-b-zinc-500 active:bg-zinc-200',
      },
      dark: {
        base: 'cursor-pointer bg-zinc-900 hover:bg-zinc-700 focus:bg-zinc-700 active:bg-zinc-600',
        selected: 'bg-zinc-800 border-b-zinc-800',
        toggleableTab:
          'hover:bg-zinc-900 focus:bg-zinc-900 hover:border-b-zinc-500 focus:border-b-zinc-500 active:bg-black',
      },
    }),
  );

  function evaluateSize(size: TabGapProps['size']): ClassValue {
    switch (size) {
      case 'max':
        return 'flex-1';
      case 'small':
      default:
        return 'w-4';
    }
  }

  const props: TabProps = $props();
</script>

{#if 'empty' in props}
  {@const {size} = props}
  <div class={['border-b border-neutral-500', evaluateSize(size)]}></div>
{:else if 'action' in props}
  {@const {action, active, children, toggleable} = props}
  <button
    class={[
      'text-lg px-2 pb-1 outline-0 border rounded-t-lg border-neutral-500',
      active ? colors.selected : colors.base,
      toggleable && active && [colors.toggleableTab, 'cursor-pointer'],
    ]}
    disabled={!toggleable && active}
    onclick={action}
  >
    {@render children?.()}
  </button>
{/if}
