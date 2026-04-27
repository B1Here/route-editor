<script lang="ts">
  import type {Snippet} from 'svelte';

  interface TabButtonProps {
    action: () => void;
    active: boolean;
    children?: Snippet;
    toggleable?: boolean;
  }

  interface TabGapProps {
    empty: true;
  }

  type TabProps = TabButtonProps | TabGapProps;

  const props: TabProps = $props();
</script>

{#if 'empty' in props}
  <div class="gap"></div>
{:else if 'action' in props}
  {@const {action, active, children, toggleable} = props}
  <button
    class={['invert-text-dark', active && 'active', toggleable && 'toggleable']}
    disabled={!toggleable && active}
    onclick={action}
  >
    {@render children?.()}
  </button>
{/if}

<style>
  button {
    font-size: 1.125rem;
    padding: 0.125rem 0.5rem;
    outline: 0;
    background-color: transparent;
    border: 1px solid transparent;
    border-bottom-color: var(--color-border);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  button:not(.active):hover,
  button:not(.active):focus {
    background-color: var(--color-bg-medium);
    color: var(--color-text-medium);
    cursor: pointer;
  }

  button:not(.active):focus {
    background-color: var(--color-bg-light);
    border-color: var(--color-border);
  }

  button:not(.active):active {
    background-color: var(--color-bg-light);
  }

  button.active {
    background-color: var(--color-bg-medium);
    border-color: var(--color-border);
    border-bottom-color: var(--color-bg-medium);
    color: var(--color-text-dark);
    z-index: 1;
  }

  button > :global(svg) {
    vertical-align: middle;
  }

  div.gap {
    width: 1rem;
  }
</style>
