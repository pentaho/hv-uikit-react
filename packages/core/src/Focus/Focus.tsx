import { cloneElement, useRef, useState } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvBaseProps } from "../types/generic";
import { isKey, isOneOfKeys } from "../utils/keyboardUtils";
import { staticClasses, useClasses } from "./Focus.styles";
import { getFocusableChildren, isBrowser, setFocusTo } from "./utils";

export { staticClasses as focusClasses };
export type HvFocusClasses = ExtractNames<typeof useClasses>;

export type HvFocusStrategies = "listbox" | "menu" | "card" | "grid";

export interface HvFocusProps extends HvBaseProps<HTMLElement, "children"> {
  children: React.ReactElement<any>;
  /** Extra configuration for the child element. */
  configuration?: {
    tabIndex?: number;
  };
  /** Indicates that the disabled class should be applied. */
  disabledClass?: boolean;
  /** Whether the focus is selected. */
  selected?: boolean;
  /** Whether the focus is disabled. */
  disabled?: boolean;
  /** The reference to the root element to hold all Focus' context. */
  rootRef?: React.RefObject<HTMLElement | null>;
  /** Show focus when click element. v */
  focusOnClick?: boolean;
  /** Show focus when click element. v */
  focusDisabled?: boolean;
  /** Focus and navigation strategy to be used. v */
  strategy?: HvFocusStrategies;
  /** Uses an absolute positioned div as a focus. v */
  useFalseFocus?: boolean;
  /** Narrows the results of the focus to only theses class v */
  filterClass?: string;
  /** How much the navigation will skip when using the arrows. v */
  navigationJump?: number;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFocusClasses;
}

interface Focuses {
  first: Element;
  last: Element;
  previous: Element | undefined;
  current: Element | undefined;
  next: Element | undefined;
  fall: Element | undefined;
  jump: Element | undefined;
}

/** @deprecated internal use only. this component has navigation issues. */
export const HvFocus = ({
  classes: classesProp,
  children,
  configuration = {},
  disabledClass = false,
  selected = false,
  disabled = false,
  rootRef = undefined,
  focusOnClick = false,
  focusDisabled = true,
  strategy = "listbox",
  filterClass,
  navigationJump = 4,
}: HvFocusProps) => {
  const [childFocus, setChildFocus] = useState<any>();
  const [hasRunConfig, setHasRunConfig] = useState(false);
  const { classes, cx } = useClasses(classesProp);

  const hasFocusVisible = useRef(false);

  const getFocuses = () => {
    const focuses = rootRef?.current
      ? Array.from(
          rootRef.current.getElementsByClassName(
            filterClass || staticClasses.root || "root",
          ),
        )
      : [];
    return focuses;
  };

  const setTabIndex = (el: any, tabIndex = 0) => {
    if (!el) return;
    const elChildFocus = getFocusableChildren(el)[0];
    if (elChildFocus) {
      el.tabIndex = -1;
      elChildFocus.tabIndex = tabIndex;
    } else {
      el.tabIndex = tabIndex;
    }
  };

  const setSelectedTabIndex = () => {
    const focuses = getFocuses();
    const firstSelected = focuses.find((focus) =>
      focus.classList.contains(classes.selected || "selected"),
    );

    if (!firstSelected) return;
    focuses.forEach((focus) => setTabIndex(focus, -1));
    setTabIndex(firstSelected, 0);
  };

  const clearTabSiblings = (el: any) => {
    getFocuses().forEach((focus) => setTabIndex(focus, -1));
    setTabIndex(el, 0);
  };

  const onFocusStrategy = (evt: any) => {
    if (strategy === "listbox") {
      clearTabSiblings(evt.currentTarget);
    }
  };

  const onBlurStrategy = () => {
    if (
      strategy === "listbox" &&
      rootRef &&
      rootRef.current &&
      !rootRef.current.contains(document.activeElement)
    ) {
      setTimeout(() => {
        setSelectedTabIndex();
      }, 10);
    }
  };

  const config = (el: any) => {
    const { tabIndex } = configuration;
    if (!el || hasRunConfig) return;
    if (strategy === "card") {
      setChildFocus(children);
      return;
    }

    if (strategy === "grid") {
      return;
    }

    const focusableChildren = getFocusableChildren(el);
    if (focusableChildren.length) {
      focusableChildren.forEach((child: any) => setTabIndex(child, -1));
      setChildFocus(focusableChildren[0]);
    }

    if (tabIndex != null) setTabIndex(el, tabIndex);
    setHasRunConfig(true);
  };

  const addFocusClass = (evt: any) => {
    if (focusOnClick) {
      classes.focused
        .split(" ")
        .forEach((c) => evt.currentTarget.classList.add(c));
    } else {
      classes.focusedVisible
        .split(" ")
        .forEach((c) => evt.currentTarget.classList.add(c));
    }

    // add global class HvIsFocused as a marker
    // not to be styled directly, only as helper in specific css queries
    evt.currentTarget.classList.add("HvIsFocused");
    classes?.focus
      ?.split(" ")
      .forEach((c) => evt.currentTarget.classList.add(c));
  };

  const removeFocusClass = () => {
    getFocuses().forEach((element) => {
      classes.focused.split(" ").forEach((c) => element.classList.remove(c));
      classes.focusedVisible
        .split(" ")
        .forEach((c) => element.classList.remove(c));
      // remove the global class HvIsFocused
      element.classList.remove("HvIsFocused");
      classes?.focus?.split(" ").forEach((c) => element.classList.remove(c));
    });
  };

  const onFocus = (evt: any) => {
    // check if the focus came from keyboard navigation (i.e. the focus is visible)
    hasFocusVisible.current = evt.currentTarget.matches(":focus-visible");

    addFocusClass(evt);
    // give focus to child element if any focusable

    childFocus?.focus?.();
    onFocusStrategy(evt);
  };

  const onBlur = () => {
    removeFocusClass();
    onBlurStrategy();
  };

  const onMouseDown = (evt: any) => {
    const hasCard = !!evt.currentTarget?.querySelector(".HvIsCardGridElement");
    if (strategy === "grid" && hasCard) return;

    setFocusTo(evt.currentTarget);
    setTabIndex(evt.currentTarget, 0);
  };

  const focusAndUpdateIndex = (
    nextFocus: Element,
    previousFocus: any,
    focusesList: Element[],
  ) => {
    if (focusesList?.includes(previousFocus)) {
      setTabIndex(previousFocus, -1);
    }
    setTabIndex(nextFocus, 0);
    setFocusTo(nextFocus);
  };

  const getEnabledKeys = (
    currentFocusIndex: number,
    jump: number,
    listSize: number,
  ) => ({
    right:
      (currentFocusIndex + 1) % jump === 0 ||
      currentFocusIndex + 1 > listSize - 1,
    left: currentFocusIndex % jump === 0,
    up: currentFocusIndex - jump < 0,
    down:
      currentFocusIndex + jump > listSize ||
      currentFocusIndex + jump > listSize - 1,
  });

  const onGridKeyDownHandler = (
    evt: any,
    focuses: Focuses,
    focusesList: Element[],
    currentFocusIndex: number,
    jump: number,
  ) => {
    const childFocusIsInput = childFocus && childFocus.nodeName === "INPUT";

    if (
      !isOneOfKeys(evt, [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "Space",
        "Enter",
      ]) ||
      (childFocusIsInput && isKey(evt, "Enter"))
    ) {
      // nothing to do
      return;
    }

    // we'll do something with the key so prevent default and stop propagation
    // except for Enter and SpaceBar
    if (!isOneOfKeys(evt, ["Enter", "Space"])) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    // if the focus is not visible, first key press should just make it visible and potentially not move the focus
    if (!hasFocusVisible.current) {
      // keyboard was definitely used, so mark the focus as visible so that next keys move the focus
      hasFocusVisible.current = true;

      // if user pressed Enter and Space, just make the focus visible and return
      // otherwise it would trigger a click on an expected item
      if (evt.code === "Space" || evt.code === "Enter") {
        focusAndUpdateIndex(
          focuses.current || focuses.first,
          evt.current,
          focusesList,
        );

        return;
      }

      if (focuses.current === focuses.first) {
        // clear focuses.previous, focuses.next, focuses.jump and focuses.fall
        // so that pressing ArrowUp goes to the last item,
        // and ArrowDown just makes the focus visible on the first item
        focuses.previous = undefined;
        focuses.next = undefined;
        focuses.jump = undefined;
        focuses.fall = undefined;
      }

      // let if fall through to the regular logic
    }

    const blockedKeys = getEnabledKeys(
      currentFocusIndex,
      jump,
      focusesList.length,
    );

    switch (evt.code) {
      case "Space":
      case "Enter":
        if (isBrowser("firefox")) {
          evt.target.click();
        } else {
          evt.currentTarget.click();
        }
        break;
      case "ArrowUp":
        if (!blockedKeys.up) {
          focusAndUpdateIndex(
            focuses.jump || focuses.last,
            evt.current,
            focusesList,
          );
        }
        break;
      case "ArrowDown":
        if (!blockedKeys.down) {
          focusAndUpdateIndex(
            focuses.fall || focuses.first,
            evt.current,
            focusesList,
          );
        }
        break;
      case "ArrowLeft":
        if (!blockedKeys.left) {
          focusAndUpdateIndex(
            focuses.previous || focuses.last,
            evt.current,
            focusesList,
          );
        }
        break;
      case "ArrowRight":
        if (!blockedKeys.right) {
          focusAndUpdateIndex(
            focuses.next || focuses.first,
            evt.current,
            focusesList,
          );
        }
        break;
      case "Home":
        focusAndUpdateIndex(focuses.first, evt.current, focusesList);
        break;
      case "End":
        focusAndUpdateIndex(focuses.last, evt.current, focusesList);
        break;
      default:
    }
  };

  const onVerticalArrangementHandler = (
    evt: any,
    focuses: Focuses,
    focusesList: Element[],
  ) => {
    const childFocusIsInput = childFocus && childFocus.nodeName === "INPUT";

    if (
      !isOneOfKeys(evt, [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Space",
        "Enter",
      ]) ||
      (childFocusIsInput && isKey(evt, "Enter"))
    ) {
      // nothing to do
      return;
    }

    // we'll do something with the key so prevent default and stop propagation
    evt.preventDefault();
    evt.stopPropagation();

    // if the focus is not visible, first key press should just make it visible and potentially not move the focus
    if (!hasFocusVisible.current) {
      // keyboard was definitely used, so mark the focus as visible so that next keys move the focus
      hasFocusVisible.current = true;

      // if user pressed Enter and Space, just make the focus visible and return
      // otherwise it would trigger a click on an expected item
      if (evt.code === "Space" || evt.code === "Enter") {
        focusAndUpdateIndex(
          focuses.current || focuses.first,
          evt.current,
          focusesList,
        );

        return;
      }

      if (focuses.current === focuses.first) {
        // clear focuses.previous and focuses.next
        // so that pressing ArrowUp goes to the last item,
        // and ArrowDown just makes the focus visible on the first item
        focuses.previous = undefined;
        focuses.next = undefined;
      }

      // let if fall through to the regular logic
    }

    switch (evt.code) {
      case "Space":
      case "Enter":
        evt.target.click();
        break;
      case "ArrowUp":
        focusAndUpdateIndex(
          focuses.previous || focuses.last,
          evt.current,
          focusesList,
        );
        break;
      case "ArrowDown":
        focusAndUpdateIndex(
          focuses.next || focuses.first,
          evt.current,
          focusesList,
        );
        break;
      case "Home":
        focusAndUpdateIndex(focuses.first, evt.current, focusesList);
        break;
      case "End":
        focusAndUpdateIndex(focuses.last, evt.current, focusesList);
        break;
      default:
    }
  };

  const onSingleHandler = (evt: any) => {
    const childFocusIsInput = childFocus && childFocus.nodeName === "INPUT";

    if (
      !isOneOfKeys(evt, ["Space", "Enter"]) ||
      (childFocusIsInput && isKey(evt, "Enter"))
    ) {
      // nothing to do
      return;
    }

    // we'll do something with the key so prevent default and stop propagation
    evt.preventDefault();
    evt.stopPropagation();

    evt.currentTarget.click();
  };

  const onKeyDown = (evt: any) => {
    if (rootRef?.current == null) {
      // operating outside of a composite widget
      // nothing to manage, just style and trigger clicks
      onSingleHandler(evt);
      return;
    }

    // TODO keep the smart default, but allow to explicitly override if disabled elements should be focusable
    const isDisabledFocusable = strategy === "menu";
    const focusesList = getFocuses().filter(
      (el) =>
        isDisabledFocusable ||
        !el.classList.contains(classes?.disabled as string),
    );

    const currentFocus = focusesList.indexOf(evt.currentTarget);

    const focuses: Focuses = {
      first: focusesList[0],
      last: focusesList[focusesList.length - 1],
      previous: focusesList[currentFocus - 1],
      current: focusesList[currentFocus],
      next: focusesList[currentFocus + 1],
      fall: focusesList[currentFocus + navigationJump],
      jump: focusesList[currentFocus - navigationJump],
    };

    if (strategy === "grid") {
      onGridKeyDownHandler(
        evt,
        focuses,
        focusesList,
        currentFocus,
        navigationJump,
      );
      return;
    }

    // TODO add property for specifying the composite widget orientation
    // TODO implement handler for horizontal orientation
    onVerticalArrangementHandler(evt, focuses, focusesList);
  };

  const onKeyUp = (evt: any) => {
    if (isBrowser("firefox")) evt.preventDefault();
  };

  if (disabled) return children;

  return cloneElement(children, {
    className: cx(
      [classes.root, filterClass],
      {
        [classes.selected]: selected,
        [classes.disabled]: disabledClass,
        [classes.focusDisabled]: focusDisabled,
      },
      children.props.className,
    ),
    ref: config,
    onFocus,
    onBlur,
    onMouseDown,
    onKeyDown,
    onKeyUp,
    selected,
  });
};
