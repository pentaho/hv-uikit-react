import { useTranslation } from "react-i18next";
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

const steps = [
  { id: "edit", Icon: PencilSimple },
  { id: "add", Icon: FilePlus },
  { id: "agent", Icon: Robot },
];

export function Component() {
  const { t } = useTranslation("home");

  return (
    <HvContainer
      maxWidth="md"
      disableGutters
      className="flex flex-col items-center gap-lg py-lg md:py-xl"
    >
      <div className="flex flex-col gap-xs text-center">
        <HvTypography variant="title1" component="h1">
          {t("title")}
        </HvTypography>
        <HvTypography>{t("description")}</HvTypography>
      </div>
      <ol className="grid w-full gap-sm md:grid-cols-3">
        {steps.map(({ id, Icon }) => (
          <li
            key={id}
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
                {t(`steps.${id}.title`)}
              </HvTypography>
              <HvTypography className="text-textSubtle">
                {t(`steps.${id}.text`)}
              </HvTypography>
            </div>
            <HvTypography
              variant="caption1"
              component="code"
              className="mt-auto break-all rounded-base bg-bgContainerSecondary px-xs py-xxs"
            >
              {t(`steps.${id}.code`)}
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
        {t("docs")}
      </HvButton>
    </HvContainer>
  );
}
