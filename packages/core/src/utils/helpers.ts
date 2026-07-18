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
export const uniqueId = (prefix = "") => {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
};

export const range = (length: number, start = 0) => {
  return Array.from({ length: length - start }, (_, i) => i + start);
};

export const capitalize = <T extends string>(string: T) => {
  return (string.charAt(0).toUpperCase() + string.slice(1)) as Capitalize<T>;
};

export function isEqual(obj1: unknown, obj2: unknown) {
  if (!obj1 || !obj2 || typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (
      !isEqual(obj1[key as keyof typeof obj1], obj2[key as keyof typeof obj2])
    )
      return false;
  }

  return true;
}
