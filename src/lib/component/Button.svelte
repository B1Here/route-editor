<script lang="ts">
  import type {ColorType} from '@model/common';
  import type {HTMLButtonAttributes} from 'svelte/elements';

  interface ButtonProps extends HTMLButtonAttributes {
    color?: ColorType;
    textcolor?: Omit<ColorType, 'transparent'> | 'default';
    nobg?: true;
    size?: 'max' | 'full';
    textalign?: 'left' | 'center' | 'right';
    outlined?: boolean;
  }

  const {
    children,
    class: className,
    color = 'primary',
    nobg,
    outlined,
    size = 'full',
    textalign = 'left',
    textcolor = 'default',
    type = 'button',
    ...props
  }: ButtonProps = $props();
</script>

<button
  class={[
    `color-${color}`,
    `size-${size}`,
    nobg && 'no-bg',
    `text-${textcolor}`,
    `align-${textalign}`,
    outlined && 'outlined',
    className,
  ]}
  {type}
  {...props}>{@render children?.()}</button
>

<style>
  button {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    cursor: pointer;
    transition:
      color 150ms,
      fill 150ms,
      background-color 150ms;
    width: 100%;
    padding: 0.5rem;
    background-color: transparent;
    fill: var(--color-text-medium);
    color: var(--color-text-medium);
    border: none;
    font-size: 1rem;
    border-radius: 0.5em;
    white-space: nowrap;
    --color-text-button: white;
  }

  button.color-transparent:hover,
  button.color-transparent:focus-visible {
    color: var(--color-text-light);
    fill: var(--color-text-light);
    background-color: var(--color-bg-medium);
  }

  button.color-transparent:active {
    background-color: var(--color-bg-dark);
  }

  button.color-primary {
    --color-bg-button: var(--color-primary);
  }

  button.text-primary {
    --color-text-button: var(--color-primary);
  }

  button.color-danger {
    --color-bg-button: var(--color-danger);
  }

  button.text-danger {
    --color-text-button: var(--color-danger);
  }

  button.color-warning {
    --color-bg-button: var(--color-warning);
  }

  button.text-warning {
    --color-text-button: var(--color-warning);
  }

  button.color-success {
    --color-bg-button: var(--color-success);
  }

  button.text-success {
    --color-text-button: var(--color-success);
  }

  button.color-neutral {
    --color-bg-button: var(--color-neutral);
  }

  button.text-neutral {
    --color-text-button: var(--color-neutral);
  }

  button:not(.color-transparent) {
    background-color: var(--color-bg-button);
  }

  button:not(.color-transparent):hover,
  button:not(.color-transparent):focus-visible {
    background-color: color-mix(in srgb, var(--color-bg-button), black 10%);
  }

  button:not(.color-transparent):active {
    background-color: color-mix(in srgb, var(--color-bg-button), black 20%);
  }

  button.text-default.color-transparent,
  button.text-default.no-bg {
    --color-text-button: var(--color-text-medium);
  }

  button {
    color: var(--color-text-button);
    fill: var(--color-text-button);
  }

  button:hover,
  button:focus-visible {
    color: color-mix(in srgb, var(--color-text-button), var(--color-bg-medium) 20%);
    fill: color-mix(in srgb, var(--color-text-button), var(--color-bg-medium) 20%);
  }

  button:active {
    color: color-mix(in srgb, var(--color-text-button), var(--color-bg-medium) 40%);
    fill: color-mix(in srgb, var(--color-text-button), var(--color-bg-medium) 40%);
  }

  button.no-bg,
  button.no-bg:hover,
  button.no-bg:focus-visible,
  button.no-bg:active {
    background-color: transparent;
  }

  button.size-max {
    width: max-content;
  }

  button.outlined {
    border: 1px solid var(--color-bg-button, var(--color-border));
    padding: calc(0.5rem - 2px);
    background-color: transparent;
  }

  button.outlined:hover,
  button.outlined:focus-visible,
  button.outlined:active {
    color: var(--color-text-light);
  }
</style>
