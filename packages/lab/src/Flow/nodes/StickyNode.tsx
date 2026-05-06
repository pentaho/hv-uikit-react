import { useCallback, useMemo, useRef, useState } from "react";
import { css, cx } from "@emotion/css";
import Popover from "@mui/material/Popover";
import {
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  type NodeProps,
} from "reactflow";
import {
  HvButton,
  HvCheckBox,
  HvColorPicker,
  HvDialogContent,
  HvDialogTitle,
  HvIconButton,
  HvListItem,
  HvMultiButton,
  HvSelectionList,
  theme,
  type HvColorAny,
} from "@hitachivantara/uikit-react-core";
import {
  ActualSize,
  Bold,
  Delete,
  FontSize,
  Fullscreen,
  Italic,
  Palette,
} from "@hitachivantara/uikit-react-icons";

export type StickyNodeData =
  | undefined
  | {
      title?: string;
      backgroundColor?: HvColorAny;
      borderColor?: HvColorAny;
      textColor?: HvColorAny;
      hasShadow?: boolean;
      bold?: boolean;
      italic?: boolean;
      fontSize?: number;
      expanded?: boolean;
      visible?: boolean;
      onDelete?: () => void;
    };

const defaultData: StickyNodeData = {
  title: "Sticky Note",
  backgroundColor: theme.colors.warningSubtle,
  borderColor: theme.colors.warningSubtle,
  textColor: theme.colors.text,
  hasShadow: true,
  bold: false,
  italic: false,
  fontSize: 14,
  expanded: true,
  visible: true,
};

const classes = {
  root: css({
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    outline: "none",
  }),
  nodeToolbar: css({
    backgroundColor: "transparent",
    borderRadius: theme.radii.full,
    top: 10,
  }),
  buttonsContainer: css({
    padding: theme.space.xs,
  }),
  textAreaRoot: css({
    flex: 1,
    width: "100%",
    border: "none",
    background: "transparent",
    outline: "none",
  }),
  textAreaInput: css({
    resize: "none",
    height: "100%",
    width: "100%",
    padding: theme.space.xs,
    "&:focus-visible": {
      outline: "none",
    },
    paddingRight: 32,
  }),
  textAreaInputFolded: css({
    resize: "none",
    width: "100%",
    padding: 0,
    border: "none",
    overflow: "hidden",
    minHeight: "1.5rem",
    height: "auto",
  }),
  colorConfig: css({
    display: "flex",
    flexDirection: "column",
    gap: theme.space.sm,
  }),
  folded: css({
    width: 34,
    height: 34,
  }),
  expandButton: css({
    position: "absolute",
    top: theme.space.xxs,
    right: theme.space.xxs,
  }),
  fontSizes: css({
    maxHeight: 160,
    overflowY: "auto",
    padding: theme.space.xs,
  }),
};

const colorsToConfig = ["textColor", "backgroundColor", "borderColor"];
const fontSizes = [10, 11, 12, 14, 16, 20, 24, 32, 36, 40, 48, 64, 96, 128];

export const StickyNode = ({
  id,
  selected,
  data = {},
}: NodeProps<StickyNodeData>) => {
  const mergedData = useMemo(() => ({ ...defaultData, ...data }), [data]);

  const [text, setText] = useState("");
  const { setNodes } = useReactFlow();

  const [editing, setEditing] = useState(false);

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [colorsConfigOpen, setColorsConfigOpen] = useState(false);
  const [fontSizeConfigOpen, setFontSizeConfigOpen] = useState(false);

  const [fontSize, setFontSize] = useState(mergedData.fontSize ?? 14);

  const colorConfigBtnRef = useRef<HTMLButtonElement>(null);
  const fontSizeConfigBtnRef = useRef<HTMLButtonElement>(null);

  const handleToggleBold = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            bold: !node.data?.bold,
          };
        }
        return node;
      }),
    );
  }, [setNodes, id]);

  const handleToggleItalic = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            italic: !node.data?.italic,
          };
        }
        return node;
      }),
    );
  }, [setNodes, id]);

  const handleChangeFontSize = useCallback(
    (size: number) => {
      setFontSize(size);
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            node.data = {
              ...node.data,
              fontSize: size,
            };
          }
          return node;
        }),
      );
      setFontSizeConfigOpen(false);
    },
    [setNodes, id],
  );

  const handleToggleExpand = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            expanded: !node.data?.expanded,
          };
        }
        return node;
      }),
    );
  }, [setNodes, id]);

  const handleResetColors = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            backgroundColor: defaultData.backgroundColor,
            borderColor: defaultData.borderColor,
            textColor: defaultData.textColor,
            hasShadow: defaultData.hasShadow,
          };
        }
        return node;
      }),
    );
  }, [setNodes, id]);

  const handleDeleteSticky = useCallback(() => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    mergedData.onDelete?.();
  }, [mergedData, setNodes, id]);

  if (!mergedData.visible) return null;

  return (
    <>
      <Popover
        open={colorsConfigOpen}
        anchorEl={colorConfigBtnRef.current}
        onClose={() => {
          setColorsConfigOpen(false);
          setEditing(false);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <HvDialogTitle>Customize Colors</HvDialogTitle>
        <HvDialogContent>
          <div className={classes.colorConfig}>
            {colorsToConfig.map((c) => (
              <HvColorPicker
                key={c}
                label={c.charAt(0).toUpperCase() + c.slice(1).replace("Color", " Color")}
                value={mergedData[c as keyof StickyNodeData] ?? ""}
                onChange={(color) => {
                  setNodes((nds) =>
                    nds.map((node) => {
                      if (node.id === id) {
                        node.data = {
                          ...node.data,
                          [c]: color,
                        };
                      }
                      return node;
                    }),
                  );
                }}
              />
            ))}
            <HvCheckBox
              label="Drop Shadow"
              defaultChecked={mergedData.hasShadow}
              onChange={(_, checked) => {
                setNodes((nds) =>
                  nds.map((node) => {
                    if (node.id === id) {
                      node.data = {
                        ...node.data,
                        hasShadow: checked,
                      };
                    }
                    return node;
                  }),
                );
              }}
            />
            <HvButton variant="secondarySubtle" onClick={handleResetColors}>
              Reset to defaults
            </HvButton>
          </div>
        </HvDialogContent>
      </Popover>
      <Popover
        open={fontSizeConfigOpen}
        anchorEl={fontSizeConfigBtnRef.current}
        onClose={() => {
          setFontSizeConfigOpen(false);
          setEditing(false);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <HvSelectionList
          className={classes.fontSizes}
          value={fontSize}
          onChange={(evt, newValue) => {
            handleChangeFontSize(newValue);
          }}
        >
          {fontSizes.map((size) => (
            <HvListItem value={size} key={size}>
              {size}
            </HvListItem>
          ))}
        </HvSelectionList>
      </Popover>
      <div
        className={cx(
          classes.root,
          "nowheel",
          !mergedData.expanded && classes.folded,
        )}
        style={{
          backgroundColor:
            mergedData.backgroundColor ?? theme.colors.bgContainer,
          boxShadow: mergedData.hasShadow
            ? "0 8px 12px rgba(65,65,65,0.25)"
            : "none",
          border: mergedData.borderColor
            ? `1px solid ${mergedData.borderColor}`
            : "none",
          fontSize: `${mergedData.fontSize ?? 14}px`,
          lineHeight: `${mergedData.fontSize ?? 14}px`,
        }}
      >
        {mergedData.expanded && (
          <>
            <NodeResizer
              isVisible={selected}
              minWidth={100}
              minHeight={75}
              lineStyle={{
                color: theme.colors.primary,
                borderStyle: "solid",
              }}
              handleStyle={{
                width: 6,
                height: 6,
                border: `1px solid ${theme.colors.primary}`,
                backgroundColor: mergedData.backgroundColor ?? "transparent",
                borderRadius: theme.radii.full,
              }}
            />
            <NodeToolbar
              isVisible={editing || toolbarVisible || selected}
              position={Position.Top}
              className={classes.nodeToolbar}
              onMouseEnter={() => setToolbarVisible(true)}
              onMouseLeave={() => setToolbarVisible(false)}
            >
              <div className={classes.buttonsContainer}>
                <HvMultiButton>
                  <HvIconButton
                    aria-label="Font Size"
                    title="Font Size"
                    ref={fontSizeConfigBtnRef}
                    onClick={() => {
                      setEditing(true);
                      setFontSizeConfigOpen(true);
                    }}
                  >
                    <FontSize />
                  </HvIconButton>
                  <HvIconButton
                    aria-label="Bold"
                    title="Bold"
                    selected={mergedData.bold}
                    onClick={handleToggleBold}
                  >
                    <Bold />
                  </HvIconButton>
                  <HvIconButton
                    aria-label="Italic"
                    title="Italic"
                    selected={mergedData.italic}
                    onClick={handleToggleItalic}
                  >
                    <Italic />
                  </HvIconButton>
                  <HvIconButton
                    aria-label="Customize Colors"
                    title="Customize Colors"
                    ref={colorConfigBtnRef}
                    onClick={() => {
                      setEditing(true);
                      setColorsConfigOpen(true);
                    }}
                  >
                    <Palette />
                  </HvIconButton>
                  <HvIconButton
                    aria-label="Delete"
                    title="Delete"
                    onClick={handleDeleteSticky}
                  >
                    <Delete />
                  </HvIconButton>
                </HvMultiButton>
              </div>
            </NodeToolbar>
            <div
              onMouseEnter={() => setToolbarVisible(true)}
              onMouseLeave={() => setToolbarVisible(false)}
              className={classes.textAreaRoot}
            >
              <HvIconButton
                className={classes.expandButton}
                title="Fold"
                onClick={handleToggleExpand}
              >
                <ActualSize />
              </HvIconButton>
              <textarea
                id={`sticky-textarea-${id}`}
                value={text || ""}
                onChange={(e) => setText(e.target.value)}
                className={classes.textAreaInput}
                placeholder="Type here..."
                style={{
                  color: mergedData.textColor ?? theme.colors.text,
                  fontWeight: mergedData.bold ? "bold" : "normal",
                  fontStyle: mergedData.italic ? "italic" : "normal",
                  fontSize: mergedData.fontSize ?? "14px",
                }}
                onFocus={() => setEditing(true)}
                onBlur={() => {
                  setEditing(false);
                  setColorsConfigOpen(false);
                }}
              />
            </div>
          </>
        )}
        {!mergedData.expanded && (
          <>
            <HvIconButton
              title={
                <span
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {text}
                </span>
              }
              onClick={handleToggleExpand}
            >
              <Fullscreen />
            </HvIconButton>
          </>
        )}
      </div>
    </>
  );
};
