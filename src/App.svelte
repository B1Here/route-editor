<script lang="ts">
  import SettingsMenu from '@component/SettingsMenu.svelte';
  import './app.css';
  import {configuration} from '@lib/page-state.svelte';
  import {getScreenSizeInRem, isDarkTheme} from '@utils/utils.svelte';
  import EditorView from '@view/EditorView.svelte';
  import InfoView from '@view/InfoView.svelte';
  import {
    BookOpenText,
    ChevronLeft,
    ChevronRight,
    CircleQuestionMark,
    FileQuestionMark,
    Info,
    Settings,
    Table,
  } from 'lucide-svelte';
  import Button from '@component/Button.svelte';

  let view = $derived(configuration.currentView);
  let settingsOpen = $state(false);
  let sidebarExpanded = $state(getScreenSizeInRem() >= 48);

  $effect(() => {
    localStorage.setItem('currentView', view);
  });
</script>

<nav class={[isDarkTheme() && 'dark', sidebarExpanded && 'open']}>
  <Button
    class="sidebar-collapse-button"
    color="primary"
    size="max"
    onclick={() => (sidebarExpanded = !sidebarExpanded)}
    >{#if sidebarExpanded}<ChevronLeft class="inline-icon" />
    {:else}
      <ChevronRight class="inline-icon" />
    {/if}</Button
  >
  <Button nobg onclick={() => (view = 'home')}>
    <img src="/route-editor/logo.svg" alt="NSMBW Route Editor" />
    <img src="/route-editor/favicon.svg" alt="RE" class="icon" />
  </Button>
  <hr />
  <div class="main-list">
    <Button color="transparent" textcolor={view === 'home' ? 'primary' : 'default'} onclick={() => (view = 'home')}>
      <Info class="inline-icon" />
      <span>Home</span>
    </Button>
    <Button color="transparent" textcolor={view === 'editor' ? 'primary' : 'default'} onclick={() => (view = 'editor')}>
      <Table class="inline-icon" />
      <span>Editor</span>
    </Button>
    <details>
      <summary><CircleQuestionMark class="inline-icon" /> <span>Reference</span></summary>
      <a
        href="https://horizon.miraheze.org/wiki/Editing_the_Original_Maps"
        target="_blank"
        rel="noopener noreferrer"
        title="(Horizon Wiki) - Editing World Maps"
      >
        <FileQuestionMark class="inline-icon" />
        <span>Editing Maps</span>
      </a>
      <a
        href="https://horizon.miraheze.org/wiki/World_Map_Data"
        target="_blank"
        rel="noopener noreferrer"
        title="(Horizon Wiki) - World Map Data"
      >
        <BookOpenText class="inline-icon" />
        <span>World Map Data</span>
      </a>
    </details>
  </div>
  <hr class="gap" />
  <div class="return-section">
    <a href="https://b1here.github.io">
      <svg class="inline-icon" viewBox="0 0 694 607">
        <path
          d="M0,0H307c41.161,0,128,2.6,128,129v59c0,60.834-20.778,96.126-54,115,31.291,17.7,54,47.914,54,107v62c0,129.731-95.746,135-124,135H0V0ZM130,237H273c14.7,0,30-5.323,30-33V165c0-17.595-12.417-34-29-34H130V237Zm0,239H273c14.7,0,30-5.323,30-33V404c0-17.6-12.417-34-29-34H130V476ZM562,607H694V142C694,10.555,601.474,0,567,0H509V131h20c17.555,0,33,5.006,33,30V607Z"
        ></path>
      </svg>
      <span>B1's Website</span>
    </a>
  </div>
  <hr />
  <div class="icon-group">
    <a
      href="https://github.com/B1Here/route-editor"
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub Repository"
    >
      <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" class="inline-icon">
        <g clip-path="url(#clip0_730_27126)">
          <path
            d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z"
          />
        </g>
        <defs>
          <clipPath id="clip0_730_27126">
            <rect width="98" height="96" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </a>
    <Button
      class="settings-button"
      color="transparent"
      onclick={() => {
        settingsOpen = !settingsOpen;
      }}
      onfocusout={(e) => {
        if (
          !e.currentTarget.contains(e.relatedTarget as HTMLElement) &&
          !(e.relatedTarget as HTMLElement)?.contains(document.getElementById('settings-menu')) &&
          !(e.relatedTarget as HTMLElement)?.closest('#settings-menu')
        ) {
          settingsOpen = false;
        }
      }}
      size="max"
      title="Settings"
      textcolor={settingsOpen ? 'primary' : 'default'}
    >
      <Settings class="inline-icon" />
    </Button>
    <SettingsMenu bind:open={settingsOpen} />
  </div>
</nav>
<main class={[isDarkTheme() && 'dark']}>
  {#if view === 'editor'}
    <EditorView />
  {:else if view === 'home'}
    <InfoView />
  {/if}
</main>

<style>
  nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid var(--color-border);
    color: var(--color-text-dark);
    background-color: var(--color-bg-light);
    width: 12.5rem;
    position: sticky;
    top: 0;
    height: 100vh;
    z-index: 1;
    transition: width 150ms;
  }

  nav img {
    width: 100%;
    padding: 1rem 0.5rem 0.5rem;
    box-sizing: border-box;
  }

  nav img.icon {
    padding: 0;
    display: none;
  }

  nav div {
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
  }

  nav > div.main-list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  nav > div.icon-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
  }

  nav > div.icon-group > a {
    width: max-content;
  }

  nav > div.icon-group > *:last-child {
    margin-left: auto;
  }

  nav a {
    text-decoration: none;
    box-sizing: border-box;
  }

  nav:not(.open) {
    width: 3rem;
  }

  nav:not(.open) img {
    display: none;
  }

  nav:not(.open) img.icon {
    display: block;
    height: 2rem;
    width: 2rem;
  }

  nav .return-section {
    overflow-x: hidden;
  }

  :global(nav button) {
    overflow-x: hidden;
  }

  :global(nav:not(.open) button > span),
  nav:not(.open) a > span,
  nav:not(.open) details > summary > span {
    display: none;
  }

  nav:not(.open) > div.icon-group {
    flex-direction: column;
    justify-content: unset;
  }

  :global(nav .sidebar-collapse-button) {
    padding: 0 !important;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    position: absolute;
    top: 50%;
    left: calc(100% - 0.46875em);
    font-size: 1.5rem;
  }

  a {
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
  }

  a:hover {
    color: var(--color-text-light);
    fill: var(--color-text-light);
    background-color: var(--color-bg-medium);
  }

  a:active {
    background-color: var(--color-bg-dark);
  }

  hr {
    margin: 0;
    border: none;
    border-bottom: 1px solid var(--color-border);
    width: 100%;
  }

  hr.gap {
    margin-top: auto;
  }

  main {
    flex: 1;
    background-color: var(--color-bg-medium);
    color: var(--color-text-medium);
  }

  details {
    padding: 0.5rem 0;
  }

  details > *:not(summary) {
    margin-top: 0.5rem;
  }

  details[open] {
    background-color: color-mix(in srgb, var(--color-bg-medium), var(--color-bg-light) 50%);
    border-radius: 0.5rem;
  }

  summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    margin-top: -0.5rem;
    border-radius: 0.5rem;
  }

  summary:hover,
  summary:focus-visible {
    color: var(--color-text-light);
    fill: var(--color-text-light);
    background-color: var(--color-bg-medium);
  }

  summary:active {
    background-color: var(--color-bg-dark);
  }
  summary::marker {
    content: '';
  }
</style>
