import {
  HvAppShellEventTheme,
  HvAppShellEventThemeTrigger,
} from "@hitachivantara/app-shell-events";
import {
  HvButton,
  HvGlobalActions,
  HvGrid,
  HvThemeColorMode,
  HvTypography,
  useTheme,
} from "@hitachivantara/uikit-react-core";

const splitAndCapitalize = (inputString: string) => {
  // Split the string at each capitalized letter
  const parts = inputString.split(/(?=[A-Z])/);

  // Capitalize the first letter of each part and join them with a space
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const Theming = () => {
  const { selectedMode, colorModes } = useTheme();

  const renderTriggerColorModeSwitchButton = (colorMode: HvThemeColorMode) => {
    const triggerColorModeSwitchHandler = () => {
      const customEvent = new CustomEvent<HvAppShellEventTheme>(
        HvAppShellEventThemeTrigger,
        {
          detail: {
            colorMode,
          },
        },
      );
      globalThis.dispatchEvent(customEvent);
    };

    const label = splitAndCapitalize(colorMode);

    return (
      <HvButton
        key={`${colorMode}_button`}
        aria-label={label}
        type="button"
        variant={colorMode === selectedMode ? "primary" : "secondary"}
        onClick={triggerColorModeSwitchHandler}
      >
        {label}
      </HvButton>
    );
  };

  return (
    <>
      <HvGlobalActions title="Theming" className="mb-xs" />

      <HvGrid container className="mb-xs">
        <HvGrid item xs={12} display="flex" justifyContent="center">
          <HvTypography variant="title3">Color mode</HvTypography>
        </HvGrid>

        <HvGrid item xs={12} display="flex" justifyContent="space-evenly">
          {colorModes.map((colorMode) =>
            renderTriggerColorModeSwitchButton(colorMode),
          )}
        </HvGrid>
      </HvGrid>
    </>
  );
};

export default Theming;
