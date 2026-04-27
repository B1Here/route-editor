import Encoding from "encoding-japanese";
import {isDefined} from "@utils/utils.svelte";

/**
 * Returns a CSV string representation of the given array of objects.
 * @param objects the array of objects to convert.
 * @param omittedColumns an optional record of column keys to omit from the CSV output if the value of a key is true.
 * @returns the CSV string representation.
 */
export function arrayToCsv<T extends object>(objects: Array<T>, omittedColumns?: Array<keyof T>): string {
  return objects.map((obj) => Object.keys(obj).map((key) => {
    const value = obj[key as keyof T];
    if (!isDefined(value) || (omittedColumns?.includes(key as keyof T))) {
      return '';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return '';
      }

      if (value.length === 1) {
        return String(value[0]);
      }

      return `"${value.join(',')}"`;
    }

    if (typeof value === 'string' && (value.includes(','))) {
      return `"${value.replace(/"/g, '')}"`;
    }

    return String(value);
  }).join(',')).join('\r\n') + '\r\n';
}

export function toSjisBase64String(data: string): string {
  const sjisArray = Encoding.convert(data, {from: 'UNICODE', to: 'SJIS', type: 'array'});
  return Encoding.base64Encode(sjisArray);
}

export function toUnicode(data: Uint8Array): string {
  const unicodeArray = Encoding.convert(data, {from: 'SJIS', to: 'UNICODE'});
  return Encoding.codeToString(unicodeArray);
}

function handleCsvError(message: string, line: number): never {
  throw new Error(`Error at line ${line}: ${message}`);
}

/**
 * Splits a CSV string into an array of strings, taking quoted commas into account (arrays in a column).
 * @param str the CSV string to split.
 * @param line the line number of the CSV string, used for error reporting.
 * @param expectedLength the expected number of columns in the CSV string.
 * @returns an array of strings representing the split CSV values. Arrays will be preserved as comma-separated strings but without their quotes.
 */
export function csvSplit<T extends string>(str: string, line: number, expectedLength?: number): T[] {
  let quoteActive = false;
  let currStr = '';
  const result: T[] = [];

  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === '"' && i - 1 >= 0 && str.charAt(i - 1) !== '\\') {
      quoteActive = !quoteActive;
    }

    if (str.charAt(i) === ',' && !quoteActive) {
      result.push(currStr as T);
      currStr = '';
    }

    if (![',', '"'].includes(str.charAt(i)) || (quoteActive && str.charAt(i) === ',')) {
      currStr += str.charAt(i);
    }

    if (i === str.length - 1) {
      if (quoteActive) {
        handleCsvError('unterminated quote detected.', line);
      }
      result.push(currStr as T);
    }
  }

  if (isDefined(expectedLength) && result.length !== expectedLength) {
    handleCsvError(`an incorrect number of columns was read. Expected ${expectedLength} but got ${result.length}.`, line);
  }

  return result;
}
