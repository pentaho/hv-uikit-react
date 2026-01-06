import { useRef, useState } from "react";
import {
  createClasses,
  ExtractNames,
  HvTypography,
  HvTypographyProps,
  isKey,
  theme,
  useControlled,
  useEnhancedEffect,
} from "@hitachivantara/uikit-react-core";
import { Edit } from "@hitachivantara/uikit-react-icons";

// TODO - Extract component in the future: when we have more specs and/or is used in other components

const { staticClasses, useClasses } = createClasses(
  "HvCanvasToolbarTabsEditor",
  {
    root: {
      position: "relative",
      display: "flex",
      width: "100%",
      overflow: "hidden",
      "&:has($label:hover:not($edit))": {
        color: theme.colors.textSubtle,
        "& $editIcon": { visibility: "visible" },
      },
    },
    edit: {
      color: theme.colors.textSubtle,
      borderColor: "currentColor",
      backgroundColor: theme.colors.bgContainer,
      cursor: "text",
    },
    label: {
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid transparent",
      borderRadius: theme.radii.base,
      padding: theme.spacing(0, "sm", 0, "xs"),
      textAlign: "start",
      whiteSpace: "nowrap",
      overflow: "hidden",
      outline: "none",
      "&:not($edit)": {
        textOverflow: "ellipsis",
      },
      "&:hover:not($edit)": {
        color: theme.colors.textSubtle,
        borderColor: theme.colors.bgHover,
        backgroundColor: theme.colors.bgHover,
      },
    },
    editIcon: {
      position: "absolute",
      right: theme.space.xxs,
      top: 4,
      width: 16,
      height: 16,
      visibility: "hidden",
      pointerEvents: "none",
    },
  },
);

export { staticClasses as toolbarTabEditorClasses };

type ToolbarTabEditorClasses = ExtractNames<typeof useClasses>;

interface ToolbarTabEditorProps
  extends Omit<HvTypographyProps, "classes" | "onBlur" | "onChange"> {
  /** The value of the component. When used, the component has to be controlled. */
  value?: string;
  /** The default value of the component. */
  defaultValue?: string;
  /** Whether the editor is in edit mode. When used, the prop has to be controlled. */
  edit?: boolean;
  /** A Jss Object used to override or extend the styles applied. */
  classes?: ToolbarTabEditorClasses;
  /** Called the field is blurred. */
  onBlur?: (
    event: React.FocusEvent<Element> | React.KeyboardEvent<Element>,
    value: string,
  ) => void;
  /** Called the value changes. */
  onChange?: (
    event: React.FormEvent<Element> | React.KeyboardEvent<Element>,
    value: string,
  ) => void;
  /** Called the `edit` prop changes. */
  onEditChange?: (value: boolean) => void;
}

const sanitize = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const ToolbarTabEditor = ({
  id,
  className,
  edit: editProp,
  value: valueProp,
  defaultValue: defaultValueProp = "",
  classes: classesProp,
  onInput: onInputProp,
  onClick: onClickProp,
  onBlur: onBlurProp,
  onKeyDown: onKeyDownProp,
  onChange: onChangeProp,
  onEditChange: onEditChangeProp,
  ...others
}: ToolbarTabEditorProps) => {
  const { cx, classes } = useClasses(classesProp);

  const contentEditableRef = useRef<HTMLSpanElement>(null);

  // Sanitize content
  const [value, setValue] = useControlled(
    valueProp ? sanitize(valueProp) : valueProp,
    defaultValueProp ? sanitize(defaultValueProp) : defaultValueProp,
  );
  const [cachedValue, setCachedValue] = useState(value);
  const [isEditing, setIsEditing] = useControlled(editProp, false);

  const moveCursorToEnd = () => {
    if (!contentEditableRef.current) return;
    const element = contentEditableRef.current;
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    element.scrollLeft = element.scrollWidth;
  };

  const scrollContentToStart = () => {
    if (!contentEditableRef.current) return;
    const element = contentEditableRef.current;
    element.scrollLeft = 0;
  };

  const changeEdit = (edit: boolean) => {
    setIsEditing(edit);
    onEditChangeProp?.(edit);
  };

  // Update cursor when value updates: otherwise it goes to the start
  useEnhancedEffect(() => {
    if (isEditing) moveCursorToEnd();
  }, [isEditing, value]);

  const handleInput: HvTypographyProps["onInput"] = (event) => {
    // Sanitize content
    const newValue = sanitize((event.target as any).textContent) || "";
    setValue(newValue);
    onInputProp?.(event);
    onChangeProp?.(event, newValue);
  };

  const handleClick: HvTypographyProps["onClick"] = (event) => {
    setCachedValue(value);
    changeEdit(true);
    onClickProp?.(event);
  };

  const handleBlur = (
    event: React.FocusEvent<Element> | React.KeyboardEvent<Element>,
  ) => {
    changeEdit(false);
    scrollContentToStart();

    // Never leave the field empty
    const newValue = value.trim() || cachedValue;
    setValue(newValue);

    onBlurProp?.(event, newValue);
  };

  const handleKeyDown: HvTypographyProps["onKeyDown"] = (event) => {
    if (isKey(event, "Enter")) {
      // Blur field
      handleBlur(event);
    } else if (isKey(event, "Esc")) {
      changeEdit(false);

      // Cancel editing
      setValue(cachedValue);
      onChangeProp?.(event, cachedValue);
    }
    onKeyDownProp?.(event);
  };

  return (
    <div id={id} className={cx(classes.root, className)}>
      <HvTypography
        ref={contentEditableRef}
        contentEditable={isEditing}
        className={cx(classes.label, { [classes.edit]: isEditing })}
        variant="label"
        component="span"
        onInput={handleInput}
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        // Using children is unstable in React for contentEditable so the value is rendered through dangerouslySetInnerHTML
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: value,
        }}
        {...others}
      />
      <Edit className={classes.editIcon} iconSize="XS" />
    </div>
  );
};
