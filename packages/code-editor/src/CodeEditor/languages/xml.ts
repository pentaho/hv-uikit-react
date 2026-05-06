import type { Monaco } from "@monaco-editor/react";
import formatter, { type XMLFormatterOptions } from "xml-formatter";
import { validateXML } from "xmllint-wasm";

import type { LanguagePlugin } from "../types";

// Helpful notes
// model - editor content
// position - position of the pointer

type Elements = Record<string, { attributes?: string[]; children?: string[] }>; // element name (key)

/** Gets the attributes and children elements of an element */
const parseElement = (element: Element) => {
  const elementAttributes: string[] = [];
  const elementChildren: string[] = [];

  // Look for element complex type
  const complexType = element.getElementsByTagNameNS("*", "complexType")[0];

  if (complexType) {
    // Look for sequence within complex type
    const sequence = complexType.getElementsByTagNameNS("*", "sequence")[0];

    // Get all children
    if (sequence) {
      const children = Array.from(sequence.childNodes).filter((node) =>
        node.nodeName.includes(":element"),
      );
      if (children.length > 0) {
        Array.from(children).forEach((child) => {
          if (child instanceof Element) {
            const childName = child.getAttribute("name");
            if (childName) elementChildren.push(childName);
          }
        });
      }
    }

    // Get all attributes
    const attributes = Array.from(complexType.childNodes).filter((node) =>
      node.nodeName.includes(":attribute"),
    );
    if (attributes.length > 0) {
      Array.from(attributes).forEach((attr) => {
        if (attr instanceof Element) {
          const attrName = attr.getAttribute("name");
          if (attrName) elementAttributes.push(attrName);
        }
      });
    }
  }

  return [elementAttributes, elementChildren];
};

/**
 * Gets elements and their children and attributes from XSD schema.
 */
const getXsdElementsAndAttributes = (value: string): Elements => {
  const elements: Elements = {};
  try {
    // Parse XSD schema string into a DOM object
    const parser = new DOMParser();
    const schemaDoc = parser.parseFromString(value, "text/xml");

    // Get all elements and their children and attributes
    for (const element of schemaDoc.getElementsByTagNameNS("*", "element")) {
      const elementName = element.getAttribute("name");
      const [elementAttributes, elementChildren] = parseElement(element);
      if (elementName)
        elements[elementName] = {
          attributes: elementAttributes,
          children: elementChildren,
        };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    if (import.meta.env.DEV) console.error(error);
  }
  return elements;
};

/**
 * Gets the last opened tag to suggest attributes (closed = false) or children (closed = true)
 * Source code from: https://mono.software/2017/04/11/custom-intellisense-with-monaco-editor/
 */
const getLastOpenedTag = (content: string, closed = false) => {
  // Get all tags inside of the content
  const tags = content.match(/<\/*(?=\S*)([a-zA-Z-]+)/g);
  if (!tags) return undefined;

  // Find closed tags
  const closingTags = [];

  for (let i = tags.length - 1; i >= 0; i--) {
    if (tags[i].indexOf("</") === 0) {
      // It's a closing tag since it's beginning with "</"
      closingTags.push(tags[i].slice("</".length));
    } else {
      // Get the last position of the tag
      const tagPosition = content.lastIndexOf(tags[i]);
      const tag = tags[i].slice("<".length);

      // Looking if it's self closing
      const closingBracketIdx = content.indexOf("/>", tagPosition);

      if (closingBracketIdx === -1) {
        // If there are no closing tags or the current tag wasn't closed
        if (
          !closingTags.length ||
          closingTags[closingTags.length - 1] !== tag
        ) {
          // Last open tag found
          content = content.slice(tagPosition);
          const opened = content.indexOf(">") === -1;
          return closed ? (opened ? undefined : tag) : opened ? tag : undefined;
        }

        // Remove the last closed tag since it
        closingTags.splice(closingTags.length - 1, 1);
      }

      // Remove the last closed tag and continue processing the rest of the content
      content = content.slice(0, tagPosition);
    }
  }
  return undefined;
};

/**
 * Triggers suggestions for specific cases.
 */
export const hvXmlCompletionProvider = (monaco: Monaco, schema?: string) => {
  const elements = schema ? getXsdElementsAndAttributes(schema) : undefined;
  const root = elements ? Object.keys(elements)[0] : undefined;
  const emptySuggestions = root
    ? [
        /** Add root element to the editor */
        {
          label: "Insert root element",
          kind: monaco.languages.CompletionItemKind.Snippet,
          // oxlint-disable-next-line typescript/no-unnecessary-template-expression
          insertText: `<${root}>\n\t${"${0:}"}\n</${root}>`, // ${0:} used to position the cursor
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
      ]
    : [];

  return {
    triggerCharacters: ["<"],
    provideCompletionItems: (model: any, position: any) => {
      // Suggestions to show when there's nothing written (by using keys or typing a trigger characters)
      const fullContent = model.getValue();
      if (!String(fullContent).trim()) {
        return {
          suggestions: emptySuggestions.map((sug) => ({
            ...sug,
            range: {
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 1,
            },
          })),
        };
      }

      const suggestions: object[] = [];
      const lastWordWritten = model.getWordUntilPosition(position);
      const textUntilCursor = String(
        model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        }),
      );

      // Suggestions to show when opening a tag (by typing "<")
      const lastTypedChar = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column - 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const parentTag = getLastOpenedTag(textUntilCursor, true);
      if (lastTypedChar === "<" && elements) {
        let children: string[] | undefined;
        if (parentTag) children = elements[parentTag]?.children;
        else if (root && !String(fullContent.slice(0, -1)).trim())
          children = [root];

        if (children)
          for (const child of children) {
            suggestions.push({
              label: child,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: child,
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              },
            });
          }
      }

      // Suggestions to show when looking for attributes in a tag (by using keys)
      const lastOpenedTag = getLastOpenedTag(textUntilCursor);
      if (
        lastOpenedTag &&
        elements?.[lastOpenedTag] &&
        elements[lastOpenedTag].attributes &&
        elements[lastOpenedTag].attributes.length > 0
      ) {
        const attributes = lastWordWritten.word
          ? elements[lastOpenedTag].attributes.filter((attr) =>
              attr.startsWith(lastWordWritten.word),
            )
          : elements[lastOpenedTag].attributes;
        for (const attribute of attributes) {
          suggestions.push({
            label: attribute,
            kind: monaco.languages.CompletionItemKind.Field,
            // oxlint-disable-next-line typescript/no-unnecessary-template-expression
            insertText: `${attribute}="${"${0:}"}"`, // ${0:} used to position the cursor
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: lastWordWritten.startColumn,
              endLineNumber: position.lineNumber,
              endColumn: lastWordWritten.endColumn,
            },
          });
        }
      }

      return {
        suggestions,
      };
    },
  };
};

/**
 * Validates XML with XSD schema and create error markers to show on code editor.
 */
export const hvXmlValidator = async (
  content: string,
  editor: any,
  monaco: Monaco,
  schema = "",
) => {
  const model = editor.getModel();

  try {
    const validation = await validateXML({ xml: content, schema });
    if (!validation.valid) {
      return validation.errors.map((error) => {
        return {
          severity: monaco.MarkerSeverity.Error,
          message: error.message,
          startLineNumber: error.loc?.lineNumber ?? 1,
          startColumn:
            model.getLineFirstNonWhitespaceColumn(error.loc?.lineNumber) ?? 1,
          endLineNumber: error.loc?.lineNumber ?? 1,
          endColumn:
            model.getLineLastNonWhitespaceColumn(error.loc?.lineNumber) ?? 1,
        };
      });
    }
  } catch (error: any) {
    const value = model.getValue();
    if (!String(value).trim()) return [];

    const errors = String(error?.message).split("parser error :");
    const lastError = errors[errors.length - 1].trim();
    const lineNumberParts = lastError.match(/(line) ([0-9]+)/);
    const errorLine = Number(lineNumberParts?.[2]) || 1;
    const cleanedError = lastError.replace(lineNumberParts?.[0] ?? "", "");

    return [
      {
        severity: monaco.MarkerSeverity.Error,
        message: cleanedError,
        startLineNumber: errorLine,
        startColumn: model.getLineFirstNonWhitespaceColumn(errorLine) ?? 1,
        endLineNumber: errorLine,
        endColumn: model.getLineLastNonWhitespaceColumn(errorLine) ?? 1,
      },
    ];
  }
  return [];
};

/**
 * Auto-completes a tag when closing it: writing ">" after "<root" will automatically add "</root>"
 * Source code from: https://github.com/microsoft/monaco-editor/issues/221
 */
export const hvXmlKeyDownListener = (
  event: any,
  editor: any,
  monaco: Monaco,
) => {
  if (event.browserEvent.key === ">") {
    const model = editor.getModel();
    const edits: any[] = [];
    const selections: any[] = [];

    for (const selection of editor.getSelections()) {
      // Shift the selection over by one to account for the new character
      selections.push(
        new monaco.Selection(
          selection.selectionStartLineNumber,
          selection.selectionStartColumn + 1,
          selection.endLineNumber,
          selection.endColumn + 1,
        ),
      );

      // Line before the cursor
      const lineBeforeChange = model.getValueInRange({
        startLineNumber: selection.endLineNumber,
        startColumn: 1,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn,
      });

      // Look for the tag we are currently closing and shouldn't have opened attributes
      const tag = String(lineBeforeChange).match(
        /<([\w-]+)\s*(?:(?:\s+[\w-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*$/,
      )?.[1];
      if (tag) {
        // Add the closing tag
        edits.push({
          range: {
            startLineNumber: selection.endLineNumber,
            startColumn: selection.endColumn + 1,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn + 1,
          },
          text: `</${tag}>`,
        });
      }
    }

    // Wait for next tick to being an invalid operation
    setTimeout(() => {
      editor.executeEdits(model.getValue(), edits, selections);
    }, 0);
  }
};

/** XML custom options. */
export const hvXmlOptions = {
  autoClosingBrackets: false,
};

/**
 * XML code formatter.
 * When the code has errors, it is not formatted and `undefined` is returned.
 * @param content Current code editor content
 * @param editor Editor instance
 * @param monaco Monaco instance
 * @param options XML formatter options
 * @returns `string with the formatted code or `undefined`
 */
export const hvXmlFormatter = async (
  content: string,
  editor: any,
  monaco: Monaco,
  options?: XMLFormatterOptions,
) => {
  const validation = await hvXmlValidator(content, editor, monaco); // without schema for XML
  const hasError = validation.some(
    (marker: any) => marker?.severity === monaco.MarkerSeverity.Error,
  );

  // Format only if there are no errors
  return hasError
    ? undefined
    : formatter(content, {
        collapseContent: true,
        ...options,
      });
};

export interface XmlLanguagePlugin extends LanguagePlugin {}

export const xmlLanguagePlugin: XmlLanguagePlugin = {
  completionProvider: hvXmlCompletionProvider,
  validator: hvXmlValidator,
  formatter: hvXmlFormatter,
  keyDownListener: hvXmlKeyDownListener,
  editorOptions: hvXmlOptions,
};
