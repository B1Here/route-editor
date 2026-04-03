<script lang="ts">
  import './app.css';
  import {Info, Settings, Table} from 'lucide-svelte';
  import {configuration} from '@lib/page-state.svelte';
  import {getColorPropertiesForTheme} from '@utils/utils.svelte';
  import EditorView from '@view/EditorView.svelte';
  import InfoView from '@view/InfoView.svelte';
  import SettingsView from '@view/SettingsView.svelte';

  let view = $derived(configuration.currentView);

  $effect(() => {
    localStorage.setItem('currentView', view);
  });

  const colors = $derived(
    getColorPropertiesForTheme({
      light: {
        pageBg: 'bg-white',
        pageText: 'text-black',
        navBg: 'bg-zinc-200',
        linkHover: 'hover:text-zinc-700 fill-black hover:fill-zinc-700',
        linkSelected: 'bg-zinc-400',
      },
      dark: {
        pageBg: 'bg-zinc-800',
        pageText: 'text-white',
        navBg: 'bg-zinc-700',
        linkHover: 'hover:text-zinc-300 fill-white hover:fill-zinc-300',
        linkSelected: 'bg-zinc-600',
      },
    }),
  );
</script>

<nav class={['flex flex-col items-center border-r border-neutral-500 overflow-y-auto', colors.pageText, colors.navBg]}>
  <button
    class={[
      'flex flex-col items-center cursor-pointer transition-colors duration-150 w-full p-2',
      colors.linkHover,
      view === 'editor' && colors.linkSelected,
    ]}
    onclick={() => (view = 'editor')}
  >
    <Table /> Editor
  </button>
  <button
    class={[
      'flex flex-col items-center cursor-pointer transition-colors duration-150 w-full p-2',
      colors.linkHover,
      view === 'info' && colors.linkSelected,
    ]}
    onclick={() => (view = 'info')}
  >
    <Info /> Info
  </button>
  <button
    class={[
      'flex flex-col items-center cursor-pointer transition-colors duration-150 w-full p-2',
      colors.linkHover,
      view === 'settings' && colors.linkSelected,
    ]}
    onclick={() => (view = 'settings')}
  >
    <Settings /> Settings
  </button>
  <hr class="border-neutral-500 w-full" />
  <hr class="border-neutral-500 w-full mt-auto" />
  <a
    class={['flex flex-col items-center cursor-pointer transition-colors duration-150 p-2', colors.linkHover]}
    href="https://b1here.github.io"
  >
    <svg class="w-6" viewBox="0 0 694 607">
      <path
        d="M0,0H307c41.161,0,128,2.6,128,129v59c0,60.834-20.778,96.126-54,115,31.291,17.7,54,47.914,54,107v62c0,129.731-95.746,135-124,135H0V0ZM130,237H273c14.7,0,30-5.323,30-33V165c0-17.595-12.417-34-29-34H130V237Zm0,239H273c14.7,0,30-5.323,30-33V404c0-17.6-12.417-34-29-34H130V476ZM562,607H694V142C694,10.555,601.474,0,567,0H509V131h20c17.555,0,33,5.006,33,30V607Z"
      ></path>
    </svg>
    Home
  </a>
  <hr class="border-neutral-500 w-full" />
  <a
    class={['flex flex-col items-center cursor-pointer transition-colors duration-150 p-2', colors.linkHover]}
    href="https://github.com/B1Here/route-editor"
    target="_blank"
    rel="noopener noreferrer"
  >
    <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" class="h-6">
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
    GitHub
  </a>
</nav>
<main class={['overflow-hidden flex-1 h-full w-full', colors.pageBg, colors.pageText]}>
  {#if view === 'editor'}
    <EditorView />
  {:else if view === 'info'}
    <InfoView />
  {:else if view === 'settings'}
    <SettingsView />
  {/if}
</main>
