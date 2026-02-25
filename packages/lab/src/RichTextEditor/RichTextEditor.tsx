import { Global } from "@emotion/react";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";
import {
  ExtractNames,
  HvBaseProps,
  useDefaultProps,
} from "@hitachivantara/uikit-react-core";

import { ImageNode } from "./ImageNode";
import { MentionNode } from "./MentionNode";
import MentionsPlugin, { MentionSearchFunction } from "./MentionPlugin";
import { staticClasses, useClasses } from "./RichTextEditor.styles";
import { styles } from "./styles";
import { Toolbar } from "./Toolbar";

export { staticClasses as richTextEditorClasses };

export type HvRichTextEditorClasses = ExtractNames<typeof useClasses>;

export type HvRichTextEditorMentionSearchFunction = MentionSearchFunction;

export interface HvRichTextEditorProps extends HvBaseProps {
  /**
   * A Jss Object used to override or extend the styles applied.
   */
  classes?: HvRichTextEditorClasses;
  /**
   * Array of mention items that can be searched and selected.
   */
  mentionItems?: Array<string>;
  /**
   * Custom search function for mentions. If not provided, a default search will be used.
   * The function should call the callback with filtered results.
   */
  mentionSearchFunction?: HvRichTextEditorMentionSearchFunction;
}

const editorConfig = {
  namespace: "MyEditor",
  onError(error: Error) {
    console.error("LEXICAL ERROR:", error);
  },
  theme: {
    text: {
      bold: "text-bold",
      italic: "text-italic",
      underline: "text-underline",
      strikethrough: "text-strikethrough",
      code: "text-code",
    },
    elementFormat: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    link: "editor-link",
  },
  nodes: [
    ParagraphNode,
    TextNode,
    HeadingNode,
    MentionNode,
    ImageNode,
    ListNode,
    ListItemNode,
    LinkNode,
  ],
};

/**
 */
export const HvRichTextEditor = (props: HvRichTextEditorProps) => {
  const {
    className,
    classes: classesProp,
    mentionItems,
    mentionSearchFunction,
    ...others
  } = useDefaultProps("HvRichTextEditor", props);

  const { classes, cx } = useClasses(classesProp);

  return (
    <div className={cx(classes.root, className)} {...others}>
      <Global styles={styles} />
      <LexicalComposer initialConfig={editorConfig}>
        <Toolbar />
        <ListPlugin />
        <LinkPlugin />
        <div className={classes.content}>
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor" />}
            placeholder={<div className="placeholder">Start typing...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <AutoFocusPlugin />
        {mentionItems && mentionItems.length > 0 && (
          <MentionsPlugin
            items={mentionItems}
            searchFunction={mentionSearchFunction}
          />
        )}
      </LexicalComposer>
    </div>
  );
};
