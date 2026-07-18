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
import { HvButton, HvTooltip } from "@hitachivantara/uikit-react-core";
import {
  Check,
  Code,
  Copy,
  Preview,
  Reload,
} from "@hitachivantara/uikit-react-icons";

type ToggableControlsProps = {
  code: Record<string, string>;
  showPreview: boolean;
  toggleView: () => void;
  onReset: () => void;
};

/**
 * Controls component for managing view toggle, copy, and reset actions.
 */
export const ToggableControls = ({
  code,
  showPreview,
  toggleView,
  onReset,
}: ToggableControlsProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Handles copying the code to the clipboard
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(Object.values(code)[0]);
      setCopySuccess(true); // Show success feedback
      setTimeout(() => setCopySuccess(false), 2000); // Reset feedback after 2 seconds
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="flex ml-auto items-center py-xs gap-xs">
      {/* Toggle between Code and Preview */}
      <HvTooltip title={showPreview ? "Show Code" : "Show Preview"}>
        <HvButton
          variant="ghost"
          onClick={toggleView}
          startIcon={showPreview ? <Code /> : <Preview />}
          aria-label={showPreview ? "Show Preview" : "Show Code"}
        >
          {showPreview ? "Code" : "Preview"}
        </HvButton>
      </HvTooltip>

      {/* Reset Button */}
      <HvTooltip title="Reset">
        <HvButton
          icon
          variant="ghost"
          onClick={onReset}
          aria-label="Reset Code"
        >
          <Reload size="xs" />
        </HvButton>
      </HvTooltip>

      {/* Copy Button */}
      <HvTooltip title={copySuccess ? "Copied!" : "Copy"}>
        <HvButton
          icon
          variant="ghost"
          onClick={handleCopyToClipboard}
          aria-label="Copy Code"
        >
          {copySuccess ? <Check size="sm" /> : <Copy size="sm" />}
        </HvButton>
      </HvTooltip>
    </div>
  );
};
