<script lang="ts">
  import {entityData, routeFiller} from '@lib/page-state.svelte';
  import type {Route} from '@model/common';
  import {rootCycles, routeAnimations} from '@model/route-info-data';
  import TableRow from '@component/TableRow.svelte';
  import TableCell from '@component/TableCell.svelte';
  import TableEditor from '@component/TableEditor.svelte';
  import {checkForDuplicates} from '@utils/editor-utils.svelte';
  import {verifyPointName} from '@utils/entity-utils.svelte';
  import {csvSplit} from '@utils/csv-utils';
  import {getColorPropertiesForTheme} from '@utils/utils.svelte';

  let routes = $derived(entityData.routes);
  let worldNumber = $derived(
    parseInt(routes.find((r) => r.name.length === 9 && r.name.startsWith('RW'))?.name[2] || '0'),
  );
  let currentIndex = $state(0);

  const colors = $derived(
    getColorPropertiesForTheme({
      light: {
        option: '',
      },
      dark: {
        option: 'bg-black text-white',
      },
    }),
  );
</script>

<TableEditor
  bind:entities={routes}
  bind:currentIndex
  filler={routeFiller}
  entityMapper={(data, index) => ({
    name: data[0],
    animation: data[1] as Route['animation'],
    activeRootCycles: csvSplit<Route['activeRootCycles'][number]>(data[2], index + 1),
  })}
  fileData={{name: `routeW${worldNumber}.csv`, omittedColumns: {activeRootCycles: () => worldNumber !== 5}}}
  beforeDownloadValidators={[
    (entities: Route[]) => {
      const levelRoutes = entities.filter((r) => r.name.includes('W'));
      const invalidRoutes = levelRoutes.filter(
        (r) =>
          r.name.length === 9 &&
          ((r.name.charAt(1) === 'W' && !r.name.slice(1, 5).startsWith(`W${worldNumber}`)) ||
            (r.name.charAt(5) === 'W' && !r.name.slice(5, 9).startsWith(`W${worldNumber}`))),
      );
      return {
        valid: invalidRoutes.length === 0,
        message: `All W-points referenced must have a world number of "${worldNumber}". Invalid route names: "${invalidRoutes
          .map((r) => r.name)
          .join('", "')}"`,
      };
    },
  ]}
  headers={[...Object.keys(routeFiller)]}
>
  {#each routes as route, index}
    <TableRow {index} onselect={() => (currentIndex = index)} selected={index === currentIndex}>
      <TableCell
        validators={[
          () => ({
            valid:
              route.name.length === 9 &&
              route.name.startsWith('R') &&
              verifyPointName(route.name.slice(1, 5), {levelPoint: true, passPoint: true, flagPoint: true}) &&
              verifyPointName(route.name.slice(5, 9), {levelPoint: true, passPoint: true, flagPoint: true}),
            message: 'Route name does not follow the correct format (e.g. RW101W102).',
          }),
          () => ({
            valid: route.name.length !== 9 || route.name.slice(1, 5) !== route.name.slice(5, 9),
            message: 'Route cannot connect a point with itself.',
          }),
          () => checkForDuplicates(routes, route, index),
        ]}
      >
        <input class="form-control border-0 sharp-corners bg-transparent" type="text" bind:value={route.name} />
      </TableCell>
      <TableCell>
        <select
          class="form-select border-0 sharp-corners bg-transparent"
          id="route-animation"
          bind:value={route.animation}
        >
          {#each routeAnimations as animation}
            <option class={colors.option} value={animation.jpName}>
              {animation.translatedName}
            </option>
          {/each}
        </select>
      </TableCell>
      <TableCell
        validators={[
          () => ({
            valid: route.activeRootCycles.length !== rootCycles.length,
            message: 'A route should not have all root cycles active.',
          }),
        ]}
      >
        {#if worldNumber === 5}
          <select
            class="form-select border-0 sharp-corners bg-transparent"
            multiple
            size="1"
            bind:value={route.activeRootCycles}
          >
            {#each rootCycles as cycle}
              <option class={colors.option} value={cycle}>
                Cycle {cycle}
              </option>
            {/each}
          </select>
        {:else}
          <div class="text-muted text-center" title="Only available in World 5">unavailable</div>
        {/if}
      </TableCell>
    </TableRow>
  {/each}
</TableEditor>
