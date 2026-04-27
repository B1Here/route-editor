<script lang="ts">
  import {BookOpenText} from 'lucide-svelte';
  import changelog from '@lib/changelog.json';
  import Button from '@component/Button.svelte';
</script>

{#snippet list(key: string, items: string[])}
  <h4>{key}</h4>
  <ul>
    {#each items as item}
      <li>{item}</li>
    {/each}
  </ul>
{/snippet}

{#snippet navButton(label: string, id: string)}
  <Button
    textalign="center"
    nobg
    onclick={() => document.querySelector(`#${id}`)?.scrollIntoView({behavior: 'smooth'})}
  >
    {label.replace(/ /g, '\u00A0')}
  </Button>
{/snippet}

<aside>
  <h2 class="invert-text-dark">
    <BookOpenText class="inline-icon" /> Contents
  </h2>
  {@render navButton('About this page', 'about')}
  {@render navButton('About Routes', 'routes')}
  {@render navButton('About Points', 'points')}
  {@render navButton('Changelog', 'changelog')}
</aside>
<section class="info-view">
  <div class="logo-wrapper">
    <img src="/route-editor/logo.svg" alt="NSMBW Route Editor" />
  </div>
  <h2 class="invert-text-dark" id="about">About this page</h2>
  <p>
    This page was created by <a href="https://b1here.github.io" target="_blank">B1 Here</a> to help with editing the RouteInfo
    file of New Super Mario Bros. Wii. It provides all the necessary functions required to make a valid RouteInfo file for
    both points and routes.
  </p>
  <p>
    For more information, check out the <a
      href="https://horizon.miraheze.org/wiki/Editing_the_Original_Maps"
      target="_blank">Editing the Original Maps</a
    > page on the Horizon wiki.
  </p>
  <h3>Credits</h3>
  <ul>
    <li>
      The <a href="https://discord.gg/Quvaj2Ufhb" target="_blank"> Horizon Discord Server </a>
    </li>
  </ul>

  <hr />

  <h2 class="invert-text-dark" id="routes">About Routes</h2>
  <p>A route is an invisible straight line connecting two points.</p>
  <p>The player can traverse a route in many different ways. This includes:</p>
  <ul>
    <li>Walking</li>
    <li>Jumping</li>
    <li>Climbing</li>
    <li>and many other ways...</li>
  </ul>
  <p>
    For a full list, visit the <a
      href="https://horizon.miraheze.org/wiki/World_Map_Data#Route_Animations"
      target="_blank">World Map Data &rarr; Editing Route Animations</a
    > page on the Horizon wiki.
  </p>

  <hr />

  <h2 class="invert-text-dark" id="points">About Points</h2>
  <p>
    A point defines a spot on the world map, the player can stand on or move across. Two points make up a route. A point <b
      >must</b
    >
    follow the following convention or it might not work properly:
    <code>Xyyy</code>.
  </p>
  <p>There are three different types of points:</p>
  <ul>
    <li>
      <b>Fxxx</b>: Points that can have flags set which can limit the players' and camera's actions. <code>xxx</code> can
      be any 3-digit number.
    </li>
    <li>
      <b>Kxxx</b>: Points the players can pass through. They cannot have flags set.
      <code>xxx</code> can be any 3-digit number.
    </li>
    <li>
      <b>Wxyz</b>: Points that act as levels the players must play through in order to progress. The player will always
      stop on these points. <code>x</code> is the world number, <code>y</code> can be used to indicate a special level
      like a tower, castle or ghost house and <code>z</code> is a generic level number ranging from 0 to 9. Common
      examples are:
      <ul>
        <li><code>W101</code></li>
        <li><code>W2T0</code></li>
        <li><code>W3G0</code></li>
      </ul>
    </li>
  </ul>
  <p>
    For more information, visit the <a
      href="https://horizon.miraheze.org/wiki/World_Map_Data#Point_Names"
      target="_blank"
    >
      World Map Data &rarr; Point Names
    </a> page on the Horizon wiki.
  </p>

  <hr />

  <h2 class="invert-text-dark" id="changelog">Changelog</h2>
  {#each changelog as entry}
    <h3>{entry.version}</h3>
    {#if entry.additions?.length}
      {@render list('Additions', entry.additions)}
    {/if}
    {#if entry.changes?.length}
      {@render list('Changes', entry.changes)}
    {/if}
    {#if entry.bugfixes?.length}
      {@render list('Bugfixes', entry.bugfixes)}
    {/if}
  {/each}
  <hr />
  <footer class="invert-text-dark">&copy; 2025 - {new Date().getFullYear()} B1Here</footer>
</section>

<style>
  :global(main:has(.info-view)) {
    display: flex;
    height: 100%;
    position: relative;
  }

  h2 {
    color: var(--color-text-dark);
  }

  aside {
    border-right: 1px solid var(--color-border);
    padding-inline: 1rem;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  section {
    box-sizing: border-box;
    padding-inline: 1rem;
    overflow-y: auto;
  }

  hr {
    border: none;
    border-bottom: 1px solid var(--color-border);
  }

  code {
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    padding: 0.25rem;
  }

  li > code {
    line-height: 1.75rem;
  }

  a {
    color: var(--color-primary);
  }

  a:hover,
  a:focus-visible {
    color: color-mix(in srgb, var(--color-primary), white 16%);
  }

  a:active {
    color: color-mix(in srgb, var(--color-primary), white 33%);
  }

  aside > h2 {
    display: flex;
    column-gap: 0.5rem;
    padding-block: 0.5rem;
    font-size: 1.125rem;
    font-weight: 700;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0.5rem;
    align-items: center;
    justify-content: center;
  }

  .logo-wrapper {
    display: flex;
    justify-content: center;
  }

  img {
    width: 50%;
    margin-top: 2rem;
    margin-bottom: 4rem;
  }

  footer {
    padding: 0.5rem 0 1rem;
    text-align: center;
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--color-text-dark);
  }

  @media screen and (max-width: 48rem) {
    aside {
      display: none;
    }
  }
</style>
