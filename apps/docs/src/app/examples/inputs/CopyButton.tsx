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
import { useRef, useState } from "react";
import { HvAdornment, HvInput } from "@hitachivantara/uikit-react-core";
import { Copy, Success } from "@hitachivantara/uikit-react-icons";

export default function Demo() {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputRef.current?.value || "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <HvInput
      label="Copy to clipboard"
      ref={inputRef}
      className="w-300px"
      defaultValue="Copy this text"
      endAdornment={
        <HvAdornment
          icon={
            <>
              <Success
                color="positive"
                className={`transition-all ${copied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
              />
              <Copy
                className={`absolute transition-all ${copied ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
              />
            </>
          }
          onClick={handleCopy}
        />
      }
    />
  );
}
