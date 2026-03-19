<script lang="ts">
  import {entityData, pointFiller} from '../../page-state.svelte';
  import type {FlagKeys, Point} from '../../model/common';
  import {allFlags, uniqueFlags} from '../../model/route-info-data';
  import TableEditor from '../TableEditor.svelte';
  import TableCell from '../TableCell.svelte';
  import TableRow from '../TableRow.svelte';
  import {csvSplit} from '../../utils/csv-utils';
  import {checkForDuplicates} from '../../utils/editor-utils.svelte';
  import {verifyBoneName, verifyPointName} from '../../utils/entity-utils.svelte';
  import {getColorPropertiesForTheme} from '../../utils/utils.svelte';

  let points = $derived(entityData.points);
  let worldNumber = $derived(parseInt(points.find((p) => p.name.startsWith('W'))?.name[1] || '0'));

  let currentIndex = $state(0);

  const colors = $derived(
    getColorPropertiesForTheme(
      {
        light: {
          option: '',
          unused: 'text-black/50',
        },
        dark: {
          option: 'bg-black text-white',
          unused: 'text-white/50',
        },
      },
    ),
  );
</script>

<TableEditor
  beforeDownloadValidators={[
    (entities: Point[]) => {
      const demoPoints = entities
        .map((p) => p.flags.filter((f) => f.match(/^demo[0-9]$/)))
        .flat()
        .filter(Boolean)
        .sort((a, b) => parseInt(a[a.length - 1]) - parseInt(b[b.length - 1]));

      let inSequentialOrder = true;
      for (let i = 0; i < demoPoints.length; i++) {
        if (parseInt(demoPoints[i][demoPoints[i].length - 1]) !== i + 1) {
          inSequentialOrder = false;
          break;
        }
      }
      return {
        valid: inSequentialOrder,
        message: 'The demo flags must be in sequential order.',
      };
    },
    (entities: Point[]) => {
      const dokanPoints = entities.filter((p) => p.flags.includes('dokan'));
      return {
        valid: [0, 2].includes(dokanPoints.length),
        message: 'Either 0 or 2 points with the "dokan" flag can exist within one map.',
      };
    },
  ]}
  bind:currentIndex
  bind:entities={points}
  entityMapper={(data, index) => {
    return {
      id: parseInt(data[0]),
      name: data[1],
      flags: csvSplit<FlagKeys>(data[2], index + 1),
      levelsAfterClear: data[3],
      bonesAfterClear: data[4],
      animationsAfterClear: null,
      levelsAfterSecretExit: data[6],
      bonesAfterSecretExit: data[7],
      animationsAfterSecretExit: null,
    };
  }}
  fileData={{name: `pointW${worldNumber}.csv`}}
  filler={pointFiller}
  headers={Object.keys(pointFiller)}
>
  {#each points as point, index}
    <TableRow {index} onselect={() => (currentIndex = index)} selected={index === currentIndex}>
      <TableCell class="text-center">{point.id}</TableCell>
      <TableCell
        validators={[
          () => {
            return {
              valid: verifyPointName(point.name, {levelPoint: true, flagPoint: true}),
              message: 'The point name does not follow the correct format (e.g. W101 or F011).',
            };
          },
          () => checkForDuplicates(points, point, index),
        ]}
      >
        <input class="outline-none px-1" type="text" bind:value={point.name} />
      </TableCell>
      <TableCell
        validators={[
          () => {
            const pointsWithUniqueFlags = points.filter(
              (p) => p.id !== point.id && p.flags.some((f) => uniqueFlags.includes(f)),
            );

            return {
              valid: !pointsWithUniqueFlags.some((p) =>
                p.flags.some((f) => point.flags.includes(f) && uniqueFlags.includes(f)),
              ),
              message: `Points cannot share unique flags: "${pointsWithUniqueFlags.map((p) => p.name).join(', ')}".`,
            };
          },
          () => {
            return {
              valid: ['demo', 'link'].every((prefix) => {
                return point.flags.filter((f) => f.startsWith(prefix)).length <= 1;
              }),
              message: 'A point can have at most one "link" and one "demo" flag.',
            };
          },
        ]}
      >
        <select multiple size="1" id="route-animation" bind:value={point.flags}>
          {#each Object.keys(allFlags) as flag}
            <option class={colors.option} value={flag}>
              {allFlags[flag as FlagKeys]}
            </option>
          {/each}
        </select>
      </TableCell>
      <TableCell
        validators={[
          () => {
            return {
              valid:
                point.levelsAfterClear.length === 0 ||
                point.levelsAfterClear.split(',').every((level) => verifyPointName(level, {levelPoint: true})),
              message: 'A level name does not follow the correct format (e.g. W101).',
            };
          },
        ]}
      >
        <input class="outline-none px-1" bind:value={point.levelsAfterClear} />
      </TableCell>
      <TableCell
        validators={[
          () => ({
            valid: point.bonesAfterClear.length === 0 || point.bonesAfterClear.split(',').every((rb) => rb.length <= 9),
            message: 'An unlocked bone name cannot exceed 9 characters in length.',
          }),
          () => ({
            valid:
              point.bonesAfterClear.length === 0 || point.bonesAfterClear.split(',').every((rb) => verifyBoneName(rb)),
            message: 'A bone name may only contain alphanumeric characters and underscores.',
          }),
        ]}
      >
        <input class="outline-none px-1" bind:value={point.bonesAfterClear} />
      </TableCell>
      <TableCell class={["px-2 text-center", colors.unused]}>Unused (does nothing)</TableCell>
      <TableCell
        validators={[
          () => {
            return {
              valid:
                point.levelsAfterSecretExit.length === 0 ||
                point.levelsAfterSecretExit.split(',').every((level) => verifyPointName(level, {levelPoint: true})),
              message: 'A level name does not follow the correct format (e.g. W101).',
            };
          },
        ]}
      >
        <input class="outline-none px-1" bind:value={point.levelsAfterSecretExit} />
      </TableCell>
      <TableCell
        validators={[
          () => ({
            valid:
              point.bonesAfterSecretExit.length === 0 ||
              point.bonesAfterSecretExit.split(',').every((rb) => rb.length <= 9),
            message: 'An unlocked bone name cannot exceed 9 characters in length.',
          }),
          () => ({
            valid:
              point.bonesAfterSecretExit.length === 0 ||
              point.bonesAfterSecretExit.split(',').every((rb) => verifyBoneName(rb)),
            message: 'A bone name may only contain alphanumeric characters and underscores.',
          }),
        ]}
      >
        <input class="outline-none px-1" bind:value={point.bonesAfterSecretExit} />
      </TableCell>
      <TableCell class={["px-2 text-center", colors.unused]}>Unused (does nothing)</TableCell>
    </TableRow>
  {/each}
</TableEditor>
