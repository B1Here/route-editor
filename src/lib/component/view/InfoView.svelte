<script lang="ts">
  import {BookOpenText} from 'lucide-svelte';
  import changelog from '../../../changelog.json';
  import {getColorPropertiesForTheme} from '../../utils/utils.svelte';
  import CodeBlock from '../CodeBlock.svelte';

  const colors = $derived(
    getColorPropertiesForTheme({
      light: {
        strongText: 'text-black',
        paragraph: 'text-gray-800',
      },
      dark: {
        strongText: 'text-white',
        paragraph: 'text-gray-300',
      },
    }),
  );
</script>

{#snippet list(key: string, items: string[])}
  <h4 class="text-xl">{key}</h4>
  <ul class={['list-disc list-inside my-3', colors.paragraph]}>
    {#each items as item}
      <li class={colors.paragraph}>{item}</li>
    {/each}
  </ul>
{/snippet}

{#snippet navButton(label: string, id: string)}
  <button
    class="cursor-pointer hover:opacity-75 py-1"
    onclick={() => document.querySelector(`#${id}`)?.scrollIntoView({behavior: 'smooth'})}
  >
    {label.replace(/ /g, '\u00A0')}
  </button>
{/snippet}

<div class="h-full flex">
  <div class="border-r border-neutral-500 px-4 flex flex-col">
    <h2 class="flex gap-x-2 py-2 text-lg font-bold border-b border-neutral-500 mb-2">
      <BookOpenText class="h-auto" />Contents
    </h2>
    {@render navButton('About this page', 'about')}
    {@render navButton('About Routes', 'routes')}
    {@render navButton('About Points', 'points')}
    {@render navButton('Changelog', 'changelog')}
  </div>
  <div class="overflow-auto px-4">
    <img class="w-6/12 mx-auto mt-8 mb-16" src="/route-editor/logo.svg" alt="NSMBW Route Editor" />
    <h2 class="text-3xl font-medium my-3" id="about">About this page</h2>
    <p class={['mb-4', colors.paragraph]}>
      This page was created by <a
        class="text-blue-500 hover:text-blue-400 active:text-blue-400"
        href="https://b1here.github.io"
        target="_blank">B1 Here</a
      > to help with editing the RouteInfo file of New Super Mario Bros. Wii. It provides all the necessary functions required
      to make a valid RouteInfo file for both points and routes.
    </p>
    <p class={['mb-4', colors.paragraph]}>
      For more information, check out the <a
        class="text-blue-500 hover:text-blue-400 active:text-blue-400"
        href="https://horizon.miraheze.org/wiki/Editing_the_Original_Maps"
        target="_blank">Editing the Original Maps</a
      > page on the Horizon wiki.
    </p>
    <h3 class="text-2xl font-medium">Credits</h3>
    <ul class={['list-disc list-inside my-3', colors.paragraph]}>
      <li>
        The <a
          class="text-blue-500 hover:text-blue-400 active:text-blue-400"
          href="https://discord.gg/Quvaj2Ufhb"
          target="_blank"
        >
          Horizon Discord Server
        </a>
      </li>
    </ul>

    <hr class="border-neutral-500" />

    <h2 class="text-3xl font-medium my-3" id="routes">About Routes</h2>
    <p class={['mb-4', colors.paragraph]}>A route is an invisible straight line connecting two points.</p>
    <p class={['mb-4', colors.paragraph]}>The player can traverse a route in many different ways. This includes:</p>
    <ul class={['list-disc list-inside my-3', colors.paragraph]}>
      <li>Walking</li>
      <li>Jumping</li>
      <li>Climbing</li>
      <li>and many other ways...</li>
    </ul>
    <p class={['mb-4', colors.paragraph]}>
      For a full list, visit the <a
        class="text-blue-500 hover:text-blue-400 active:text-blue-400"
        href="https://horizon.miraheze.org/wiki/World_Map_Data#Route_Animations"
        target="_blank">World Map Data &rarr; Editing Route Animations</a
      > page on the Horizon wiki.
    </p>

    <hr class="border-neutral-500" />

    <h2 class="text-3xl font-medium my-3" id="points">About Points</h2>
    <p class={['mb-4', colors.paragraph]}>
      A point defines a spot on the world map, the player can stand on or move across. Two points make up a route. A
      point <b class={colors.strongText}>must</b>
      follow the following convention or it might not work properly:
      <CodeBlock>Xyyy</CodeBlock>.
    </p>
    <p class={['mb-4', colors.paragraph]}>There are three different types of points:</p>
    <ul class={['list-disc list-inside my-3', colors.paragraph]}>
      <li>
        <b class={colors.strongText}>Fxxx</b>: Points that can have flags set which can limit the players' and camera's
        actions. <CodeBlock>xxx</CodeBlock> can be any 3-digit number.
      </li>
      <li>
        <b class={colors.strongText}>Kxxx</b>: Points the players can pass through. They cannot have flags set. <CodeBlock
          >xxx</CodeBlock
        > can be any 3-digit number.
      </li>
      <li>
        <b class={colors.strongText}>Wxyz</b>: Points that act as levels the players must play through in order to
        progress. The player will always stop on these points. <CodeBlock>x</CodeBlock> is the world number, <CodeBlock
          >y</CodeBlock
        > can be used to indicate a special level like a tower, castle or ghost house and <CodeBlock>z</CodeBlock> is a generic
        level number ranging from 0 to 9. Common examples are:
        <ul class={['list-disc list-inside my-3 ml-6', colors.paragraph]}>
          <li><CodeBlock>W101</CodeBlock></li>
          <li><CodeBlock>W2T0</CodeBlock></li>
          <li><CodeBlock>W3G0</CodeBlock></li>
        </ul>
      </li>
    </ul>
    <p class={['mb-4', colors.paragraph]}>
      For more information, visit the <a
        class="text-blue-500 hover:text-blue-400 active:text-blue-400"
        href="https://horizon.miraheze.org/wiki/World_Map_Data#Point_Names"
        target="_blank"
      >
        World Map Data &rarr; Point Names
      </a> page on the Horizon wiki.
    </p>

    <hr class="border-neutral-500" />

    <h2 class="text-3xl font-medium my-3" id="changelog">Changelog</h2>
    {#each changelog as entry}
      <h3 class="text-2xl font-medium my-2">{entry.version}</h3>
      {#if entry.additions.length}
        {@render list('Additions', entry.additions)}
      {/if}
      {#if entry.changes.length}
        {@render list('Changes', entry.changes)}
      {/if}
      {#if entry.bugfixes.length}
        {@render list('Bugfixes', entry.bugfixes)}
      {/if}
    {/each}
  </div>
</div>
