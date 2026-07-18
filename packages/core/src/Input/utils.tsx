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
/** Changes a given `input`'s `value`, triggering its `onChange` */
export const changeInputValue = (
  input: HTMLInputElement | null,
  value = "",
) => {
  const event = new Event("input", { bubbles: true });

  /** Original `input.value` setter (React overrides it). */
  const setInputValue = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;

  setInputValue?.call(input, value);
  input?.dispatchEvent(event);
};
