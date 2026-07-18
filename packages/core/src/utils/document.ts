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
export function getDocument() {
  return typeof window !== "undefined" ? document : undefined;
}

/** Wrapper around `document.getElementById` */
export function getElementById(elementId?: string) {
  return (elementId && getDocument()?.getElementById(elementId)) || undefined;
}

/** Get a container element by id, falling back to document-body */
export function getContainerElement(elementId?: string) {
  return getElementById(elementId) || getDocument()?.body;
}
