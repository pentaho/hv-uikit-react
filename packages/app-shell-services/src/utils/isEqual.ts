/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
/**
 * Performs a deep equality comparison between two values.
 *
 * This function recursively compares two values for deep equality, handling
 * primitives, arrays, and plain objects.
 *
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @returns `true` if the values are deeply equal, `false` otherwise
 *
 * @remarks
 * The function handles the following data types and scenarios:
 *
 * **Primitives**: Numbers, strings, booleans are compared using strict equality (===)
 *
 * **Null/Undefined**:
 * - `null` equals `null`
 * - `undefined` equals `undefined`
 * - `null` does not equal `undefined`
 * - Both are considered different from any other value
 *
 * **Arrays**:
 * - Must have the same length
 * - Elements are compared recursively in order
 * - Nested arrays are fully supported
 * - Arrays are not considered equal to objects, even if they have similar structure
 *
 * **Objects**:
 * - Must have the same number of enumerable properties
 * - Property names are compared (key order doesn't matter)
 * - Property values are compared recursively
 * - Only enumerable own properties are considered (uses `Object.keys()`)
 * - Nested objects are fully supported
 *
 * **Special Cases**:
 * - `NaN` does not equal `NaN` (follows JavaScript's NaN behavior)
 * - `Infinity` equals `Infinity`
 * - `-Infinity` equals `-Infinity`
 * - Functions, Dates, RegExp, and other complex objects are not specially handled
 * - Circular references are not detected and will cause infinite recursion
 *
 * **Type Safety**:
 * - Uses TypeScript's `unknown` type for maximum type safety
 * - Performs runtime type checking before operations
 * - Uses type assertions only where necessary with proper type guards
 *
 * @example
 * ```typescript
 * // Primitives
 * isEqual(1, 1)           // true
 * isEqual("hello", "hello") // true
 * isEqual(1, "1")         // false
 *
 * // Arrays
 * isEqual([1, 2, 3], [1, 2, 3])     // true
 * isEqual([1, [2, 3]], [1, [2, 3]]) // true
 * isEqual([1, 2], [1, 2, 3])        // false
 *
 * // Objects
 * isEqual({a: 1, b: 2}, {b: 2, a: 1})     // true (order doesn't matter)
 * isEqual({a: {b: 1}}, {a: {b: 1}})       // true (nested objects)
 * isEqual({a: 1}, {a: 2})                 // false
 *
 * // Mixed types
 * isEqual({arr: [1, 2]}, {arr: [1, 2]})   // true
 * isEqual([{a: 1}], [{a: 1}])             // true
 *
 * // Edge cases
 * isEqual(null, null)           // true
 * isEqual(undefined, undefined) // true
 * isEqual(null, undefined)      // false
 * isEqual(NaN, NaN)            // false
 * ```
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (
    a == null ||
    b == null ||
    typeof a !== typeof b ||
    typeof a !== "object" ||
    Array.isArray(a) !== Array.isArray(b)
  ) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => isEqual(item, b[index]));
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) =>
    isEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key],
    ),
  );
}
