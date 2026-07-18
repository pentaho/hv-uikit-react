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
import { createContext } from "react";

import type { HvFormStatus } from "./FormElement";

export interface HvFormElementContextValue {
  /** id to be applied to the form element root node. */
  id?: string;
  /**
   * Name of the form element.
   *
   * Part of a name/value pair, should be the name property of the underling native input.
   */
  name?: string;
  /**
   * The status of the form element.
   *
   * Valid is correct, invalid is incorrect and standBy means no validations have run.
   *
   * When uncontrolled and unspecified it will default to "standBy" and change to either "valid"
   * or "invalid" after any change to the state.
   */
  status?: HvFormStatus;
  /** Whether the form element is disabled. */
  disabled?: boolean;
  /** Indicates that user input is required on the form element. */
  required?: boolean;
  /** Indicates that the form element is not editable. */
  readOnly?: boolean;
}

export const HvFormElementContext = createContext<HvFormElementContextValue>(
  {},
);

export interface HvFormElementDescriptorsContextValue {
  input?: any;
  label?: any;
  descriptors?: any;
}

export const HvFormElementDescriptorsContext =
  createContext<HvFormElementDescriptorsContextValue>({});

export const HvFormElementValueContext = createContext<any>(undefined);
