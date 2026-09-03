export const outlineStyles = {
  outline: "none", // remove the default outlines
  boxShadow: "0 0 0 1px #52A8EC, 0 0 0 4px rgba(29,155,209,.3)",
};

/** `outlineStyles` drawn inside the element, for containers that clip their overflow. */
export const insetOutlineStyles = {
  ...outlineStyles,
  boxShadow: "inset 0 0 0 1px #52A8EC, inset 0 0 0 4px rgba(29,155,209,.3)",
};
