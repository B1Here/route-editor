<script lang="ts">
  import {entityData, pointFiller} from '@lib/page-state.svelte';
  import TableEditor from '@component/TableEditor.svelte';
  import TableCell from '@component/TableCell.svelte';
  import TableRow from '@component/TableRow.svelte';
  import {csvSplit} from '@utils/csv-utils';
  import {checkForDuplicates} from '@utils/editor-utils.svelte';
  import {verifyBoneName, verifyPointName} from '@utils/entity-utils.svelte';
  import {getDisplayText, isDefined} from '@utils/utils.svelte';
  import {type Point, type FlagKeys, numberedFlags, allFlags} from '@model/nsmbw';

  let points = $derived(entityData.points);
  let worldNumber = $derived(parseInt(points.find((p) => p.name.startsWith('W'))?.name[1] || '0'));

  let currentIndex = $state(0);
</script>

<TableEditor
  filevalidator={(entities: Point[]) => {
    const errors: string[] = [];

    const demoPoints = entities
      .map((p) => p.flags.filter((f) => f.match(/^demo[0-9]$/)))
      .flat()
      .filter(Boolean)
      .sort((a, b) => parseInt(a[a.length - 1]) - parseInt(b[b.length - 1]));

    for (let i = 0; i < demoPoints.length; i++) {
      if (parseInt(demoPoints[i][demoPoints[i].length - 1]) !== i + 1) {
        errors.push('The demo flags must be in sequential order.');
        break;
      }
    }

    const dokanPoints = entities.filter((p) => p.flags.includes('dokan'));
    if (![0, 2].includes(dokanPoints.length)) {
      errors.push('Either 0 or 2 points with the "dokan" flag can exist within one map.');
    }
    return errors;
  }}
  bind:currentindex={currentIndex}
  bind:entities={points}
  filedata={{name: `pointW${worldNumber}.csv`}}
  filler={pointFiller}
  headers={Object.keys(pointFiller)}
  mapper={(data, index) => {
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
>
  {#each points as point, index}
    {@const isNotLevelPoint = verifyPointName(point.name, {flagPoint: true, keyPoint: true})}
    <TableRow {index} onselect={() => (currentIndex = index)} selected={index === currentIndex}>
      <TableCell textalign="center">{point.id}</TableCell>
      <TableCell
        validator={() => {
          const errors: string[] = [];
          if (!verifyPointName(point.name, {levelPoint: true, flagPoint: true})) {
            errors.push('The point name does not follow the correct format (e.g. W101 or F011).');
          }
          const duplicateMessage = checkForDuplicates(points, point, index);
          if (isDefined(duplicateMessage)) {
            errors.push(duplicateMessage);
          }

          return errors;
        }}
      >
        <input type="text" bind:value={point.name} />
      </TableCell>
      <TableCell
        validator={() => {
          const errors: string[] = [];
          const pointsWithUniqueFlags = points.filter(
            (p) => p.id !== point.id && p.flags.some((f) => numberedFlags.includes(f)),
          );

          const twoOfSame = pointsWithUniqueFlags.some((p) =>
            p.flags.some((f) => point.flags.includes(f) && numberedFlags.includes(f)),
          );

          if (twoOfSame) {
            errors.push(`Points cannot share unique flags: "${pointsWithUniqueFlags.map((p) => p.name).join(', ')}".`);
          }

          const multipleOfSamePrefix = ['demo', 'link'].some(
            (prefix) => point.flags.filter((f) => f.startsWith(prefix)).length > 1,
          );

          if (multipleOfSamePrefix) {
            errors.push('A point can have at most one "link" and one "demo" flag.');
          }

          return errors;
        }}
      >
        <select multiple size="1" bind:value={point.flags}>
          {#each Object.keys(allFlags) as flag}
            <option value={flag}>
              {getDisplayText(flag, allFlags[flag as FlagKeys])}
            </option>
          {/each}
        </select>
      </TableCell>
      <TableCell
        validator={() => {
          const errors: string[] = [];
          if (
            point.levelsAfterClear.length > 0 &&
            point.levelsAfterClear.split(',').some((level) => !verifyPointName(level, {levelPoint: true}))
          ) {
            errors.push('A level name does not follow the correct format (e.g. W101).');
          }
          if (point.levelsAfterClear.includes(' ')) {
            errors.push('Level names need to be separated by commas.');
          }
          if (point.name.length === 4 && point.levelsAfterClear.includes(point.name)) {
            errors.push('A point cannot unlock itself.');
          }

          return errors;
        }}
      >
        <input disabled={isNotLevelPoint} bind:value={point.levelsAfterClear} />
      </TableCell>
      <TableCell
        validator={() => {
          const errors: string[] = [];
          if (point.bonesAfterClear.length > 0 && point.bonesAfterClear.split(',').some((rb) => rb.length > 9)) {
            errors.push('An unlocked bone name cannot exceed 9 characters in length.');
          }
          if (point.bonesAfterClear.length > 0 && !point.bonesAfterClear.split(',').every(verifyBoneName)) {
            errors.push('A bone name may only contain alphanumeric characters and underscores.');
          }
          if (point.bonesAfterClear.includes(' ')) {
            errors.push('Unlocked bone names need to be separated by commas.');
          }
          if (
            point.bonesAfterClear
              .split(',')
              .some((bone) => bone.length === 9 && bone.startsWith('R') && bone.endsWith(point.name))
          ) {
            errors.push('A point cannot unlock itself.');
          }

          return errors;
        }}
      >
        <input disabled={isNotLevelPoint} bind:value={point.bonesAfterClear} />
      </TableCell>
      <TableCell class="unused invert-text-dark" textalign="center">Unused (does nothing)</TableCell>
      <TableCell
        validator={() => {
          const errors: string[] = [];
          if (
            point.levelsAfterSecretExit.length > 0 &&
            point.levelsAfterSecretExit.split(',').some((level) => !verifyPointName(level, {levelPoint: true}))
          ) {
            errors.push('A level name does not follow the correct format (e.g. W101).');
          }
          if (point.levelsAfterSecretExit.includes(' ')) {
            errors.push('Level names need to be separated by commas.');
          }
          if (point.name.length === 4 && point.levelsAfterSecretExit.includes(point.name)) {
            errors.push('A point cannot unlock itself.');
          }

          return errors;
        }}
      >
        <input disabled={isNotLevelPoint} bind:value={point.levelsAfterSecretExit} />
      </TableCell>
      <TableCell
        validator={() => {
          const errors: string[] = [];
          if (
            point.bonesAfterSecretExit.length > 0 &&
            point.bonesAfterSecretExit.split(',').some((rb) => rb.length > 9)
          ) {
            errors.push('An unlocked bone name cannot exceed 9 characters in length.');
          }
          if (point.bonesAfterSecretExit.length > 0 && !point.bonesAfterSecretExit.split(',').every(verifyBoneName)) {
            errors.push('A bone name may only contain alphanumeric characters and underscores.');
          }
          if (point.bonesAfterSecretExit.includes(' ')) {
            errors.push('Unlocked bone names need to be separated by commas.');
          }
          if (
            point.bonesAfterSecretExit
              .split(',')
              .some((bone) => bone.length === 9 && bone.startsWith('R') && bone.endsWith(point.name))
          ) {
            errors.push('A point cannot unlock itself.');
          }

          return errors;
        }}
      >
        <input disabled={isNotLevelPoint} bind:value={point.bonesAfterSecretExit} />
      </TableCell>
      <TableCell class="unused invert-text-dark" textalign="center">Unused (does nothing)</TableCell>
    </TableRow>
  {/each}
</TableEditor>

<style>
  input:disabled {
    background-color: var(--color-bg-dark);
  }

  :global .table-editor table tbody td.unused {
    color: var(--color-text-dark);
    opacity: 0.5;
  }
</style>
