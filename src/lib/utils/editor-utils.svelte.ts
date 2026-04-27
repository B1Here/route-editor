/**
 * Generates a human-readable table header from a camelCase or PascalCase string by inserting spaces before uppercase letters and capitalizing the first letter of the resulting string.
 * @param name the name to create a table header from.
 * @returns the generated table header.
 */
export function createTableHeader(name: string): string {
  if (['id'].includes(name.toLowerCase())) {
    return name.toUpperCase();
  }

  for (let i = 1; i < name.length; i++) {
    if (name.charAt(i).toUpperCase() === name.charAt(i)) {
      name = name.slice(0, i) + ' ' + name.slice(i);
      i++;
    }
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Checks a list of objects for duplicates based on the 'name' property and returns a message indicating the indices where duplicates are found, or null if no duplicates exist.
 * @param list the list of objects to check for duplicates.
 * @param item the item to check for duplicates against the list.
 * @param index the index of the item in the list.
 * @returns a message indicating the indices where duplicates are found, or null if no duplicates exist.
 */
export function checkForDuplicates<T extends {name: string;}>(list: T[], item: T, index: number): string | null {
  const duplicates = list
    .map((data, i) => ({data, index: i}))
    .filter((entry, i) => entry.data.name.trim() !== '' && i !== index && entry.data.name === item.name);

  if (duplicates.length === 0) {
    return null;
  }

  return `The list already contains the name "${item.name}" at row(s): ${duplicates.map((d) => d.index + 1).join(', ')}`;
}
