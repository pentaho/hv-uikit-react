// My plugin (/my-plugin): the plugin's starter view. Replace it with your own; wrap new views in ViewLayout.
import {
  ArrowSquareOut,
  FilePlus,
  PencilSimple,
  Robot,
} from "@phosphor-icons/react";
import {
  HvButton,
  HvContainer,
  HvIconContainer,
  HvTypography,
} from "@pentaho/uikit-react-core";

const copy = {
  title: "My plugin",
  description: "My plugin, a Pentaho plugin.",
  docs: "Read the UI Kit docs",
  steps: [
    {
      Icon: PencilSimple,
      title: "Edit this view",
      text: "npm run dev reloads it as you save.",
      code: "src/pages/my-plugin.tsx",
    },
    {
      Icon: FilePlus,
      title: "Add a view",
      text: "Add it here, with its page in src/pages.",
      code: "plugin.json",
    },
    {
      Icon: Robot,
      title: "Set up your coding agent",
      text: "Teach it the UI Kit's components and rules.",
      code: "npx --no-install uikit-tools init",
    },
  ],
};

export default function View() {
  return (
    <HvContainer
      maxWidth="md"
      className="flex flex-col items-center gap-lg py-lg md:py-xl"
    >
      <div className="flex flex-col gap-xs text-center">
        <HvTypography variant="title1" component="h1">
          {copy.title}
        </HvTypography>
        <HvTypography>{copy.description}</HvTypography>
      </div>
      <ol className="grid w-full gap-sm md:grid-cols-3">
        {copy.steps.map(({ Icon, title, text, code }) => (
          <li
            key={title}
            className="flex flex-col items-start gap-sm rounded-large border border-borderSubtle bg-bgContainer p-md"
          >
            <HvIconContainer
              size="sm"
              className="rounded-round bg-bgContainerSecondary p-xs"
            >
              <Icon aria-hidden />
            </HvIconContainer>
            <div className="flex flex-col gap-xxs">
              <HvTypography variant="label" component="h2">
                {title}
              </HvTypography>
              <HvTypography className="text-textSubtle">{text}</HvTypography>
            </div>
            <HvTypography
              variant="caption1"
              component="code"
              className="mt-auto break-all rounded-base bg-bgContainerSecondary px-xs py-xxs"
            >
              {code}
            </HvTypography>
          </li>
        ))}
      </ol>
      <HvButton
        variant="secondaryGhost"
        component="a"
        href="https://pentaho.github.io/uikit-docs/master/"
        target="_blank"
        rel="noreferrer"
        endIcon={<ArrowSquareOut aria-hidden />}
      >
        {copy.docs}
      </HvButton>
    </HvContainer>
  );
}
