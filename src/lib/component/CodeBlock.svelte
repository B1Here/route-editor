<script lang="ts">
  import type {Snippet} from 'svelte';

  interface CodeBlockProps {
    children: Snippet;
  }

  const {children}: CodeBlockProps = $props();
</script>

<code class="border border-neutral-500 rounded-md px-1">{@render children()}</code>
