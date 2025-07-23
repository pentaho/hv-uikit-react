import type { HvScrollToOption } from "../hooks/useScrollTo";

type ExtendedWindow = Window & typeof globalThis & HTMLElement;

export const getScrollTop = (
  c: HTMLElement | (Window & typeof globalThis) | null = window,
) => {
  if (c === null) {
    return 0;
  }

  if (c === window) {
    return (
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement?.scrollTop ||
      document.body.scrollTop
    );
  }

  return (c as ExtendedWindow).scrollTop;
};

export const verticalScrollOffset = (
  t: HTMLElement | (Window & typeof globalThis),
  c: HTMLElement | (Window & typeof globalThis) = window,
) => {
  if (c === window) {
    return (
      ((t as ExtendedWindow)?.getBoundingClientRect?.().top || 0) +
      (window.scrollY || window.pageYOffset)
    );
  }
  if (getComputedStyle(c as ExtendedWindow).position !== "static") {
    return (t as ExtendedWindow).offsetTop;
  }

  return (t as ExtendedWindow).offsetTop - (c as ExtendedWindow).offsetTop;
};

export const horizontalScrollOffset = (
  t: HTMLElement,
  c: HTMLElement | (Window & typeof globalThis) = window,
) => {
  if (c === window) {
    return (
      (t?.getBoundingClientRect?.().left || 0) +
      (window.scrollX || window.pageXOffset)
    );
  }
  if (getComputedStyle(c as ExtendedWindow).position !== "static") {
    return t.offsetLeft;
  }

  return t.offsetLeft - (c as ExtendedWindow).offsetLeft;
};

export const scrollElement = (
  element: HTMLElement,
  container: HTMLElement | (Window & typeof globalThis) | null,
  offset = 0,
  direction?: "row" | "column",
) => {
  if (container === null) {
    return;
  }

  if (direction === "row") {
    const elemLeft = horizontalScrollOffset(element, container);
    container?.scrollTo?.({
      left: elemLeft - offset,
      behavior: "smooth",
    });
  } else {
    const elemTop = verticalScrollOffset(element, container);
    container?.scrollTo?.({
      top: elemTop - offset,
      behavior: "smooth",
    });
  }
  element.focus({ preventScroll: true });
};

export const isScrolledToTheBottom = (
  container: HTMLElement | (Window & typeof globalThis) | null,
) => {
  if (container === null) {
    return false;
  }

  const containerScrollTop = getScrollTop(container);

  if (container === window) {
    // Accounting for cases where html/body are set to height:100%
    const scrollHeight =
      document.documentElement?.scrollHeight || document.body.scrollHeight;

    return containerScrollTop + window.innerHeight >= scrollHeight;
  }

  return (
    containerScrollTop + (container as ExtendedWindow).offsetHeight >=
    (container as ExtendedWindow).scrollHeight
  );
};

export const findFirstVisibleElement = (
  container: HTMLElement | (Window & typeof globalThis) | null,
  options: HvScrollToOption[],
  offset: number,
) => {
  if (container === null) {
    return -1;
  }
  const boundsTop = verticalScrollOffset(container);

  let i = 0;

  // Find index of first element whose top is still visible inside the container
  for (; i < options.length; i += 1) {
    const ele = document.getElementById(options[i].value);

    if (ele) {
      const elemTop = verticalScrollOffset(ele) - (options[i].offset || offset);

      if (elemTop > boundsTop) {
        break;
      }
    }
  }

  // Return the previous index, the element that last scrolled past the top
  return i - 1;
};
