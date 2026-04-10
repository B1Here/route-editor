<script lang="ts">
  import {entityData, routeFiller} from '@lib/page-state.svelte';
  import {rootCycles, routeAnimations, type Route} from '@model/nsmbw';
  import TableRow from '@component/TableRow.svelte';
  import TableCell from '@component/TableCell.svelte';
  import TableEditor from '@component/TableEditor.svelte';
  import {checkForDuplicates} from '@utils/editor-utils.svelte';
  import {verifyPointName} from '@utils/entity-utils.svelte';
  import {csvSplit} from '@utils/csv-utils';
  import {getColorPropertiesForTheme, getDisplayText, isDefined} from '@utils/utils.svelte';

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

  let omittedColumns = $derived(() => {
    const columns: Array<keyof Route> = [];
    if (worldNumber !== 5) {
      columns.push('activeRootCycles');
    }
    return columns;
  });
</script>

<TableEditor
  bind:entities={routes}
  bind:currentIndex
  fileValidator={(entities) => {
    const errors: string[] = [];
    const levelRoutes = entities.filter((r) => r.name.includes('W'));
    const invalidRoutes = levelRoutes.filter(
      (r) =>
        r.name.length === 9 &&
        ((r.name.charAt(1) === 'W' && !r.name.slice(1, 5).startsWith(`W${worldNumber}`)) ||
          (r.name.charAt(5) === 'W' && !r.name.slice(5, 9).startsWith(`W${worldNumber}`))),
    );

    if (invalidRoutes.length > 0) {
      errors.push(
        `All W-points referenced must have a world number of "${worldNumber}". Invalid route names: "${invalidRoutes
          .map((r) => r.name)
          .join('", "')}"`,
      );
    }

    return errors;
  }}
  filler={routeFiller}
  fileData={{name: `routeW${worldNumber}.csv`, omittedColumns: omittedColumns()}}
  headers={[...Object.keys(routeFiller)]}
  mapper={(data, index) => ({
    name: data[0],
    animation: data[1] as Route['animation'],
    activeRootCycles: csvSplit<Route['activeRootCycles'][number]>(data[2], index + 1),
  })}
>
  {#each routes as route, index}
    <TableRow {index} onselect={() => (currentIndex = index)} selected={index === currentIndex}>
      <TableCell
        validator={() => {
          const errors: string[] = [];
          if (
            route.name.length !== 9 ||
            !route.name.startsWith('R') ||
            !verifyPointName(route.name.slice(1, 5), {levelPoint: true, keyPoint: true, flagPoint: true}) ||
            !verifyPointName(route.name.slice(5, 9), {levelPoint: true, keyPoint: true, flagPoint: true})
          ) {
            errors.push('Route name does not follow the correct format (e.g. RW101W102).');
          }

          if (route.name.length === 9 && route.name.slice(1, 5) === route.name.slice(5, 9)) {
            errors.push('Route cannot connect a point with itself.');
          }

          const duplicateMessage = checkForDuplicates(routes, route, index);
          if (isDefined(duplicateMessage)) {
            errors.push(duplicateMessage);
          }

          return errors;
        }}
      >
        <input class="form-control border-0 sharp-corners bg-transparent" type="text" bind:value={route.name} />
      </TableCell>
      <TableCell>
        <select class="form-select border-0 sharp-corners bg-transparent w-full" bind:value={route.animation}>
          {#each routeAnimations as animation}
            <option class={colors.option} value={animation.jpName}>
              {getDisplayText(animation.jpName, animation.translatedName)}
            </option>
          {/each}
        </select>
      </TableCell>
      <TableCell
        validator={() => {
          const errors: string[] = [];
          if (route.activeRootCycles.length >= rootCycles.length) {
            errors.push('A route should not have all root cycles active.');
          }

          return errors;
        }}
      >
        {#if worldNumber === 5}
          <select
            class="form-select border-0 sharp-corners bg-transparent w-full"
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
