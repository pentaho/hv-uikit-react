// The plugin's starter view (/my-plugin). Replace it with your own, or delete it; wrap new views in ViewLayout.
// UI Kit components only, so its look follows the UI Kit.
import { ArrowSquareOut } from "@phosphor-icons/react";
import { HvTypography } from "@pentaho/uikit-react-core";

const copy = {
  title: "My plugin",
  start: "Build this view in",
  file: "src/pages/my-plugin.tsx",
  docs: "UI Kit docs",
};

export default function View() {
  return (
    // the App Shell's main area, below its header: the content centers in it, the docs link at its foot
    <div className="flex min-h-[calc(100dvh-var(--headerHeight))] flex-col items-center gap-md p-md text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-md">
        <HvTypography variant="title2" component="h1">
          {copy.title}
        </HvTypography>
        <HvTypography>
          {copy.start}{" "}
          <HvTypography
            variant="caption1"
            component="code"
            className="rounded-base bg-bgContainer px-xs py-xxs"
          >
            {copy.file}
          </HvTypography>
        </HvTypography>
      </div>
      <HvTypography
        variant="caption1"
        component="a"
        href="https://pentaho.github.io/uikit-docs/master/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-xxs hover:underline"
      >
        {copy.docs}
        <ArrowSquareOut aria-hidden />
      </HvTypography>
    </div>
  );
}
