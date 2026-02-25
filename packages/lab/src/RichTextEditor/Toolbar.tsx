import { useCallback, useEffect, useState } from "react";
import { $isLinkNode } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalNode,
  mergeRegister,
  ParagraphNode,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from "lexical";
import {
  ExtractNames,
  HvColorPicker,
  HvIconButton,
  HvMultiButton,
  HvSelect,
  theme,
} from "@hitachivantara/uikit-react-core";

import { ImageDialog } from "./ImageDialog";
import { useClasses } from "./Toolbar.styles";
import { UrlDialog } from "./UrlDialog";

export type HvRichTextEditorToolbarClasses = ExtractNames<typeof useClasses>;

const defaultTextCommands: { name: TextFormatType; icon: JSX.Element }[] = [
  { name: "bold", icon: <div className="i-ph-text-b" /> },
  { name: "italic", icon: <div className="i-ph-text-italic" /> },
  { name: "underline", icon: <div className="i-ph-text-underline" /> },
  { name: "strikethrough", icon: <div className="i-ph-text-strikethrough" /> },
  { name: "code", icon: <div className="i-ph-code" /> },
];

const defaultHeadingCommands = [
  {
    level: "paragraph",
    label: "Paragraph",
    icon: <div className="i-ph-paragraph" />,
  },
  {
    level: "h1",
    label: "Heading 1",
    icon: <div className="i-ph-text-h-one" />,
  },
  {
    level: "h2",
    label: "Heading 2",
    icon: <div className="i-ph-text-h-two" />,
  },
  {
    level: "h3",
    label: "Heading 3",
    icon: <div className="i-ph-text-h-three" />,
  },
];

const defaultAlignmentCommands = [
  { alignment: "left", icon: <div className="i-ph-text-align-left" /> },
  {
    alignment: "center",
    icon: <div className="i-ph-text-align-center" />,
  },
  { alignment: "right", icon: <div className="i-ph-text-align-right" /> },
  { alignment: "justify", icon: <div className="i-ph-text-align-justify" /> },
];

export const Toolbar = ({
  classes: classesProp,
}: {
  classes?: HvRichTextEditorToolbarClasses;
}) => {
  const { classes } = useClasses(classesProp);
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [currentAlignment, setCurrentAlignment] =
    useState<ElementFormatType>("");
  const [currentHeading, setCurrentHeading] = useState("paragraph");
  const [currentList, setCurrentList] = useState<string | null>(null);
  const [currentFontColor, setCurrentFontColor] = useState<string | null>(null);

  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    // Get the node that the selection is anchored to. This will be used to check for parent nodes like links, lists, etc.
    const anchorNode = selection.anchor.getNode();

    // -------- TEXT FORMATS --------
    const formats = new Set<TextFormatType>();
    if (selection.hasFormat("bold")) formats.add("bold");
    if (selection.hasFormat("italic")) formats.add("italic");
    if (selection.hasFormat("underline")) formats.add("underline");
    if (selection.hasFormat("strikethrough")) formats.add("strikethrough");
    if (selection.hasFormat("code")) formats.add("code");

    // -------- FONT COLOR --------
    // const styles = selection.getStyle();
    // const match = /color:\s*([^;]+)/.exec(styles);
    // setCurrentFontColor(match?.[1] ?? null);

    editor.read(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();

        let color: string | null = null;

        for (const node of nodes) {
          if ($isTextNode(node)) {
            const style = node.getStyle(); // ✅ exists on TextNode

            const match = style.match(/color:\s*([^;]+)/);
            if (match) {
              color = match[1];
              break;
            }
          }
        }

        setCurrentFontColor(color ?? null);
      }
    });

    setActiveFormats(formats);

    // -------- LINK --------
    const linkNode = $isLinkNode(anchorNode)
      ? anchorNode
      : anchorNode.getParent();

    if ($isLinkNode(linkNode)) {
      setIsLink(true);
    } else {
      setIsLink(false);
    }

    // -------- BLOCK --------
    const element = $getNearestBlockElementAncestorOrThrow(anchorNode);

    setCurrentAlignment(element.getFormatType());

    if (element instanceof HeadingNode) {
      setCurrentHeading(element.getTag());
    } else if (element instanceof ParagraphNode) {
      setCurrentHeading("paragraph");
    }

    // -------- LIST DETECTION --------
    let listType = null;
    let parent: LexicalNode | null = anchorNode;

    while (parent) {
      if ($isListNode(parent)) {
        listType = parent.getListType();
        break;
      }
      parent = parent.getParent();
    }

    setCurrentList(listType);
  }, [editor]);

  const toggleList = useCallback(
    (type: "bullet" | "number") => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        let currentListType = null;

        // Find nearest list ancestor
        for (
          let parent: LexicalNode | null = selection.anchor.getNode();
          parent !== null;
          parent = parent.getParent()
        ) {
          if ($isListNode(parent)) {
            currentListType = parent.getListType();
            break;
          }
        }

        // If the selection is already a list, remove it
        if (currentListType === type) {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          return;
        }

        if (type === "bullet") {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
      });
    },
    [editor],
  );

  /**
   * Note to @zettca:
   *
   * I know, I'm using `useEffect`. It's needed here, we need to update the toolbar state whenever the selection changes,
   * and the only way to listen to selection changes in Lexical is through `registerUpdateListener` or `registerCommand`
   * with `SELECTION_CHANGE_COMMAND`. Both of these are side effects, so we need to use `useEffect` to set them up.
   */
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbar);
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(updateToolbar);
          return false;
        },
        1,
      ),
    );
  }, [editor, updateToolbar]);

  const setHeading = useCallback(
    (type: "paragraph" | "h1" | "h2" | "h3") => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) return;

        if (type === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(type));
        }
      });
    },
    [editor],
  );

  const toggleFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const toggleAlignment = (
    alignment: "left" | "center" | "right" | "justify",
  ) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  const setTextColor = useCallback(
    (color: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            color,
          });
        }
      });
    },
    [editor],
  );

  return (
    <>
      <ImageDialog
        editor={editor}
        open={isImageDialogOpen}
        setOpen={setIsImageDialogOpen}
      />
      <UrlDialog
        editor={editor}
        open={isUrlDialogOpen}
        setOpen={setIsUrlDialogOpen}
        linkUrl={linkUrl}
        setLinkUrl={setLinkUrl}
      />
      <div className={classes.toolbarRoot}>
        <HvSelect
          onChange={(_, value) => {
            setCurrentHeading(value as string);
            setHeading(value as "paragraph" | "h1" | "h2" | "h3");
          }}
          value={currentHeading}
          variableWidth
          options={[
            defaultHeadingCommands.map(({ level, label }) => ({
              label: label,
              value: level,
            })),
          ].flat()}
        />

        <HvMultiButton className="w-fit">
          {defaultTextCommands.map(({ name, icon }) => (
            <HvIconButton
              key={name}
              title={name}
              onClick={() => toggleFormat(name)}
              style={{
                backgroundColor: activeFormats.has(name)
                  ? theme.colors.primaryDimmed
                  : "transparent",
              }}
            >
              {icon}
            </HvIconButton>
          ))}
          <HvIconButton title="Color">
            <HvColorPicker
              iconOnly
              onChange={(hex) => setTextColor(hex)}
              value={currentFontColor || ""}
              classes={{ dropdownRootIconOnly: classes.colorPickerDropdown }}
            />
          </HvIconButton>
        </HvMultiButton>
        <HvMultiButton className="w-fit">
          {defaultAlignmentCommands.map(({ alignment, icon }) => (
            <HvIconButton
              key={alignment}
              title={`H${alignment}`}
              onClick={() =>
                toggleAlignment(
                  alignment as "left" | "center" | "right" | "justify",
                )
              }
              style={{
                backgroundColor:
                  currentAlignment === alignment
                    ? theme.colors.primaryDimmed
                    : "transparent",
              }}
            >
              {icon}
            </HvIconButton>
          ))}
        </HvMultiButton>
        <HvMultiButton className="w-fit">
          <HvIconButton
            title="Unordered List"
            onClick={() => toggleList("bullet")}
            style={{
              backgroundColor:
                currentList === "bullet"
                  ? theme.colors.primaryDimmed
                  : "transparent",
            }}
          >
            <div className="i-ph-list-bullets" />
          </HvIconButton>
          <HvIconButton
            title="Ordered List"
            onClick={() => toggleList("number")}
            style={{
              backgroundColor:
                currentList === "number"
                  ? theme.colors.primaryDimmed
                  : "transparent",
            }}
          >
            <div className="i-ph-list-numbers" />
          </HvIconButton>
        </HvMultiButton>
        <HvMultiButton className="w-fit">
          <HvIconButton
            variant="secondarySubtle"
            title="Add Image"
            onClick={() => setIsImageDialogOpen(true)}
          >
            <div className="i-ph-image" />
          </HvIconButton>
          <HvIconButton
            variant="secondarySubtle"
            title="Add link"
            onClick={() => setIsUrlDialogOpen(true)}
            style={{
              backgroundColor: isLink
                ? theme.colors.primaryDimmed
                : "transparent",
            }}
          >
            <div className="i-ph-link" />
          </HvIconButton>
        </HvMultiButton>
      </div>
    </>
  );
};
