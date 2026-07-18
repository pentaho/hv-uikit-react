/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { useState } from "react";
import { css } from "@emotion/css";
import { HvCodeEditor } from "@hitachivantara/uikit-react-code-editor";
import {
  HvDialog,
  HvDialogContent,
  HvDialogTitle,
  HvIconButton,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import {
  Duplicate,
  Fullscreen,
  PopUp,
} from "@hitachivantara/uikit-react-icons";

const styles = {
  actionsContainer: css({
    display: "flex",
    alignItems: "center",
    gap: theme.space.xs,
  }),
  codeEditorHeader: css({
    display: "flex",
    justifyContent: "space-between",
    height: 50,
    border: `1px solid ${theme.colors.border}`,
    borderBottom: "none",
    background: theme.colors.bgContainer,
    padding: theme.space.xs,
  }),
};

const Header = ({ title, onOpen }: { title: string; onOpen: () => void }) => (
  <div className={styles.codeEditorHeader}>
    <div className={styles.actionsContainer}>
      <HvTypography component="div" variant="label">
        {title}
      </HvTypography>
      <HvIconButton
        title="Open in new window"
        component="a"
        href="#"
        target="_blank"
        rel="noopener noreferrer"
      >
        <PopUp />
      </HvIconButton>
    </div>
    <div className={styles.actionsContainer}>
      <HvIconButton title="Fullscreen" onClick={onOpen}>
        <Fullscreen />
      </HvIconButton>
      <HvIconButton title="Duplicate">
        <Duplicate />
      </HvIconButton>
    </div>
  </div>
);

const defaultValueJson = `{
  "glossary": {
    "title": "example glossary",
    "GlossDiv": {
      "title": "S",
      "GlossList": {   
        "GlossEntry": {                    
          "ID": "SGML",
          "SortAs": "SGML",
          "GlossTerm": "Standard Generalized Markup Language",
          "Acronym": "SGML",
          "Abbrev": "ISO 8879:1986",
          "GlossDef": {                        
            "para": "A meta-markup language, used to create markup languages such as DocBook.",
            "GlossSeeAlso": ["GML", "XML"]                    
          },
          "GlossSee": "markup"                
        }            
      }        
    }    
  }
}`;

export const MainStory = () => {
  const [open, setOpen] = useState(false);
  const [editorContent, setEditorContent] = useState(defaultValueJson);

  const renderCodeEditor = (height: number) => (
    <HvCodeEditor
      height={height}
      language="json"
      onChange={(input) => {
        setEditorContent(input || "");
      }}
      value={editorContent}
    />
  );

  return (
    <>
      <Header title="some file.json" onOpen={() => setOpen(true)} />
      {renderCodeEditor(420)}
      <HvDialog
        fullWidth
        maxWidth="xl"
        open={open}
        onClose={() => setOpen(false)}
      >
        <HvDialogTitle>FullScreen</HvDialogTitle>
        <HvDialogContent>{renderCodeEditor(500)}</HvDialogContent>
      </HvDialog>
    </>
  );
};
