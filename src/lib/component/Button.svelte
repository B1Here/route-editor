<script lang="ts">
  import type {HTMLButtonAttributes} from 'svelte/elements';
  import {tailwindColors} from '../model/common';

  interface ButtonProps extends HTMLButtonAttributes {
    color?: keyof typeof tailwindColors;
  }
  const {children, class: className, color = 'neutral', type = 'button', ...props}: ButtonProps = $props();

  const baseClasses =
    'inline-flex cursor-pointer items-center justify-center font-medium transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-2 py-1 rounded-lg';
</script>

<button {...props} {type} class={[`${baseClasses} ${tailwindColors[color]}`, className]}>
  <span class="flex gap-x-1">
    {@render children?.()}
  </span>
</button>
