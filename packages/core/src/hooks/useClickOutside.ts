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
import { useEffect } from "react";

export type HvClickOutsideEvent = MouseEvent | KeyboardEvent | TouchEvent;

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: HvClickOutsideEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: HvClickOutsideEvent) => {
      const el = ref?.current;
      const isKeyUp = event.type === "keyup";
      const isEscape = (event as KeyboardEvent).key === "Escape";

      if (!el || el.contains((event?.target as Node) || null)) {
        return {};
      }

      return isKeyUp ? (isEscape ? handler(event) : null) : handler(event);
    };

    document.addEventListener("click", listener);
    document.addEventListener("touchstart", listener);
    document.addEventListener("keyup", listener);

    return () => {
      document.removeEventListener("click", listener);
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("keyup", listener);
    };
  }, [ref, handler]);
};
