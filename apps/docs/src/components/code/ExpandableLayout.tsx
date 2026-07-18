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
import { CodeEditor, useLiveRunner, type Scope } from "react-live-runner";
import { clsx } from "clsx";

import { DocsContainer } from "./DocsProvider";
import { ExpandableControls } from "./ExpandableControls";

type ExpandableLayoutProps = {
  scope: Scope | null;
  code: Record<string, string>;
};

/**
 * ExpandableLayout renders a live preview and an expandable code editor
 * with interactive controls for toggling and resetting the code.
 */
export const ExpandableLayout = ({ scope, code }: ExpandableLayoutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const initialCode = Object.values(code)[0];

  const {
    element,
    code: editorCode,
    error: liveError,
    onChange,
  } = useLiveRunner({
    initialCode,
    scope: scope || {},
  });

  return (
    <section
      data-pagefind-ignore
      className="relative mt-md border-border rounded-round"
    >
      {/* Compact Controls */}
      <ExpandableControls
        onToggle={() => setIsExpanded((prev) => !prev)}
        isExpanded={isExpanded}
        code={editorCode}
        onReset={() => onChange(initialCode)}
      />

      {/* Preview Section */}
      <DocsContainer
        className={clsx(
          "px-md py-40px bg-bgPage border rounded-round border-color-inherit",
          isExpanded && "rounded-b-0",
        )}
        error={liveError}
        element={element}
      />

      {/* Code Editor Section */}
      <div
        className="overflow-auto rounded-b-inherit -mt-xxs transition-max-height border-color-inherit"
        style={{
          maxHeight: isExpanded ? 400 : 0,
        }}
      >
        <CodeEditor
          value={editorCode}
          onChange={onChange}
          className="font-mono text-[.85em] rounded-b-inherit border border-color-inherit"
        />
      </div>
    </section>
  );
};
