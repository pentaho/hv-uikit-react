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
import { describe, expect, it } from "vitest";

import { isEqual } from "../isEqual";

describe("isEqual", () => {
  describe("primitive values", () => {
    it("should return true for identical primitives", () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual("hello", "hello")).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
    });

    it("should return false for different primitives", () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual("hello", "world")).toBe(false);
      expect(isEqual(true, false)).toBe(false);
    });

    it("should return false for different types", () => {
      expect(isEqual(1, "1")).toBe(false);
      expect(isEqual(true, 1)).toBe(false);
      expect(isEqual(0, false)).toBe(false);
      expect(isEqual("", false)).toBe(false);
    });
  });

  describe("null and undefined", () => {
    it("should handle null values", () => {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(null, 0)).toBe(false);
      expect(isEqual(null, "")).toBe(false);
      expect(isEqual(null, {})).toBe(false);
    });

    it("should handle undefined values", () => {
      expect(isEqual(undefined, undefined)).toBe(true);
      expect(isEqual(undefined, null)).toBe(false);
      expect(isEqual(undefined, 0)).toBe(false);
      expect(isEqual(undefined, "")).toBe(false);
      expect(isEqual(undefined, {})).toBe(false);
    });
  });

  describe("arrays", () => {
    it("should return true for identical arrays", () => {
      expect(isEqual([], [])).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual(["a", "b"], ["a", "b"])).toBe(true);
    });

    it("should return false for arrays with different lengths", () => {
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(isEqual([1], [])).toBe(false);
    });

    it("should return false for arrays with different elements", () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual(["a", "b"], ["a", "c"])).toBe(false);
    });

    it("should handle nested arrays", () => {
      expect(
        isEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 4],
          ],
        ),
      ).toBe(true);
      expect(
        isEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 5],
          ],
        ),
      ).toBe(false);
      expect(isEqual([[[1]]], [[[1]]])).toBe(true);
      expect(isEqual([[[1]]], [[[2]]])).toBe(false);
    });

    it("should return false when comparing array to non-array", () => {
      expect(isEqual([1, 2, 3], { 0: 1, 1: 2, 2: 3 })).toBe(false);
      expect(isEqual([], {})).toBe(false);
    });
  });

  describe("objects", () => {
    it("should return true for identical objects", () => {
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    });

    it("should return false for objects with different keys", () => {
      expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
      expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
      expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("should return false for objects with different values", () => {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    });

    it("should handle nested objects", () => {
      expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
      expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(
        true,
      );
      expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(
        false,
      );
    });

    it("should return false when comparing object to non-object", () => {
      expect(isEqual({ a: 1 }, [1])).toBe(false);
      expect(isEqual({}, null)).toBe(false);
      expect(isEqual({}, undefined)).toBe(false);
    });
  });

  describe("mixed data types", () => {
    it("should handle objects with arrays", () => {
      expect(isEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
      expect(isEqual({ a: [1, 2] }, { a: [1, 3] })).toBe(false);
    });

    it("should handle arrays with objects", () => {
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBe(false);
    });

    it("should handle complex nested structures", () => {
      const obj1 = {
        a: 1,
        b: [2, 3, { c: 4 }],
        d: { e: [5, 6] },
      };
      const obj2 = {
        a: 1,
        b: [2, 3, { c: 4 }],
        d: { e: [5, 6] },
      };
      const obj3 = {
        a: 1,
        b: [2, 3, { c: 5 }],
        d: { e: [5, 6] },
      };

      expect(isEqual(obj1, obj2)).toBe(true);
      expect(isEqual(obj1, obj3)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty values", () => {
      expect(isEqual("", "")).toBe(true);
      expect(isEqual(0, 0)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
    });

    it("should handle special numbers", () => {
      expect(isEqual(Number.NaN, Number.NaN)).toBe(false);
      expect(isEqual(Infinity, Infinity)).toBe(true);
      expect(isEqual(-Infinity, -Infinity)).toBe(true);
      expect(isEqual(Infinity, -Infinity)).toBe(false);
    });

    it("should handle objects with undefined values", () => {
      expect(isEqual({ a: undefined }, { a: undefined })).toBe(true);
      expect(isEqual({ a: undefined }, { a: null })).toBe(false);
      expect(isEqual({ a: undefined }, {})).toBe(false);
    });

    it("should handle objects with null values", () => {
      expect(isEqual({ a: null }, { a: null })).toBe(true);
      expect(isEqual({ a: null }, { a: undefined })).toBe(false);
      expect(isEqual({ a: null }, {})).toBe(false);
    });
  });

  describe("performance considerations", () => {
    it("should handle reasonably large objects", () => {
      const createLargeObject = (size: number) => {
        const obj: Record<string, number> = {};
        for (let i = 0; i < size; i++) {
          obj[`key${i}`] = i;
        }
        return obj;
      };

      const obj1 = createLargeObject(100);
      const obj2 = createLargeObject(100);
      const obj3 = { ...createLargeObject(100), key50: 999 };

      expect(isEqual(obj1, obj2)).toBe(true);
      expect(isEqual(obj1, obj3)).toBe(false);
    });

    it("should handle reasonably large arrays", () => {
      const arr1 = Array.from({ length: 100 }, (_, i) => i);
      const arr2 = Array.from({ length: 100 }, (_, i) => i);
      const arr3 = Array.from({ length: 100 }, (_, i) => (i === 50 ? 999 : i));

      expect(isEqual(arr1, arr2)).toBe(true);
      expect(isEqual(arr1, arr3)).toBe(false);
    });
  });
});
