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
import { HvTab, HvTabs, HvTypography } from "@hitachivantara/uikit-react-core";

import { DocsContainer } from "./DocsProvider";
import { ToggableControls } from "./ToggableControls";

type ToggableLayoutProps = {
  title?: string;
  code: Record<string, string>;
  scope: Scope;
};

export const ToggableLayout = ({ title, scope, code }: ToggableLayoutProps) => {
  const [tmpCode, setTmpCode] = useState({ ...code });
  const [activeTab, setActiveTab] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  const { element, error, onChange } = useLiveRunner({
    initialCode: Object.values(code)[0],
    scope: scope || {},
  });

  const hasMultipleFiles = Object.keys(code).length > 1;

  const fileNames = Object.keys(code).map(
    (file) => file.split("/").pop() || file,
  );

  const handleEditorChange = (value: string) => {
    setTmpCode((prev) => ({
      ...prev,
      [Object.keys(tmpCode)[activeTab]]: value,
    }));
    onChange(value);
  };

  return (
    <section data-pagefind-ignore>
      <div className="flex justify-between items-center mb-xs">
        {/* Title */}
        <HvTypography variant="title4">{title}</HvTypography>

        {/* Tabs for navigating between files in multi-file mode */}
        {hasMultipleFiles && !showPreview && (
          <HvTabs
            floating
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            aria-label="File Tabs"
          >
            {fileNames.map((fileName) => (
              <HvTab key={fileName} label={fileName} />
            ))}
          </HvTabs>
        )}

        {/* Toolbar for controls: toggle preview, reset, and copy */}
        <ToggableControls
          code={tmpCode}
          showPreview={showPreview}
          toggleView={() => setShowPreview((prev) => !prev)}
          onReset={() => {
            setTmpCode({ ...code });
          }}
        />
      </div>

      {/* Main content: Preview or Editor */}
      <DocsContainer
        className={clsx(
          "p-md pt-lg min-h-100px mb-lg",
          "border border-borderSubtle rounded-round",
          "bg-bgContainer [&_tr]:table-row",
          !showPreview && "hidden",
        )}
        error={error}
        element={element}
      />
      <div className={clsx(showPreview && "hidden")}>
        {/* Code editor for active tab */}
        <div className="max-h-[400px] overflow-auto rounded-round">
          <CodeEditor
            value={Object.values(tmpCode)[activeTab]}
            onChange={handleEditorChange}
            className="font-mono text-[.88em]"
          />
        </div>
      </div>
    </section>
  );
};
