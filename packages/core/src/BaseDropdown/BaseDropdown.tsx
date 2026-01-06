import {
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { PopperProps, usePopper } from "react-popper";
import type { ClickAwayListenerProps } from "@mui/material/ClickAwayListener";
import { useForkRef } from "@mui/material/utils";
import { detectOverflow, Options, Placement } from "@popperjs/core";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { useControlled } from "../hooks/useControlled";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvIcon } from "../icons";
import { HvBaseProps } from "../types/generic";
import { HvTypography } from "../Typography";
import { getFirstAndLastFocus } from "../utils/focusableElementFinder";
import { isKey, isOneOfKeys } from "../utils/keyboardUtils";
import { staticClasses, useClasses } from "./BaseDropdown.styles";
import { BaseDropdownPanel } from "./BaseDropdownPanel";
import { BaseDropdownContext, useBaseDropdownContext } from "./context";

export { staticClasses as baseDropdownClasses };

export type HvBaseDropdownClasses = ExtractNames<typeof useClasses>;

export interface HvBaseDropdownProps
  extends HvBaseProps<HTMLDivElement, "onToggle"> {
  /**
   * The role of the element that triggers the popup.
   *
   * Defaults to "combobox" if `component` and the default
   * "textbox" header is used, undefined otherwise.
   */
  role?: string;
  /**
   * Header placeholder.
   */
  placeholder?: React.ReactNode;
  /**
   * If `true` the dropdown is disabled unable to be interacted, if `false` it is enabled.
   */
  disabled?: boolean;
  /**
   * If `true` the dropdown will be in read only mode, unable to be interacted.
   */
  readOnly?: boolean;
  /**
   * Indicates that user input is required on the form element.
   */
  required?: boolean;
  /**
   * Disable the portal behavior.
   * The children stay within it's parent DOM hierarchy.
   */
  disablePortal?: boolean;
  /**
   * If `true` the dropdown width depends size of content if `false` the width depends on the header size.
   * Defaults to `false`.
   */
  variableWidth?: boolean;
  /**
   * If `true` the dropdown starts opened if `false` it starts closed.
   */
  expanded?: boolean;
  /**
   * When uncontrolled, defines the initial expanded state.
   */
  defaultExpanded?: boolean;
  /**
   * An object containing props to be wired to the popper component.
   */
  popperProps?: Partial<PopperProps<any>>;
  /**
   * Placement of the dropdown.
   */
  placement?: "left" | "right";
  /**
   * Replacement for the header component.
   * @deprecated use `headerComponent` instead
   */
  component?: React.ReactNode;
  /** Replacement for the header component */
  headerComponent?: React.ElementType;
  /**
   * Adornment to replace the default arrows.
   */
  adornment?: React.ReactNode;
  /**
   * When dropdown changes the expanded state.
   */
  onToggle?: (event: Event, open: boolean) => void;
  /**
   * When user click outside the open container.
   */
  onClickOutside?: (event: Event) => void;
  /**
   * Callback called when the dropdown is opened and ready,
   * commonly used to set focus to the content.
   */
  onContainerCreation?: (container: HTMLElement | null) => void;
  /**
   * Attributes applied to the dropdown header element.
   */
  dropdownHeaderProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
  /**
   * Pass a ref to the dropdown header element.
   */
  dropdownHeaderRef?: React.Ref<HTMLDivElement>;
  /**
   * A Jss Object used to override or extend the component styles applied.
   */
  classes?: HvBaseDropdownClasses;
  /** @ignore */
  ref?: React.Ref<HTMLDivElement>;
}

const BaseDropdown = forwardRef<
  HTMLDivElement,
  Omit<
    HvBaseDropdownProps,
    "popperProps" | "variableWidth" | "placement" | "onContainerCreation"
  >
>(function BaseDropdown(props, ref) {
  const {
    id: idProp,
    className,
    classes: classesProp,
    children,
    role,
    placeholder,
    component,
    headerComponent: HeaderComponentProp,
    adornment,
    expanded,
    dropdownHeaderProps,
    defaultExpanded,
    disabled,
    readOnly,
    required,
    disablePortal,
    "aria-expanded": ariaExpandedProp,
    "aria-label": ariaLabelProp,
    "aria-labelledby": ariaLabelledByProp,
    dropdownHeaderRef: dropdownHeaderRefProp,
    onToggle,
    onClickOutside,
    ...others
  } = props;

  const { classes, cx } = useClasses(classesProp);

  const {
    popperPlacement,
    popperElement,
    referenceElement,
    setReferenceElement,
  } = useBaseDropdownContext();

  const [isOpen, setIsOpen] = useControlled(expanded, Boolean(defaultExpanded));

  const headerRef = useForkRef(
    setReferenceElement,
    dropdownHeaderRefProp,
    dropdownHeaderProps?.ref as any,
  );

  const customHeaderRef = useForkRef(ref, headerRef);

  const ariaRole = role || (component == null ? "combobox" : undefined);

  const ariaExpanded = ariaExpandedProp ?? (ariaRole ? !!isOpen : undefined);

  const id = useUniqueId(idProp);
  const containerId = useId();

  const headerControlArias = {
    "aria-required": required ?? undefined,
    "aria-readonly": readOnly ?? undefined,
    "aria-disabled": disabled ?? undefined,

    "aria-expanded": ariaExpanded,
    "aria-owns": isOpen ? containerId : undefined,
    "aria-controls": isOpen ? containerId : undefined,
  } satisfies React.AriaAttributes;

  const headerAriaLabels = {
    "aria-label": ariaLabelProp,
    "aria-labelledby": ariaLabelledByProp,
  } satisfies React.AriaAttributes;

  const handleToggle = useCallback(
    (event: any) => {
      if (event && !isKey(event, "Tab")) {
        event.preventDefault();
      }

      const notControlKey =
        !!event?.code &&
        !isOneOfKeys(event, ["Tab", "Enter", "Esc", "ArrowDown", "Space"]);

      const ignoredCombinations =
        (isKey(event, "Esc") && !isOpen) ||
        (isKey(event, "ArrowDown") && isOpen) ||
        (isKey(event, "Tab") && !isOpen);

      if (disabled || notControlKey || ignoredCombinations) return;

      const newOpen = !isOpen;

      /* If about to close focus on the header component. */
      setIsOpen(() => {
        if (!newOpen) {
          // Focus-ring won't be visible even if using the keyboard:
          // https://github.com/WICG/focus-visible/issues/88
          referenceElement?.focus({ preventScroll: true });
        }

        return newOpen;
      });

      onToggle?.(event, newOpen);
    },
    [isOpen, disabled, setIsOpen, onToggle, referenceElement],
  );

  const defaultHeaderElement = (
    <div
      data-popper-placement={popperPlacement}
      className={cx(classes.header, {
        [classes.headerOpen]: isOpen,
        [classes.headerReadOnly]: readOnly,
        [classes.headerDisabled]: disabled,
      })}
      // TODO: review "textbox" role
      role={ariaRole === "combobox" ? "textbox" : undefined}
      {...headerAriaLabels}
      style={disabled || readOnly ? { pointerEvents: "none" } : undefined}
      // Removes the element from the navigation sequence for keyboard focus if disabled
      tabIndex={disabled ? -1 : 0}
      ref={headerRef}
      {...dropdownHeaderProps}
    >
      <div
        className={cx(classes.selection, {
          [classes.selectionDisabled]: disabled,
        })}
      >
        {placeholder && typeof placeholder === "string" ? (
          <HvTypography noWrap className={classes.placeholder}>
            {placeholder}
          </HvTypography>
        ) : (
          placeholder
        )}
      </div>
      <div className={classes.arrowContainer}>
        {adornment || (
          <HvIcon
            name="CaretDown"
            size="xs"
            rotate={isOpen}
            className={classes.arrow}
          />
        )}
      </div>
    </div>
  );

  const headerElement =
    component && isValidElement(component)
      ? cloneElement(component as React.ReactElement, {
          ref: headerRef,
          ...headerControlArias,
        })
      : defaultHeaderElement;

  /** Handle keyboard inside children container. */
  const handleContainerKeyDown: React.KeyboardEventHandler = (event) => {
    if (isKey(event, "Esc")) {
      handleToggle(event);
    }
    if (isKey(event, "Tab") && !event.shiftKey) {
      const focusList = getFirstAndLastFocus(popperElement);
      if (document.activeElement === focusList?.last) {
        event.preventDefault();
        focusList?.first?.focus();
      }
    }
  };

  const handleOutside: ClickAwayListenerProps["onClickAway"] = (event) => {
    const isButtonClick = referenceElement?.contains(event.target as any);
    if (!isButtonClick) {
      onClickOutside?.(event);
      setIsOpen(false);
      onToggle?.(event, false);
    }
  };

  const hasCustomHeader = !!HeaderComponentProp;
  const HeaderComponent = HeaderComponentProp || "div";
  const RootComponent = HeaderComponentProp ? Fragment : "div";

  return (
    <RootComponent {...(!hasCustomHeader && { className: classes.root })}>
      <HeaderComponent
        ref={hasCustomHeader ? customHeaderRef : ref}
        id={id}
        disabled={hasCustomHeader && disabled}
        className={cx(className, {
          [classes.anchor]: !hasCustomHeader,
          [classes.rootDisabled]: disabled,
        })}
        {...(!readOnly && {
          onKeyDown: handleToggle,
          onClick: handleToggle,
        })}
        {...((ariaRole || hasCustomHeader) && {
          role: hasCustomHeader ? undefined : ariaRole,
          ...headerAriaLabels,
          ...headerControlArias,
        })}
        // Removes the element from the navigation sequence for keyboard focus
        tabIndex={hasCustomHeader ? undefined : -1}
        {...others}
      >
        {headerElement}
      </HeaderComponent>
      {isOpen && (
        <BaseDropdownPanel
          classes={classes}
          containerId={containerId}
          onClickAway={handleOutside}
          disablePortal={disablePortal}
          onContainerKeyDown={handleContainerKeyDown}
        >
          {children}
        </BaseDropdownPanel>
      )}
    </RootComponent>
  );
});

export const HvBaseDropdown = forwardRef<HTMLDivElement, HvBaseDropdownProps>(
  function HvBaseDropdown(props, ref) {
    const {
      popperProps = {},
      variableWidth,
      placement: placementProp = "right",
      onContainerCreation,
      ...others
    } = useDefaultProps("HvBaseDropdown", props);

    const placement: Placement = `bottom-${
      placementProp === "right" ? "start" : "end"
    }`;

    const { modifiers: popperPropsModifiers, ...otherPopperProps } =
      popperProps;

    const [referenceElement, setReferenceElement] =
      useState<HTMLElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(
      null,
    );

    const onFirstUpdate = useCallback(() => {
      onContainerCreation?.(popperElement);
    }, [onContainerCreation, popperElement]);

    const modifiers = useMemo<Options["modifiers"]>(
      () => [
        {
          name: "variableWidth",
          enabled: !variableWidth,
          phase: "beforeWrite",
          requires: ["computeStyles"],
          fn: ({ state }) => {
            state.styles.popper.width = `${state.rects.reference.width}px`;
          },
          effect: ({ state }) => {
            state.elements.popper.style.width = `${
              (state.elements.reference as any).offsetWidth
            }px`;
          },
        },
        {
          name: "maxSize",
          enabled: true,
          phase: "main",
          requiresIfExists: ["offset", "preventOverflow", "flip"],
          fn: ({ state, name, options }) => {
            const overflow = detectOverflow(state, options);

            const x = state.modifiersData.preventOverflow?.x || 0;
            const y = state.modifiersData.preventOverflow?.y || 0;

            const popperWidth = state.rects.popper.width;
            const popperHeight = state.rects.popper.height;

            const basePlacement = state.placement.split("-")[0];

            const widthProp = basePlacement === "left" ? "left" : "right";
            const heightProp = basePlacement === "top" ? "top" : "bottom";

            state.modifiersData[name] = {
              width: popperWidth - overflow[widthProp] - x,
              height: popperHeight - overflow[heightProp] - y,
            };
          },
        },
        {
          name: "applyMaxSize",
          enabled: true,
          phase: "beforeWrite",
          requires: ["maxSize"],
          fn: ({ state }) => {
            // The `maxSize` modifier provides this data
            const { width, height } = state.modifiersData.maxSize;
            state.styles.popper.maxWidth = `${width}px`;
            state.styles.popper.maxHeight = `${height}px`;
          },
        },
        ...(popperPropsModifiers || []),
      ],
      [popperPropsModifiers, variableWidth],
    );

    const popper = usePopper(referenceElement, popperElement, {
      placement,
      modifiers,
      onFirstUpdate,
      ...otherPopperProps,
    });

    const value = useMemo(
      () => ({
        popperPlacement:
          (popper?.attributes.popper?.["data-popper-placement"] as Placement) ??
          "bottom",
        popper,
        popperElement,
        setPopperElement,
        referenceElement,
        setReferenceElement,
      }),
      [popper, popperElement, referenceElement],
    );

    return (
      <BaseDropdownContext.Provider value={value}>
        <BaseDropdown ref={ref} {...others} />
      </BaseDropdownContext.Provider>
    );
  },
);
