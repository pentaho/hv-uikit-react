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
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react/ArrowCounterClockwise";
import { CheckIcon } from "@phosphor-icons/react/Check";
import { CopyIcon } from "@phosphor-icons/react/Copy";
import { HvButton, HvTooltip } from "@hitachivantara/uikit-react-core";

type ExpandableControlsProps = {
  onToggle: () => void;
  isExpanded: boolean;
  code: string;
  onReset: () => void;
};

export const ExpandableControls = ({
  onToggle,
  isExpanded,
  code,
  onReset,
}: ExpandableControlsProps) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="absolute right-0 flex items-center p-xs gap-xs">
      {/* Toggle Code Button */}
      <HvButton
        size="xs"
        variant="secondaryGhost"
        onClick={onToggle}
        aria-label={isExpanded ? "Hide Code" : "Show Code"}
      >
        {isExpanded ? <>Hide Code</> : <>Show Code</>}
      </HvButton>

      {/* Reset Button */}
      <HvTooltip title="Reset Code">
        <HvButton
          icon
          size="xs"
          variant="secondaryGhost"
          onClick={onReset}
          aria-label="Reset Code"
        >
          <ArrowCounterClockwiseIcon />
        </HvButton>
      </HvTooltip>

      {/* Copy Button */}
      <HvTooltip title={copySuccess ? "Copied!" : "Copy Code"}>
        <HvButton
          icon
          size="xs"
          variant="secondaryGhost"
          onClick={handleCopyToClipboard}
          aria-label="Copy Code"
        >
          {copySuccess ? <CheckIcon /> : <CopyIcon />}
        </HvButton>
      </HvTooltip>
    </div>
  );
};
