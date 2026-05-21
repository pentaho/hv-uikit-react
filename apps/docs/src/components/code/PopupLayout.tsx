import { useState } from "react";
import { CodeEditor, useLiveRunner, type Scope } from "react-live-runner";
import { CheckIcon } from "@phosphor-icons/react/Check";
import { CodeIcon } from "@phosphor-icons/react/Code";
import { CopyIcon } from "@phosphor-icons/react/Copy";
import {
  HvDialog,
  HvDialogContent,
  HvDialogTitle,
  HvIconButton,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { DocsContainer } from "./DocsProvider";

type PopupLayoutProps = {
  id?: string;
  scope: Scope | null;
  code: Record<string, string>;
  title: string | undefined;
};

/**
 * PopupLayout renders a live preview and an expandable code editor
 * with interactive controls for toggling and resetting the code.
 */
export const PopupLayout = ({ id, scope, code, title }: PopupLayoutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const initialCode = Object.values(code)[0];

  const {
    element,
    error,
    code: editorCode,
    onChange,
  } = useLiveRunner({
    initialCode,
    scope: scope || {},
  });

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editorCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <section
      id={id}
      data-pagefind-ignore
      className="bg-transparent relative border-border border-1 border-t-0 -ml-px h-full"
    >
      <HvDialog
        onClose={() => setIsExpanded(false)}
        open={isExpanded}
        fullWidth
        maxWidth="md"
      >
        <HvDialogTitle>Code</HvDialogTitle>
        <HvDialogContent className="py-sm">
          <HvIconButton
            title={copySuccess ? "Copied!" : "Copy Code"}
            variant="secondarySubtle"
            onClick={handleCopyToClipboard}
            className="z-1 absolute right-md top-64px"
          >
            {copySuccess ? <CheckIcon /> : <CopyIcon />}
          </HvIconButton>
          <CodeEditor
            value={editorCode}
            onChange={onChange}
            className="font-mono text-[.85em] rounded-round border border-color-inherit"
          />
        </HvDialogContent>
      </HvDialog>

      {/* Poupup Controls */}
      <div className="flex flex-col gap-xxs items-center">
        <div className="p-sm gap-xs w-full flex justify-between items-center">
          <HvTypography variant="label" className="pl-xs">
            {title}
          </HvTypography>
          <HvIconButton
            title="Show Code"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <CodeIcon />
          </HvIconButton>
        </div>
        <div className="h-full [&>*]:h-full [&>*]:bg-transparent">
          {/* Preview Section */}
          <DocsContainer
            className="p-md pt-0 flex items-center justify-center h-full [&>div]:flex-wrap "
            error={error}
            element={element}
          />
        </div>
      </div>
      <pre className="hidden">{editorCode}</pre>
    </section>
  );
};
