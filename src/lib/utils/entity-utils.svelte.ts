import {isDefined} from "@utils/utils.svelte";

interface PointVerificationOptions {
  levelPoint: true;
  flagPoint: true;
  passPoint: true;
}

export function entityHasId<T extends object>(entity: T): entity is T & {id: number;} {
  return typeof (entity as any).id === 'number';
}

/**
 * Updates the indicies of the given entities if they all have an `id` property. The `id` property of each entity will be set to its current index in the array.
 * @param entities the array of entities to update.
 */
function updateIndecies<T extends object>(entities: T[]): void {
  if (entities.every(entityHasId)) {
    entities.forEach((item, idx) => {
      item.id = idx;
    });
  }
}

export function addEntity<T extends object>(entities: T[], filler: T, index?: number): void {
  let pushIndex = entities.length;
  if (isDefined(index) && index >= 0 && index < entities.length) {
    pushIndex = index + 1;
  }

  entities.splice(pushIndex, 0, structuredClone(filler));
  updateIndecies(entities);
}

export function removeEntity<T extends object>(entities: T[], index: number): void {
  entities.splice(index, 1);
  updateIndecies(entities);
}

export function moveEntity<T extends object>(entities: T[], index: number, direction: 'up' | 'down'): void {
  if (direction === 'up' && index > 0) {
    const temp = entities[index - 1];
    entities[index - 1] = entities[index];
    entities[index] = temp;
  } else if (direction === 'down' && index < entities.length - 1) {
    const temp = entities[index + 1];
    entities[index + 1] = entities[index];
    entities[index] = temp;
  }

  updateIndecies(entities);
}

/**
 * @param pointName the point name to verify.
 * @param matchAgainst a set of options defining how strictly or loosely a point name should be verified. If omitted, only the length of the name will be checked.
 * @return whether the given point name is valid.
 */
export function verifyPointName(pointName: string, matchAgainst?: Partial<PointVerificationOptions>): boolean {
  if (pointName.length !== 4) {
    return false;
  }

  if (!isDefined(matchAgainst)) {
    return true;
  }

  if (matchAgainst.levelPoint && pointName.match(/^W[1-9](?:S[0-1]|K[0-3]|[ACGTWX]0|0[1-9])$/) != null) {
    return true;
  }

  if (matchAgainst.flagPoint && pointName.match(/^F[0-9abcdkls][0-9C]{2}$/) != null) {
    return true;
  }

  if (matchAgainst.passPoint && pointName.match(/^K[a0-9][0-9][0-9a-f]$/) != null) {
    return true;
  }

  return false;
}

/**
 * @param boneName the bone name to verify.
 * @returns whether the given bone is valid.
 */
export function verifyBoneName(boneName: string): boolean {
  return boneName.match(/^[a-zA-Z0-9_]+$/) !== null;
}
