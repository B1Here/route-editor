import type {ValidationResult} from "../model/common";

/**
 * Converts the given string to a valid CSS class name by replacing all non-alphanumeric characters with hyphens and converting to lowercase.
 * @param str the string to convert.
 * @returns the converted string.
 */
export function toClassName(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

export function createTableHeader(name: string): string {
  if (['id'].includes(name.toLowerCase())) {
    return name.toUpperCase();
  }

  for (let i = 1; i < name.length; i++) {
    if (name.charAt(i).toUpperCase() === name.charAt(i)) {
      name = name.slice(0, i) + '\u00a0' + name.slice(i);
      i++;
    }
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function checkForDuplicates<T extends {name: string;}>(entityData: T[], item: T, index: number): ValidationResult {
  const duplicates = entityData
    .map((data, i) => ({data, index: i}))
    .filter((entity, i) => entity.data.name.trim() !== '' && i !== index && entity.data.name === item.name);
  return {
    valid: duplicates.length === 0,
    message: `The list already contains the name "${item.name}" at row(s): ${duplicates.map((d) => d.index + 1).join(', ')}`,
  };
}
