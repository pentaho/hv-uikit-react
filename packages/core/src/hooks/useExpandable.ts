import { useCallback, useId } from "react";

import type { HvAccordionProps } from "../Accordion";
import { useControlled } from "./useControlled";

export interface UseExpandableParams
  extends Pick<HvAccordionProps, "disabled" | "expanded" | "defaultExpanded"> {}

/** expandable hook that handles a11y & open state for accordions, etc. */
export function useExpandable({
  disabled,
  expanded,
  defaultExpanded,
}: UseExpandableParams) {
  const [isOpen, setIsOpen] = useControlled(expanded, Boolean(defaultExpanded));
  const buttonId = useId();
  const regionId = useId();

  const toggleOpen = useCallback(
    (newOpen?: boolean) => setIsOpen((o) => newOpen ?? !o),
    [setIsOpen],
  );

  return {
    isOpen,
    toggleOpen,
    buttonProps: {
      id: buttonId,
      "aria-disabled": disabled,
      "aria-expanded": isOpen,
      "aria-controls": isOpen ? regionId : undefined,
    },
    regionProps: {
      id: regionId,
      role: "region",
      "aria-labelledby": buttonId,
    },
  };
}
